# Setting Up EmailJS (so booking sends a real email)

EmailJS lets a static website send real emails without a backend. The code is already wired in — you just need to plug in your own free EmailJS account details.

## Step 1 — Create an account
Go to https://www.emailjs.com → Sign up (free plan = 200 emails/month, plenty for a college project).

## Step 2 — Connect an email service
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail** (easiest) → connect your Google account
3. Copy the **Service ID** (looks like `service_xxxxxxx`)

## Step 3 — Create two templates
Dashboard → **Email Templates** → **Create New Template**

**Template 1 — Booking Confirmation**
Subject: `Your SkyBook ticket is confirmed ✈`
Body (use these exact variable names so they match the code):
```
Hi {{to_name}},

Your SkyBook booking is confirmed!

Flight: {{flight_id}}
Seat(s): {{seats}}
PNR: {{pnr}}

Thank you for flying with SkyBook.
```
Set "To Email" field to `{{to_email}}`. Copy this template's **Template ID** (e.g. `template_booking`).

**Template 2 — Contact Form**
Subject: `New message from {{from_name}}`
Body:
```
Name: {{from_name}}
Email: {{from_email}}
Phone: {{from_phone}}

Message:
{{message}}
```
Copy this template's **Template ID** (e.g. `template_contact`).

## Step 4 — Get your Public Key
Dashboard → **Account** → **General** → copy the **Public Key**.

## Step 5 — Paste your 4 values into the code
Open `js/script.js`, find this block near the top, and replace the placeholders:

```js
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_BOOKING_TEMPLATE_ID = 'YOUR_BOOKING_TEMPLATE_ID';
const EMAILJS_CONTACT_TEMPLATE_ID = 'YOUR_CONTACT_TEMPLATE_ID';
```

Save, redeploy to Netlify (or just refresh if testing locally) — done.

## How it behaves
- **Until you fill in real values**, email sending is silently skipped — the site works exactly as it does now, nothing breaks.
- **Booking page**: after a successful seat booking, an email is sent to the passenger's email address with their PNR, flight and seat.
- **Contact page**: after a successful contact form submission, an email is sent to you (configure "To Email" in that template to your own address) with their message.
