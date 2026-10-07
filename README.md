# Puja Special Website — Mobile + Free Setup

## What this starter includes
- Puja countdown (16 Oct 2026, Bangladesh time)
- 1–6 clothes poll
- Live poll percentages
- Live online visitor count using Supabase Realtime Presence
- Admin-controlled Dhak audio
- Up to 5 songs
- Admin photo upload
- Admin greeting publishing
- Admin login
- Credit: Website Created by GVT + Niloy

## Free stack
- GitHub Pages = website hosting
- Supabase = database, authentication, storage and realtime

## Important
Do NOT put a Supabase service_role/secret key in these files.
Use the browser-safe Publishable/anon key only.

## Setup
1. Create a Supabase project.
2. Open SQL Editor and run supabase.sql.
3. Create one admin user in Authentication > Users (or sign up with the email you want).
4. Copy Project URL and Publishable key.
5. Paste them into app.js and admin.js.
6. Put the exact admin email in admin.js as ADMIN_EMAIL.
7. Create a public GitHub repository and upload:
   index.html, style.css, app.js, admin.html, admin.js
8. Turn on GitHub Pages for the repository.
9. Open the published URL.

Admin URL:
YOUR_SITE_URL/admin.html

## Security note
The sample SQL makes media management available to any authenticated Supabase user. For a single-owner project, create only your own admin account. For a stronger production setup, add an admin role table/policy before sharing the Supabase project with anyone else.

## Music copyright
Only upload/use audio you have permission to use. The site code does not provide copyrighted music.
