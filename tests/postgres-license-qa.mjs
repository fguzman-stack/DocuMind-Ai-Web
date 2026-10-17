// Run actual migration/function SQL in a disposable in-memory PostgreSQL WASM
// engine. No production connection or real sale codes. PGlite is single-session:
// concurrent independent connections still need staging verification.
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { activationHandler } from "../supabase/functions/_shared/offline-license.ts";

const qaDirectory = process.argv[2];
if (!qaDirectory) throw Error("Pass an isolated QA tools directory containing @electric-sql/pglite@0.5.10");
const require = createRequire(join(resolve(qaDirectory), "package.json"));
const { PGlite } = require("@electric-sql/pglite");
const db = new PGlite();
const hash = value => createHash("sha256").update(value).digest("hex");
let checks = 0;
function pass(name) { checks++; console.log(`PASS ${name}`); }
const redeem = async (code, email) => (await db.query("SELECT public.redeem_documind_code($1,$2) AS result", [hash(code), email])).rows[0].result;
const activate = async (code, email, device) => (await db.query("SELECT public.activate_documind_device($1,$2,$3) AS result", [hash(code), email, hash(device)])).rows[0].result;
const codes = Array.from({ length: 10 }, (_, i) => `DMND-QA${String(i).padStart(2,"0")}-TEST-TEST`);
try {
  await db.exec("CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;");
  await db.exec(readFileSync("supabase/migrations/20261013180000_appsumo_redemption.sql", "utf8"));
  const migration = readFileSync("supabase/migrations/20261017210000_offline_licensing.sql", "utf8");
  await db.exec(migration);
  await db.exec(migration);
  pass("migration applies and is repeatable");
  for (const code of codes) await db.query("INSERT INTO public.appsumo_codes(code_hash) VALUES ($1)", [hash(code)]);

  const a = "qa-a@example.invalid", b = "qa-b@example.invalid";
  assert.equal((await redeem(codes[0], a)).tier, 1);
  const repeated = await redeem(codes[0], a);
  assert.equal(repeated.tier, 1); assert.equal(repeated.already_redeemed, true);
  pass("same code and buyer is idempotent, not an upgrade");
  assert.equal((await redeem(codes[0], b)).error, "already_redeemed");
  pass("a redeemed code cannot switch buyer");
  assert.equal((await redeem(codes[1], a)).tier, 2);
  assert.equal((await redeem(codes[2], a)).tier, 3);
  assert.equal((await redeem(codes[3], a)).error, "stack_limit_reached");
  assert.equal((await db.query("SELECT status FROM public.appsumo_codes WHERE code_hash=$1", [hash(codes[3])])).rows[0].status, "unused");
  pass("stacking reaches 1/2/3 and rejects a fourth code without consuming it");
  assert.equal((await activate(codes[3], a, "unused-code")).ok, false);
  pass("unredeemed purchase does not allocate devices");
  let first;
  for (let i = 0; i < 10; i++) {
    const result = await activate(codes[0], a, `a-device-${i}`);
    assert.equal(result.ok, true); assert.equal(result.tier, 3);
    if (!i) first = result.license_id;
  }
  assert.equal((await activate(codes[0], a, "a-device-0")).license_id, first);
  assert.equal((await activate(codes[0], a, "a-device-11")).error, "device_limit_reached");
  pass("tier 3 permits ten devices; same-device reactivation is idempotent");

  assert.equal((await redeem(codes[4], b)).tier, 1);
  assert.equal((await activate(codes[4], b, "b-device-1")).ok, true);
  assert.equal((await activate(codes[4], b, "b-device-2")).error, "device_limit_reached");
  assert.equal((await redeem(codes[5], b)).tier, 2);
  assert.equal((await activate(codes[4], b, "b-device-2")).ok, true);
  assert.equal((await activate(codes[4], b, "b-device-3")).ok, true);
  assert.equal((await activate(codes[4], b, "b-device-4")).error, "device_limit_reached");
  pass("upgrade from tier 1 to 2 increases device capacity without deleting data");
  await db.query("UPDATE public.documind_device_licenses SET revoked_at=now() WHERE email=$1 AND device_hash=$2", [b, hash("b-device-1")]);
  assert.equal((await activate(codes[4], b, "b-device-1")).error, "device_revoked");
  pass("revoked device cannot silently reactivate");
  await db.query("UPDATE public.appsumo_codes SET status='disabled' WHERE code_hash=$1", [hash(codes[4])]);
  assert.equal((await activate(codes[4], b, "b-device-5")).ok, false);
  assert.equal((await redeem(codes[4], b)).error, "disabled_code");
  pass("disabled purchase cannot redeem or issue a new token");
  const b2 = (await db.query("SELECT id FROM public.documind_device_licenses WHERE email=$1 AND device_hash=$2", [b,hash("b-device-2")])).rows[0].id;
  const b3 = (await db.query("SELECT id FROM public.documind_device_licenses WHERE email=$1 AND device_hash=$2", [b,hash("b-device-3")])).rows[0].id;
  assert.equal((await db.query("SELECT public.inspect_documind_entitlement($1,$2) AS result", [b2,hash("b-device-2")])).rows[0].result.tier, 1);
  assert.equal((await db.query("SELECT public.inspect_documind_entitlement($1,$2) AS result", [b3,hash("b-device-3")])).rows[0].result.active, false);
  assert.equal((await activate(codes[5],b,"b-device-3")).error,"device_limit_reached");
  pass("refund downgrade enforces the reduced device allowance on online checks");

  await db.exec("SET ROLE anon");
  await assert.rejects(db.query("SELECT public.activate_documind_device($1,$2,$3)", [hash(codes[0]), a, hash("attacker")]));
  await assert.rejects(db.query("SELECT public.redeem_documind_code($1,$2)", [hash(codes[0]), a]));
  await assert.rejects(db.query("SELECT * FROM public.documind_device_licenses"));
  await assert.rejects(db.query("SELECT public.inspect_documind_entitlement($1,$2)", [first, hash("a-device-0")]));
  await db.exec("RESET ROLE");
  pass("anonymous users cannot call privileged RPCs or read device licenses");

  assert.equal((await db.query("SELECT public.inspect_documind_entitlement($1,$2) AS result", [first, hash("a-device-0")])).rows[0].result.tier, 3);
  await db.query("UPDATE public.documind_device_licenses SET revoked_at=now() WHERE id=$1", [first]);
  assert.equal((await db.query("SELECT public.inspect_documind_entitlement($1,$2) AS result", [first, hash("a-device-0")])).rows[0].result.active, false);
  await db.query("UPDATE public.documind_device_licenses SET revoked_at=NULL WHERE id=$1", [first]);
  pass("online entitlement check detects revoked devices");

  const keys = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"]);
  const handler = activationHandler({ signingKey: async () => keys.privateKey, authorize: async (codeHash, email, deviceHash) => {
    return (await db.query("SELECT public.activate_documind_device($1,$2,$3) AS result", [codeHash, email, deviceHash])).rows[0].result;
  } });
  const response = await handler(new Request("https://qa.invalid", { method: "POST", body: JSON.stringify({ code: codes[0], email: a, device_hash: hash("a-device-0") }) }));
  assert.equal(response.status, 200);
  const token = (await response.json()).token;
  const [payload, signature] = token.split(".");
  assert.equal(await crypto.subtle.verify("Ed25519", keys.publicKey, Buffer.from(signature, "base64url"), new TextEncoder().encode(payload)), true);
  assert.equal(JSON.parse(Buffer.from(payload, "base64url").toString()).tier, 3);
  pass("actual SQL authorization integrates with the real Ed25519 issuer");

  for (let i = 0; i < 35; i++) {
    const result = await activate(codes[0], a, `rate-device-${i}`);
    if (result.error === "rate_limited") { pass("activation attempt rate limit is enforced"); break; }
    if (i === 34) assert.fail("rate limit did not activate");
  }
  console.log(`${checks}/${checks} PostgreSQL QA checks passed (isolated, single-session engine).`);
} finally { await db.close(); }
