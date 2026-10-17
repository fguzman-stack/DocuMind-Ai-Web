type Grant = { ok: boolean; error?: string; license_id?: string; tier?: number };
type Dependencies = {
  signingKey: () => Promise<CryptoKey>;
  authorize: (codeHash: string, email: string, deviceHash: string) => Promise<Grant>;
  now?: () => number;
};

export function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function importSigningKey(encoded: string): Promise<CryptoKey> {
  if (!/^[A-Za-z0-9_-]+$/.test(encoded) || encoded.length > 4096) throw new Error("Invalid signing configuration");
  const raw = atob(encoded.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - encoded.length % 4) % 4));
  return crypto.subtle.importKey("pkcs8", Uint8Array.from(raw, c => c.charCodeAt(0)), { name: "Ed25519" }, false, ["sign"]);
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_request");
  const parts: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); throw new Error("request_too_large"); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.byteLength; }
  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid_request");
  return parsed;
}

export function activationHandler(deps: Dependencies) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin");
    const allowed = ["https://fguzman-stack.github.io", "tauri://localhost", "http://tauri.localhost", "https://tauri.localhost"];
    const headers: Record<string, string> = {
      "Content-Type": "application/json", "Cache-Control": "no-store", "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type, apikey, authorization",
    };
    if (origin && !allowed.includes(origin)) return new Response(null, { status: 403 });
    if (origin) headers["Access-Control-Allow-Origin"] = origin;
    const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
    let body: Record<string, unknown>;
    try { body = await readJson(request); } catch { return json({ ok: false, error: "invalid_request" }, 400); }
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const device = typeof body.device_hash === "string" ? body.device_hash : "";
    if (!/^DMND-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code) || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[a-f0-9]{64}$/.test(device)) {
      return json({ ok: false, error: "invalid_activation" }, 400);
    }
    try {
      // Check key configuration before consuming any device allocation.
      const key = await deps.signingKey();
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
      const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
      const grant = await deps.authorize(hash, email, device);
      if (!grant.ok) return json({ ok: false, error: grant.error ?? "activation_denied" }, 403);
      if (!Number.isInteger(grant.tier) || grant.tier! < 1 || grant.tier! > 3 ||
        !/^[a-f0-9-]{36}$/.test(grant.license_id ?? "")) throw new Error("Invalid authorization result");
      const claims = {
        v: 1, product: "documind-ai", license_id: grant.license_id,
        device_hash: device, tier: grant.tier, issued_at: deps.now?.() ?? Math.floor(Date.now() / 1000),
      };
      const payload = base64url(new TextEncoder().encode(JSON.stringify(claims)));
      const signature = await crypto.subtle.sign("Ed25519", key, new TextEncoder().encode(payload));
      return json({ ok: true, token: `${payload}.${base64url(new Uint8Array(signature))}` });
    } catch {
      // Never return or log the code, email, private key, token or database error.
      return json({ ok: false, error: "activation_unavailable" }, 503);
    }
  };
}

export async function importVerificationKey(encoded: string): Promise<CryptoKey> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(encoded)) throw new Error("Invalid verification configuration");
  const raw = atob(encoded.replace(/-/g, "+").replace(/_/g, "/") + "=");
  return crypto.subtle.importKey("raw", Uint8Array.from(raw, c => c.charCodeAt(0)), "Ed25519", false, ["verify"]);
}

type RefreshDependencies = {
  signingKey: () => Promise<CryptoKey>;
  verificationKey: () => Promise<CryptoKey>;
  inspect: (licenseId: string, deviceHash: string) => Promise<{ ok: boolean; active: boolean; tier: number }>;
};

export function refreshHandler(deps: RefreshDependencies) {
  return async (request: Request): Promise<Response> => {
    const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
    const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });
    if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
    let body;
    try { body = await readJson(request); } catch { return json({ ok: false, error: "invalid_request" }, 400); }
    const token = typeof body.token === "string" ? body.token : "";
    if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token) || token.length > 4096) return json({ ok: false, error: "invalid_license" }, 401);
    try {
      const [payload, encodedSignature] = token.split(".");
      const decode = (value: string) => Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4-value.length%4)%4)), c => c.charCodeAt(0));
      const valid = await crypto.subtle.verify("Ed25519", await deps.verificationKey(), decode(encodedSignature), new TextEncoder().encode(payload));
      if (!valid) return json({ ok: false, error: "invalid_license" }, 401);
      const claims = JSON.parse(new TextDecoder().decode(decode(payload)));
      if (claims.v !== 1 || claims.product !== "documind-ai" || !/^[a-f0-9-]{36}$/.test(claims.license_id ?? "") || !/^[a-f0-9]{64}$/.test(claims.device_hash ?? "")) {
        return json({ ok: false, error: "invalid_license" }, 401);
      }
      const result = await deps.inspect(claims.license_id, claims.device_hash);
      if (result.ok !== true || typeof result.active !== "boolean" || (result.active && (!Number.isInteger(result.tier) || result.tier < 1 || result.tier > 3))) throw new Error("Invalid entitlement response");
      // Tier zero is a signed revocation receipt. Clients must not infer
      // revocation from an unsigned HTTP error or an unavailable server.
      const next = { v: 1, product: "documind-ai", license_id: claims.license_id, device_hash: claims.device_hash, tier: result.active ? result.tier : 0, issued_at: Math.floor(Date.now()/1000) };
      const encoded = base64url(new TextEncoder().encode(JSON.stringify(next)));
      const signature = await crypto.subtle.sign("Ed25519", await deps.signingKey(), new TextEncoder().encode(encoded));
      return json({ ok: true, token: `${encoded}.${base64url(new Uint8Array(signature))}` });
    } catch { return json({ ok: false, error: "refresh_unavailable" }, 503); }
  };
}
