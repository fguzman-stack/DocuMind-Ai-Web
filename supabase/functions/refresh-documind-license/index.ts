import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { importSigningKey, importVerificationKey, refreshHandler } from "../_shared/offline-license.ts";

Deno.serve(refreshHandler({
  signingKey: () => importSigningKey(Deno.env.get("DOCUMIND_LICENSE_PRIVATE_KEY_PKCS8") ?? ""),
  verificationKey: () => importVerificationKey(Deno.env.get("DOCUMIND_LICENSE_PUBLIC_KEY") ?? ""),
  async inspect(licenseId, deviceHash) {
    const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.rpc("inspect_documind_entitlement", { p_license_id: licenseId, p_device_hash: deviceHash });
    if (error) throw new Error("Entitlement unavailable");
    return data;
  },
}));
