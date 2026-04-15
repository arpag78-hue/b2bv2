# BelgaumB2B v3 — Deployment Guide
# For already-deployed site at belb2b.vercel.app

## ── STEP 1: Fix Supabase (5 min) ──────────────────────────

### 1a. Disable email confirmations (fixes login error)
1. supabase.com → your project → Authentication → Settings
2. Scroll to "Email OTP" section
3. Toggle OFF "Enable email confirmations"
4. Click Save

### 1b. Run new schema
1. Supabase → SQL Editor → New Query
2. Paste entire contents of supabase_schema.sql
3. Click Run (green button)
4. Should say "Success. No rows returned"

## ── STEP 2: Add environment variables (3 min) ─────────────

### In Vercel:
1. vercel.com → your project (belb2b) → Settings → Environment Variables
2. Add / update these:

   VITE_SUPABASE_URL      = https://YOURPROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJ...your anon key...
   VITE_CLAUDE_KEY        = sk-ant-...  ← enables all 6 AI features

### Get Claude API key (free $5 credit):
1. console.anthropic.com → sign up
2. API Keys → Create Key
3. Copy it → paste as VITE_CLAUDE_KEY in Vercel

## ── STEP 3: Deploy v3 (5 min) ─────────────────────────────

### Option A: Replace files in GitHub (easiest)
1. Extract this zip
2. Go to your GitHub repo (belgaum-b2b)
3. Upload all files from the belgaum-v3 folder
   (drag & drop in GitHub UI, or use git push)
4. Vercel auto-deploys on push

### Option B: Git push (recommended)
Open terminal in the belgaum-v3 folder:

  git init
  git add .
  git commit -m "v3 - AI features + forgot password + phone"
  git remote add origin https://github.com/YOURNAME/belgaum-b2b.git
  git push --force origin main

Vercel will auto-deploy in ~2 minutes.

## ── STEP 4: Make yourself admin (2 min) ───────────────────

1. Register on the live site with your email
2. Supabase → SQL Editor → run:

   update profiles set role = 'admin'
   where id = (select id from auth.users where email = 'your@email.com');

3. Visit /admin on your site — full dashboard unlocked

## ── 6 AI FEATURES MAP ─────────────────────────────────────

Feature #1 — Smart Match       → Dashboard (purple card)
Feature #2 — Enquiry Writer    → Profile page → "AI Write" button
Feature #3 — Profile Generator → Register → "AI Generate" button
Feature #4 — Market Insights   → Dashboard (orange card)
Feature #5 — Search Assist     → Directory → appears as you type
Feature #6 — Price Negotiation → Profile page → "Price Negotiation" tab

All AI features require VITE_CLAUDE_KEY in Vercel env vars.
Without it, the UI shows a message to add the key — nothing breaks.

## ── WHAT'S NEW IN V3 ─────────────────────────────────────

✅ Forgot Password on login page
✅ Phone number visible everywhere (directory, admin, profiles)
✅ All 6 AI features properly wired
✅ Beautiful hover animations throughout
✅ Animated hero with floating stats
✅ Pulse dot "online" indicator in navbar
✅ Admin panel shows phone in all tables
✅ Category filter bar with emoji
✅ MRR estimate in admin overview
✅ Price negotiation AI feature (tab on profile page)
✅ Staggered fade-in animations on landing
✅ Glow effects on CTA buttons
✅ Fixed all auth errors with better error messages
