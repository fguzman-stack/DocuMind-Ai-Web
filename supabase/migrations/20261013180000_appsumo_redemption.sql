create table if not exists public.appsumo_codes (
  id bigserial primary key,
  code_hash text not null unique,
  tier integer not null default 1 check (tier between 1 and 10),
  status text not null default 'unused' check (status in ('unused', 'redeemed', 'disabled')),
  redeemed_email text,
  redeemed_at timestamptz,
  redeemed_ip text,
  redeemed_user_agent text,
  redemption_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appsumo_redemption_attempts (
  id bigserial primary key,
  code_hash text,
  email text,
  result text not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.appsumo_codes enable row level security;
alter table public.appsumo_redemption_attempts enable row level security;

create or replace function public.redeem_documind_code(
  p_code_hash text,
  p_email text,
  p_ip text default null,
  p_user_agent text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.appsumo_codes%rowtype;
  v_email text := lower(trim(coalesce(p_email, '')));
begin
  if p_code_hash is null or length(p_code_hash) <> 64 then
    insert into public.appsumo_redemption_attempts(code_hash, email, result, ip, user_agent)
    values (p_code_hash, v_email, 'bad_hash', p_ip, p_user_agent);
    return jsonb_build_object('ok', false, 'error', 'invalid_code');
  end if;

  if v_email = '' or v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    insert into public.appsumo_redemption_attempts(code_hash, email, result, ip, user_agent)
    values (p_code_hash, v_email, 'bad_email', p_ip, p_user_agent);
    return jsonb_build_object('ok', false, 'error', 'invalid_email');
  end if;

  select * into v_code
  from public.appsumo_codes
  where code_hash = p_code_hash
  for update;

  if not found then
    insert into public.appsumo_redemption_attempts(code_hash, email, result, ip, user_agent)
    values (p_code_hash, v_email, 'not_found', p_ip, p_user_agent);
    return jsonb_build_object('ok', false, 'error', 'invalid_code');
  end if;

  if v_code.status = 'disabled' then
    insert into public.appsumo_redemption_attempts(code_hash, email, result, ip, user_agent)
    values (p_code_hash, v_email, 'disabled', p_ip, p_user_agent);
    return jsonb_build_object('ok', false, 'error', 'disabled_code');
  end if;

  if v_code.status = 'redeemed' then
    if lower(coalesce(v_code.redeemed_email, '')) = v_email then
      update public.appsumo_codes
      set redemption_count = redemption_count + 1,
          updated_at = now()
      where id = v_code.id;

      insert into public.appsumo_redemption_attempts(code_hash, email, result, ip, user_agent)
      values (p_code_hash, v_email, 'already_redeemed_same_email', p_ip, p_user_agent);

      return jsonb_build_object(
        'ok', true,
        'already_redeemed', true,
        'tier', v_code.tier,
        'redeemed_email', v_code.redeemed_email
      );
    end if;

    insert into public.appsumo_redemption_attempts(code_hash, email, result, ip, user_agent)
    values (p_code_hash, v_email, 'already_redeemed_other_email', p_ip, p_user_agent);

    return jsonb_build_object('ok', false, 'error', 'already_redeemed');
  end if;

  update public.appsumo_codes
  set status = 'redeemed',
      redeemed_email = v_email,
      redeemed_at = now(),
      redeemed_ip = p_ip,
      redeemed_user_agent = left(coalesce(p_user_agent, ''), 500),
      redemption_count = redemption_count + 1,
      updated_at = now()
  where id = v_code.id
  returning * into v_code;

  insert into public.appsumo_redemption_attempts(code_hash, email, result, ip, user_agent)
  values (p_code_hash, v_email, 'redeemed', p_ip, p_user_agent);

  return jsonb_build_object(
    'ok', true,
    'already_redeemed', false,
    'tier', v_code.tier,
    'redeemed_email', v_code.redeemed_email
  );
end;
$$;
