// Explicit hosted test with a synthetic code inserted by the operator only.
// Does not list/read sale codes or print the issued license token.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const code = process.env.DOCUMIND_QA_CODE;
if (!code || !process.env.DOCUMIND_QA_PUBLIC_KEY_FILE) throw Error('Explicit synthetic QA credential and public verification key file required');
const base = 'https://lqoyxisudmmhikrgdofg.functions.supabase.co/';
const email = 'synthetic-20261017@qa.example.invalid';
let device = 'b'.repeat(64);
const key = await crypto.subtle.importKey('raw', Buffer.from(readFileSync(process.env.DOCUMIND_QA_PUBLIC_KEY_FILE,'utf8').trim(),'base64url'), 'Ed25519', false, ['verify']);
const checks = [];
async function post(name, body) {
  const response = await fetch(base + name, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  return {status:response.status,data:await response.json()};
}
async function verify(token) {
  const [payload,sig] = token.split('.');
  assert.equal(await crypto.subtle.verify('Ed25519',key,Buffer.from(sig,'base64url'),new TextEncoder().encode(payload)),true);
  const claims=JSON.parse(Buffer.from(payload,'base64url').toString());
  assert.equal(claims.product,'documind-ai'); assert.equal(claims.device_hash,device); assert.equal(claims.tier,1);
  return claims;
}
try {
  const redeemed=await post('redeem-appsumo-code',{code,email});
  assert.equal(redeemed.data.ok,true,redeemed.data.error); assert.equal(redeemed.data.tier,1);
  checks.push('Hosted redemption with synthetic code');
  const candidates=['b'.repeat(64),'c'.repeat(64)];
  const competing=await Promise.all(candidates.map(device_hash=>post('activate-documind-license',{code,email,device_hash})));
  const winner=competing.findIndex(r=>r.data.ok===true);
  assert.ok(winner>=0); assert.equal(competing.filter(r=>r.data.ok===true).length,1);
  assert.equal(competing[1-winner].data.error,'device_limit_reached');
  device=candidates[winner];
  checks.push('Concurrent first-device activation permits exactly one winner');
  const activated=competing[winner];
  assert.equal(activated.data.ok,true,activated.data.error);
  const claims=await verify(activated.data.token);
  checks.push('Hosted issuance verifies against pinned public key');
  const repeated=await post('activate-documind-license',{code,email,device_hash:device});
  assert.equal((await verify(repeated.data.token)).license_id,claims.license_id);
  checks.push('Same-device activation is idempotent');
  const overflow=await post('activate-documind-license',{code,email,device_hash:'d'.repeat(64)});
  assert.equal(overflow.data.error,'device_limit_reached');
  checks.push('Hosted tier-one second device rejected');
  const refreshed=await post('refresh-documind-license',{token:activated.data.token});
  assert.equal(refreshed.data.ok,true,refreshed.data.error); await verify(refreshed.data.token);
  checks.push('Hosted signed refresh verified');
  const fake=await post('refresh-documind-license',{token:activated.data.token+'x'});
  assert.equal(fake.data.ok,false);
  checks.push('Tampered token rejected by hosted server');
  console.log(`${checks.length} hosted purchase checks passed; no commercial codes used.`);
} finally {
  writeFileSync('tests/hosted-purchase-qa-result.json', JSON.stringify({at:new Date().toISOString(),checks,scope:'Synthetic credential only; operator removes its isolated rows after test'},null,2));
}
