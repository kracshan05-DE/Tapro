# Tapro Site — Deployment Guide (Browser Only, No Local Setup)

Everything below happens in your browser using free web dashboards. You will not
run any commands on your office laptop — GitHub, Supabase, and Vercel all do the
actual building and hosting in the cloud.

You need 3 free accounts: **GitHub**, **Supabase**, **Vercel**. Sign up for each
with the same email if you like — takes a minute.

---

## Step 1 — Create a new Supabase project (separate from your other one)

1. Go to supabase.com → log in → **New project**.
2. Name it `tapro-site` (or anything you like), choose a database password
   (save it somewhere), pick a region close to your customers, and create it.
   Wait ~2 minutes while it provisions.
3. In the left sidebar, open **SQL Editor** → **New query**.
4. Open the file `sql/schema.sql` from this project, copy its entire contents,
   paste into the SQL editor, and click **Run**.
   This creates the `products` table, the `inquiries` table, the image storage
   bucket, and adds the 9 starting products (without photos — you'll add those
   from the admin dashboard).
5. Go to **Storage** in the sidebar and confirm a bucket named
   `product-images` now exists and is marked **Public**.
6. Go to **Project Settings → API**. You'll need two values from this page in
   Step 3:
   - **Project URL**
   - **anon public** key

### Create your admin login
1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter the email and password you want to log into `/admin` with.
   Tick **Auto Confirm User** so you don't need to click an email link.
3. That's your one and only login — this isn't a public sign-up system.

---

## Step 2 — Push this code to GitHub (via browser, no git needed)

1. Go to github.com → **New repository** → name it `tapro-site` → **Private**
   (recommended, since it contains your site's source) → **Create repository**.
2. On the new repo's page, click **uploading an existing file**.
3. Open the `tapro-site` project folder on your computer (from the zip I gave
   you) and **drag the entire contents of the folder** (not the folder itself
   — the files and subfolders inside it) into the GitHub upload box. Modern
   GitHub supports dragging whole folder structures at once.
4. Scroll down, click **Commit changes**.

   > Don't drag `node_modules` or `.next` if you happen to have them locally —
   > they aren't included in what I gave you, so this shouldn't come up.

---

## Step 3 — Deploy on Vercel

1. Go to vercel.com → log in with GitHub → **Add New → Project**.
2. Select your `tapro-site` repository → **Import**.
3. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL from Supabase Step 1.6 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon public key from Supabase Step 1.6 |

4. Click **Deploy**. Vercel installs everything and builds the site in the
   cloud — takes about 90 seconds.
5. You'll get a live URL like `tapro-site.vercel.app`. That's your site.

---

## Step 4 — Try it out

- Visit your `.vercel.app` URL — the public site, reading products live from
  Supabase.
- Visit `your-url.vercel.app/admin` — log in with the email/password you
  created in Step 1. Add a product with a photo, and it appears on the live
  site immediately.
- Submit the contact form on the live site, then check the `inquiries` table
  in Supabase (**Table Editor**) to see it land there.

---

## Making changes later

Since there's no local setup, the easiest way to edit code later is directly
on GitHub's website (click any file → pencil icon → edit → commit), or by
asking me to make the change and re-uploading the changed files the same way.
Every push to the GitHub repo automatically re-deploys on Vercel within
about a minute.

## Connecting a real domain later

When you have a domain, add it under your Vercel project → **Settings →
Domains** and follow the DNS instructions Vercel shows you. No code changes
needed.
