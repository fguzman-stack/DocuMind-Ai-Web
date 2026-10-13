const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const csvPath = process.argv[2];
const outPath = process.argv[3] || path.join(process.cwd(), 'supabase', 'seed-appsumo-codes.sql');

if (!csvPath) {
  console.error('Usage: node scripts/build-supabase-seed.cjs <appsumo_codes.csv> [output.sql]');
  process.exit(1);
}

const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
if (lines.length < 2) throw new Error('CSV must include a header and at least one code');
const codes = lines.slice(1);
const values = codes.map((code) => {
  const hash = crypto.createHash('sha256').update(code.toUpperCase()).digest('hex');
  let tier = 1;
  // AppSumo code stacking controls tier. Every individual code starts as tier 1.
  return `('${hash}', ${tier}, 'unused')`;
});
const sql = `insert into public.appsumo_codes (code_hash, tier, status)\nvalues\n${values.join(',\n')}\non conflict (code_hash) do nothing;\n`;
fs.writeFileSync(outPath, sql, 'utf8');
console.log(JSON.stringify({ codes: codes.length, outPath }, null, 2));
