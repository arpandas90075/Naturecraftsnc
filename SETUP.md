# 🌿 NatureCrafts — Handmade Soap Store

A complete e-commerce site: React frontend + a Google Sheet as your database, order inbox, and email machine. No paid services anywhere.

**How an order flows:**
customer adds soaps to cart → sees the total (subtotal + delivery) → fills the delivery form → order is saved to your Google Sheet → **you get an email** at naturecraftsnc.05@gmail.com → **the customer gets an e-bill** at their email → they can track delivery with their Order ID → you change the Status in the sheet, and their tracking page follows it.

Payment is always **UPI or cash on arrival** — set automatically, nothing charged online.

---

## 1 · Preview it right now (demo mode)

```bash
npm install
npm run dev
```

While `SCRIPT_URL` in `src/config.ts` is empty, the site runs with sample products and simulated orders — browse, add to cart, checkout, and track to see the whole flow.

## 2 · Connect the real backend (~5 minutes, once)

1. Go to **sheets.new** (logged in as **naturecraftsnc.05@gmail.com** — emails are sent from the account that owns the script). Name the sheet `NatureCrafts Store`.
2. **Extensions → Apps Script**. Delete the starter code, paste everything from `apps-script/Code.gs`, and save.
3. In the toolbar dropdown pick the function **`setup`** → **Run**. Approve the permission prompts (Google will warn because it's your own unverified script — click *Advanced → Go to … (unsafe)* → Allow). Your sheet now has **Products / Orders / Settings** tabs with 6 sample soaps.
4. **Deploy → New deployment → ⚙️ Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, then copy the **Web app URL** (ends in `/exec`).
5. In the project folder, copy **`.env.example`** to a new file named **`.env`** and paste that URL after `VITE_SCRIPT_URL=`. (The `.env` file is git-ignored — your URL never gets uploaded to GitHub.)
6. Build and deploy the site:
   ```bash
   npm run build
   ```
   Drag the `dist` folder to **Netlify Drop** (app.netlify.com/drop), or push to GitHub Pages / Vercel — the build uses relative paths and a hash router, so it works on any static host.

## Publishing the code on GitHub (safe by default)

The repo contains no secrets: `.gitignore` excludes `.env` (your script URL), `node_modules`, and `dist`. Just:

```bash
git init
git add .
git commit -m "NatureCrafts store"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/naturecrafts.git
git push -u origin main
```

Anyone cloning the repo gets a working site in **demo mode**; without your `.env` it never touches your Sheet.

**Optional — auto-deploy from GitHub:** in Netlify choose *Import from Git*, pick the repo, set Build command `npm run build`, Publish directory `dist`, and add an environment variable `VITE_SCRIPT_URL` = your `/exec` URL (Site settings → Environment variables). Then every `git push` redeploys the site automatically — no more dragging folders.

Place a test order on the live site — the order should appear in the Orders tab, your inbox, and the customer email.

## 3 · Running the shop (all inside the Google Sheet)

| You want to… | Do this |
|---|---|
| **Add a product** | Add a row in **Products**: unique ID, name, price, description, image URL, tag, Active = Yes |
| **Change a price** | Edit the Price cell — the site updates on the next page load |
| **Hide a product** | Set its Active cell to **No** |
| **Set the delivery charge** | **Settings** tab → change the number next to *Delivery Charge* (currently 0 = free). Applies to the very next order |
| **See orders** | Everything lands in **Orders**, newest at the bottom |
| **Mark “out for delivery” / “delivered”** | Change the **Status** dropdown on the order's row — the customer's tracking page updates instantly |
| **Record the delivered date** | Type it in the **Delivered On** column (shown to the customer once status is Delivered) |
| **Adjust an expected date** | Edit the **Expected Delivery** cell — tracking shows whatever is there |
| **Create a coupon** | **Coupons** tab: code, type (`percent` or `flat`), amount, optional emails (comma-separated; blank = everyone), Active = Yes. Each code works once per customer |
| **Change the first-order discount** | **Settings** → *First Order Discount %* (0 turns FIRST10 off) |
| **Change the referral reward** | **Settings** → *Referral Discount* — the ₹ a friend gets when redeeming someone's Order ID (0 turns referrals off) |
| **See what coupon an order used** | **Orders** tab → Coupon and Discount columns |

**Product photos:** upload your soap photo to [postimages.org](https://postimages.org) (free, no account), copy each **Direct link**, and paste them into the Image URL column — **up to 4–5 links separated by commas**. The first is the main photo on the shop card; the rest appear as a tap-through gallery in the product details. Products without an image show a hand-drawn soap illustration instead, so empty is fine too.

## 4 · Changing the script later

If you ever edit `Code.gs` (e.g. change `DELIVERY_DAYS`), redeploy with **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the same, so the site needs no changes.

## Project map

```
.env                 ← your Apps Script URL lives here (git-ignored, from .env.example)
src/config.ts        ← brand name, email, delivery days
src/pages/           ← Home (video hero), Shop, Cart, Checkout, Orders (placed + track), About
src/components/      ← navbar, footer, product cards, soap illustrations, leaf divider
src/lib/api.ts       ← talks to the Apps Script; demo mode fallback
src/assets/          ← your brand video (muted, web-optimized) + poster frame
apps-script/Code.gs  ← the entire backend
```
