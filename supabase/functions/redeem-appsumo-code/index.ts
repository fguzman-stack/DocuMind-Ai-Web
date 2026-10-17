import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CODE_REGEX = /^DMND-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) return json({ ok: false, error: "server_not_configured" }, 500);

    const body = await req.json().catch(() => ({}));
    const code = String(body.code || "").trim().toUpperCase();
    const email = String(body.email || "").trim().toLowerCase();

    if (!CODE_REGEX.test(code)) return json({ ok: false, error: "invalid_code_format" }, 400);
    if (!EMAIL_REGEX.test(email)) return json({ ok: false, error: "invalid_email" }, 400);

    const codeHash = await sha256Hex(code);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || null;
    const userAgent = req.headers.get("user-agent") || null;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.rpc("redeem_documind_code", {
      p_code_hash: codeHash,
      p_email: email,
      p_ip: ip,
      p_user_agent: userAgent,
    });

    if (error) {
      console.error(error);
      return json({ ok: false, error: "server_error" }, 500);
    }

    if (!data?.ok) {
      const status = data?.error === "already_redeemed" ? 409 : 400;
      return json(data, status);
    }

    return json({
      ok: true,
      tier: data.tier,
      already_redeemed: Boolean(data.already_redeemed),
      email: data.redeemed_email,
      download_url: "https://github.com/fguzman-stack/Documind-DD/releases/download/v0.1.1/DocuMind.AI_0.1.1_x64-setup.exe",
    });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "server_error" }, 500);
  }
});
