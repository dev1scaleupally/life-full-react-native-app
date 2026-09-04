# What We Need From You

Status as of 2026-09-04. Five things, each with what it's for and how to generate it.

---

## 1. A Google Cloud project you own

**For:** Google Sign-In (`config/authConfig.ts`, `@react-native-google-signin/google-signin`).
The client IDs currently in the code are placeholders/dev values and need to be swapped for ones
issued from a project you own, so you retain control of the OAuth app (billing, consent screen
branding, revocation) rather than it living under a developer's personal account.

**How to generate:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a new project (or designate an existing one) under your Google Workspace/organization.
2. **APIs & Services → OAuth consent screen** — configure it (app name, support email, logo) and publish it.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Type **iOS** — needs the app's bundle ID (`ios/lifeFullApp/Info.plist` → `CFBundleIdentifier`). Produces the `GOOGLE_IOS_CLIENT_ID`.
   - Type **Web application** — produces the `GOOGLE_WEB_CLIENT_ID` the Google Sign-In SDK needs on both platforms.
   - Type **Android** — needs the app's package name plus a SHA-1 certificate fingerprint. This requires a release keystore first (`keytool -genkey -v -keystore release.keystore -alias <alias> -keyalg RSA -keysize 2048 -validity 10000`, then `keytool -list -v -keystore release.keystore` to read the SHA-1). No release keystore exists yet — only a debug one — so this has to be created and kept safe by you (losing it means losing the ability to update the app on Play Store under the same identity).
4. Send us the three client IDs (or add us as a project member so we can fetch them ourselves).

---

## 2. Your own Apple Developer Program membership

**For:** Sign In with Apple (`services/auth/appleAuth.ts`), and App Store distribution/TestFlight/In-App Purchases for the subscription plans in `services/subscription/plans.ts`.

**How to generate:**
1. Enroll at [developer.apple.com/programs](https://developer.apple.com/programs) as an Organization (not Individual, so the account isn't tied to one person) — $99/year, requires a D-U-N-S number for your organization.
2. Once enrolled, in **Certificates, Identifiers & Profiles**, register the App ID (bundle identifier must match `ios/lifeFullApp/Info.plist`) and enable the **Sign In with Apple** capability on it.
3. In **App Store Connect**, create the app record, then under **Subscriptions** create the in-app subscription product IDs (Monthly / Quarterly / Half-Year, matching `lifefull_monthly` / `lifefull_quarterly` / `lifefull_half_year`) with final pricing.
4. Add us (our Apple ID) as a member/collaborator with Developer or Admin access so we can build and submit under your team.

---

## 3. An Anthropic API key

**For:** the in-app AI coach ("Sage").

**How to generate:**
1. Go to [console.anthropic.com](https://console.anthropic.com) and create/sign in to an account owned by you (your email, your billing).
2. Add a payment method under **Settings → Billing** — the API is pay-as-you-go, no key works without billing set up.
3. **Settings → API Keys → Create Key**, name it (e.g. `lifefull-app-prod`), and send us the key value through a secure channel (not email/Slack in plaintext — a password manager share or similar).
4. Optional but recommended: set a monthly spend limit under Billing so usage is capped while we're integrating.

---

## 4. Email sending (SMTP)

**For:** account verification and password-reset emails (`services/auth/authService.ts` — currently these links are only logged to the console, never actually sent).

**How to generate:**
1. Pick a transactional email provider — e.g. [SES](https://aws.amazon.com/ses/) (cheapest if you're already on AWS), [SendGrid](https://sendgrid.com), or [Postmark](https://postmarkapp.com) (good deliverability, simple setup).
2. Create an account under your ownership, verify a sending domain you control (adds DKIM/SPF/DMARC DNS records to your domain — needed so emails don't land in spam).
3. Generate SMTP credentials or an API key from the provider's dashboard, and send us the host/port/username/password (or API key) plus the "from" address to send as (e.g. `no-reply@yourdomain.com`).

---

## 5. A domain you own

**For:** making the account-verification and password-reset email links open the app directly (an **App Link** on Android, a **Universal Link** on iOS) instead of a generic `lifefull://` link a browser or another app could intercept. Likely the same domain as #4 above (SMTP) — if you already have one for sending mail, that one works here too; no need for a second.

Until this exists, the app keeps working exactly as it does today (a `lifefull://` custom link scheme) — this only unlocks the more secure, standard version. Worth sorting early: getting App Links verified on Android in particular tends to take a round or two of debugging once it's in place, so it's better not left until the last week before launch.

**How to generate / what we need from it:**
1. Any domain you control the DNS for (a subdomain like `app.yourdomain.com` is fine — doesn't need to be the marketing site's root domain).
2. We'll need to host two small files on it over HTTPS, exactly as-is, no redirects:
   - `/.well-known/assetlinks.json` (Android — proves your app and this domain belong to the same organization)
   - `/.well-known/apple-app-site-association` (iOS — same idea; this one can wait until #2's Apple Developer account exists, since it needs your Apple Team ID)
3. Either give us DNS/hosting access to add these two files ourselves, or tell us where to send the file contents for your team to publish.
4. Send us the domain name once decided, so we can update the app's configuration (`config/deepLinkConfig.ts`) and the backend's email templates to point at it.
