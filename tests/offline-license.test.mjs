import test from "node:test";
import assert from "node:assert/strict";
import { activationHandler, base64url, importSigningKey, importVerificationKey, refreshHandler } from "../supabase/functions/_shared/offline-license.ts";

const keys = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"]);
const body = { code: "DMND-TEST-TEST-TEST", email: "qa@example.invalid", device_hash: "a".repeat(64) };
const grant = { ok: true, license_id: "00000000-0000-4000-8000-000000000001", tier: 2 };
const request = (value = body, origin) => new Request("https://example.invalid/activate", {
  method: "POST", headers: { "Content-Type": "application/json", ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify(value),
});
const decode = value => Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4-value.length%4)%4)), c => c.charCodeAt(0));

test("valid purchase authorization produces a device-bound Ed25519 signature without expiry or PII", async () => {
  let called = false;
  const handler = activationHandler({
    signingKey: async () => keys.privateKey, now: () => 1000,
    authorize: async (hash, email, device) => {
      assert.match(hash, /^[a-f0-9]{64}$/); assert.notEqual(hash, body.code);
      assert.equal(email, body.email); assert.equal(device, body.device_hash);
      called = true; return grant;
    },
  });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const { token } = await response.json();
  const [payload, signature] = token.split(".");
  assert.equal(await crypto.subtle.verify("Ed25519", keys.publicKey, decode(signature), new TextEncoder().encode(payload)), true);
  const claims = JSON.parse(new TextDecoder().decode(decode(payload)));
  assert.equal(claims.product, "documind-ai"); assert.equal(claims.tier, 2);
  assert.equal(claims.device_hash, body.device_hash); assert.equal(claims.issued_at, 1000);
  assert.equal(claims.exp, undefined); assert.equal(claims.email, undefined); assert.equal(claims.code, undefined);
  assert.equal(called, true);
  assert.equal(await crypto.subtle.verify("Ed25519", keys.publicKey, decode(signature), new TextEncoder().encode(payload + "A")), false);
});

test("PKCS8 signing key import works, invalid configuration fails", async () => {
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", keys.privateKey);
  const imported = await importSigningKey(base64url(new Uint8Array(pkcs8)));
  const message = new TextEncoder().encode("synthetic QA");
  const sig = await crypto.subtle.sign("Ed25519", imported, message);
  assert.equal(await crypto.subtle.verify("Ed25519", keys.publicKey, sig, message), true);
  await assert.rejects(importSigningKey("not valid key!"));
});

test("missing signing key does not allocate a device and does not disclose secrets", async () => {
  let calls = 0;
  const handler = activationHandler({ signingKey: async () => { throw Error("private diagnostic"); }, authorize: async () => { calls++; return grant; } });
  const response = await handler(request());
  assert.equal(response.status, 503); assert.equal(calls, 0);
  assert.deepEqual(await response.json(), { ok: false, error: "activation_unavailable" });
});

test("malformed requests never call authorization", async () => {
  const handler = activationHandler({ signingKey: async () => keys.privateKey, authorize: async () => assert.fail("unexpected authorization") });
  for (const value of [{ ...body, code: "bad" }, { ...body, email: "bad" }, { ...body, device_hash: "bad" }, { ...body, extra: "x".repeat(5000) }]) {
    assert.equal((await handler(request(value))).status, 400);
  }
});

test("denied or revoked purchases never receive a token", async () => {
  const handler = activationHandler({ signingKey: async () => keys.privateKey, authorize: async () => ({ ok: false, error: "device_revoked" }) });
  const response = await handler(request());
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { ok: false, error: "device_revoked" });
});

test("an invalid backend tier cannot be signed", async () => {
  const handler = activationHandler({ signingKey: async () => keys.privateKey, authorize: async () => ({ ...grant, tier: 99 }) });
  assert.equal((await handler(request())).status, 503);
});

test("CORS is restricted, OPTIONS is safe, non-POST methods are rejected", async () => {
  const handler = activationHandler({ signingKey: async () => keys.privateKey, authorize: async () => grant });
  assert.equal((await handler(request(body, "https://untrusted.invalid"))).status, 403);
  const allowed = await handler(request(body, "https://fguzman-stack.github.io"));
  assert.equal(allowed.headers.get("Access-Control-Allow-Origin"), "https://fguzman-stack.github.io");
  assert.equal((await handler(new Request("https://example.invalid", { method: "OPTIONS" }))).status, 204);
  assert.equal((await handler(new Request("https://example.invalid"))).status, 405);
});

test("refresh verifies existing signature before authorization and signs upgrades", async () => {
  const issuer = activationHandler({ signingKey: async () => keys.privateKey, authorize: async () => grant });
  const token = (await (await issuer(request())).json()).token;
  const raw = await crypto.subtle.exportKey("raw", keys.publicKey);
  const publicKey = await importVerificationKey(base64url(new Uint8Array(raw)));
  let inspections = 0;
  const refresh = refreshHandler({ signingKey: async () => keys.privateKey, verificationKey: async () => publicKey,
    inspect: async () => { inspections++; return { ok: true, active: true, tier: 3 }; } });
  const next = await refresh(request({ token }));
  const [payload, signature] = (await next.json()).token.split(".");
  assert.equal(await crypto.subtle.verify("Ed25519", publicKey, decode(signature), new TextEncoder().encode(payload)), true);
  assert.equal(JSON.parse(new TextDecoder().decode(decode(payload))).tier, 3);
  assert.equal(inspections, 1);
  const [oldPayload, oldSignature] = token.split(".");
  assert.equal((await refresh(request({ token: `${oldPayload}A.${oldSignature}` }))).status, 401);
  assert.equal(inspections, 1);
});

test("revocation is an authenticated zero-tier receipt, not an unsigned error", async () => {
  const issuer = activationHandler({ signingKey: async () => keys.privateKey, authorize: async () => grant });
  const token = (await (await issuer(request())).json()).token;
  const deps = { signingKey: async () => keys.privateKey, verificationKey: async () => keys.publicKey, inspect: async () => ({ ok: true, active: false, tier: 0 }) };
  const result = await refreshHandler(deps)(request({ token }));
  const [payload, signature] = (await result.json()).token.split(".");
  assert.equal(JSON.parse(new TextDecoder().decode(decode(payload))).tier, 0);
  assert.equal(await crypto.subtle.verify("Ed25519", keys.publicKey, decode(signature), new TextEncoder().encode(payload)), true);
  const unavailable = await refreshHandler({ ...deps, inspect: async () => { throw Error("database offline"); } })(request({ token }));
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).token, undefined);
});

test("malformed entitlement cannot turn into a revocation", async () => {
  const issuer = activationHandler({ signingKey: async () => keys.privateKey, authorize: async () => grant });
  const token = (await (await issuer(request())).json()).token;
  const handler = refreshHandler({ signingKey: async () => keys.privateKey, verificationKey: async () => keys.publicKey, inspect: async () => ({ ok: true }) });
  assert.equal((await handler(request({ token }))).status, 503);
});
