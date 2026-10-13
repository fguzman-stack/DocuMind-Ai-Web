# DocuMind AI AppSumo redemption with Supabase

This repo uses Supabase for secure AppSumo code redemption.

## What changed

- The browser no longer validates codes against `valid_code_hashes.json`.
- The activation page calls a Supabase Edge Function.
- Supabase marks each code as redeemed atomically, so two buyers cannot redeem the same code.
- The raw AppSumo codes CSV must never be committed.

## Required Supabase secrets

The Edge Function uses Supabase built-in env vars:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not expose the service role key in frontend code.

## Deploy

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase functions deploy redeem-appsumo-code --no-verify-jwt
```

## Import codes

Generate a local SQL file from the private CSV:

```bash
node scripts/build-supabase-seed.cjs C:\Users\holam\Desktop\documind-appsumo-fix\appsumo_codes.csv C:\Users\holam\Desktop\documind-appsumo-fix\seed-appsumo-codes.sql
```

Then run the SQL in Supabase SQL Editor, or use psql with your database connection.

## Frontend config

Update `activate-4txntb.html`:

```js
var REDEEM_ENDPOINT = "https://YOUR_PROJECT_REF.functions.supabase.co/redeem-appsumo-code";
```

After that, commit and push to GitHub Pages.
