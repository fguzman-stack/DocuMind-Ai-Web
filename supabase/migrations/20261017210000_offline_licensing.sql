-- Additive migration. Never imports, replaces, exposes or deletes sale codes.
create table if not exists public.documind_device_licenses (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  device_hash text not null check (device_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (email, device_hash)
);
alter table public.documind_device_licenses enable row level security;
revoke all on public.documind_device_licenses from public, anon, authenticated;
grant select, insert, update on public.documind_device_licenses to service_role;

-- Serialize all redemptions for a buyer, so two different codes cannot race
-- past the stacking limit. Possession of a code is the purchase credential.
create or replace function public.redeem_documind_code(
  p_code_hash text, p_email text, p_ip text default null, p_user_agent text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_code public.appsumo_codes%rowtype;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_count integer;
  v_repeat boolean;
begin
  if p_code_hash is null or p_code_hash !~ '^[a-f0-9]{64}$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_code');
  end if;
  if length(v_email) > 254 or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_email');
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_email, 0));
  if (select count(*) from public.appsumo_redemption_attempts where email = v_email and created_at > now() - interval '5 minutes') >= 30 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;
  select * into v_code from public.appsumo_codes where code_hash = p_code_hash for update;
  if not found then
    insert into public.appsumo_redemption_attempts(code_hash,email,result,ip) values(p_code_hash,v_email,'not_found',p_ip);
    return jsonb_build_object('ok', false, 'error', 'invalid_code');
  end if;
  if v_code.status = 'disabled' then
    return jsonb_build_object('ok', false, 'error', 'disabled_code');
  end if;
  v_repeat := v_code.status = 'redeemed';
  if v_repeat and lower(coalesce(v_code.redeemed_email,'')) <> v_email then
    return jsonb_build_object('ok', false, 'error', 'already_redeemed');
  end if;
  select count(*)::integer into v_count from public.appsumo_codes where redeemed_email = v_email and status = 'redeemed';
  if not v_repeat and v_count >= 3 then
    return jsonb_build_object('ok', false, 'error', 'stack_limit_reached');
  end if;
  update public.appsumo_codes set
    status = 'redeemed', redeemed_email = v_email,
    redeemed_at = coalesce(redeemed_at, now()),
    redeemed_ip = coalesce(redeemed_ip, p_ip),
    redeemed_user_agent = coalesce(redeemed_user_agent, left(coalesce(p_user_agent,''),500)),
    redemption_count = redemption_count + 1, updated_at = now()
  where id = v_code.id;
  insert into public.appsumo_redemption_attempts(code_hash,email,result,ip,user_agent)
  values(p_code_hash,v_email,case when v_repeat then 'already_redeemed_same_email' else 'redeemed' end,p_ip,left(coalesce(p_user_agent,''),500));
  if not v_repeat then v_count := v_count + 1; end if;
  return jsonb_build_object('ok',true,'tier',least(v_count,3),'already_redeemed',v_repeat,'redeemed_email',v_email);
end;
$$;
revoke all on function public.redeem_documind_code(text,text,text,text) from public, anon, authenticated;
grant execute on function public.redeem_documind_code(text,text,text,text) to service_role;

create or replace function public.activate_documind_device(
  p_code_hash text, p_email text, p_device_hash text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(trim(coalesce(p_email,'')));
  v_count integer;
  v_tier integer;
  v_limit integer;
  v_device public.documind_device_licenses%rowtype;
begin
  if p_code_hash is null or p_code_hash !~ '^[a-f0-9]{64}$' or
     p_device_hash is null or p_device_hash !~ '^[a-f0-9]{64}$' or
     length(v_email) > 254 or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    return jsonb_build_object('ok',false,'error','invalid_activation');
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_email,0));
  if (select count(*) from public.appsumo_redemption_attempts where email = v_email and result = 'activation_attempt' and created_at > now() - interval '5 minutes') >= 30 then
    return jsonb_build_object('ok',false,'error','rate_limited');
  end if;
  insert into public.appsumo_redemption_attempts(code_hash,email,result)
  values(p_code_hash,v_email,'activation_attempt');
  if not exists(select 1 from public.appsumo_codes where code_hash = p_code_hash and status = 'redeemed' and redeemed_email = v_email) then
    return jsonb_build_object('ok',false,'error','redeem_code_first_or_check_email');
  end if;
  select least(count(*),3)::integer into v_tier from public.appsumo_codes where redeemed_email = v_email and status = 'redeemed';
  v_limit := case v_tier when 1 then 1 when 2 then 3 when 3 then 10 else 0 end;
  select * into v_device from public.documind_device_licenses where email = v_email and device_hash = p_device_hash for update;
  if found then
    if v_device.revoked_at is not null then return jsonb_build_object('ok',false,'error','device_revoked'); end if;
    select count(*)::integer into v_count from public.documind_device_licenses
      where email=v_email and revoked_at is null and (created_at,id) <= (v_device.created_at,v_device.id);
    if v_count > v_limit then return jsonb_build_object('ok',false,'error','device_limit_reached'); end if;
  else
    select count(*)::integer into v_count from public.documind_device_licenses where email = v_email and revoked_at is null;
    if v_count >= v_limit then return jsonb_build_object('ok',false,'error','device_limit_reached'); end if;
    insert into public.documind_device_licenses(email,device_hash) values(v_email,p_device_hash) returning * into v_device;
  end if;
  return jsonb_build_object('ok',true,'license_id',v_device.id,'tier',v_tier);
end;
$$;
revoke all on function public.activate_documind_device(text,text,text) from public, anon, authenticated;
grant execute on function public.activate_documind_device(text,text,text) to service_role;

create or replace function public.inspect_documind_entitlement(p_license_id uuid, p_device_hash text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_device public.documind_device_licenses%rowtype;
  v_tier integer;
  v_rank integer;
  v_limit integer;
begin
  select * into v_device from public.documind_device_licenses where id=p_license_id and device_hash=p_device_hash;
  if not found then return jsonb_build_object('ok',true,'active',false,'tier',0); end if;
  if v_device.revoked_at is not null then return jsonb_build_object('ok',true,'active',false,'tier',0); end if;
  select least(count(*),3)::integer into v_tier from public.appsumo_codes where redeemed_email=v_device.email and status='redeemed';
  v_limit := case v_tier when 1 then 1 when 2 then 3 when 3 then 10 else 0 end;
  select count(*)::integer into v_rank from public.documind_device_licenses
    where email=v_device.email and revoked_at is null and (created_at,id) <= (v_device.created_at,v_device.id);
  if v_rank > v_limit then return jsonb_build_object('ok',true,'active',false,'tier',0); end if;
  return jsonb_build_object('ok',true,'active',v_tier>0,'tier',v_tier);
end;
$$;
revoke all on function public.inspect_documind_entitlement(uuid,text) from public, anon, authenticated;
grant execute on function public.inspect_documind_entitlement(uuid,text) to service_role;
