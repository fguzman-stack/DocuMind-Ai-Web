import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { activationHandler, importSigningKey } from "../_shared/offline-license.ts";

Deno.serve(activationHandler({
  async signingKey() {
    const encoded = Deno.env.get("DOCUMIND_LICENSE_PRIVATE_KEY_PKCS8");
    if (!encoded) throw new Error("Signing key not configured");
    return importSigningKey(encoded);
  },
  async authorize(codeHash, email, deviceHash) {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) throw new Error("Server not configured");
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.rpc("activate_documind_device", {
      p_code_hash: codeHash, p_email: email, p_device_hash: deviceHash,
    });
    if (error) throw new Error("Authorization unavailable");
    return data;
  },
}));
