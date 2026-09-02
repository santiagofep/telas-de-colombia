# 2 - Meta Pixel tracking

## Problem

Meta (Facebook/Instagram) ads need a Pixel on the site to build remarketing audiences and to optimize campaigns for WhatsApp contacts. Right now no Pixel loads, so Meta receives no PageView and no conversion events.

Google Ads tracking is handled in `1 - GOOGLE-ADS-TRACKING.md` and is complete; this plan reuses the same click wiring.

## Findings

### What already exists

`index.html` has the config global:

```html
window.META_PIXEL_ID = "TU_PIXEL_ID";
```

`src/main.js` already contains `loadMetaPixel()`: it injects `fbevents.js`, runs `fbq('init', ID)` and `fbq('track', 'PageView')`, gated on `META_PIXEL_ID` not being the placeholder. The click handler `track()` calls `fbq('track', event, { content_name: label, content_category: 'whatsapp' })` when `fbq` exists.

The markup already carries the data Meta needs:

- `data-track-label` on all 13 WhatsApp links (from plan 1) becomes `content_name`.
- `data-track-event="Lead"` on the wholesale and staffing buttons; every other link sends the standard `Contact` event.

So the code path is built and inert. The only missing piece is the Pixel ID.

### Platform notes

- Pixel IDs are public by design; committing the value is fine.
- Meta's Conversions API (server-side events) is not possible on GitHub Pages. Browser pixel only.
- Meta requires domain verification for the domain the page is served from before events can be prioritized for iOS 14+ (Aggregated Event Measurement). The meta-tag verification method works on a static site.
- The page currently serves from `<user>.github.io/telas-de-colombia/` while metadata points at `https://telascolombia.com/`. Domain verification must target the real serving domain.
- Colombia's Ley 1581 de 2012 does not mandate a cookie banner, but a short privacy notice mentioning the pixel is expected once ads run.

## Proposed approach

Reuse the existing loader and click wiring. Set the Pixel ID, deploy, verify with the Meta Pixel Helper and Events Manager. Decide separately on domain verification and a privacy notice.

### Implementation steps

1. **Get the Pixel ID from the client.** Meta Business Manager → Events Manager → Data sources → the pixel → Settings. A 15 to 16 digit number. Confirm the client has admin access to the ad account.
2. **Set `window.META_PIXEL_ID` in `index.html`.** No other code change is required.
3. **Verify locally.** Run `npm run dev`, open the page with `?track=1`, click a WhatsApp link and check the console shows `meta: true`. Optionally reuse the headless Chrome DevTools check from plan 1 to confirm `fbevents.js` loads and `fbq` is a function.
4. **Commit and push to `main`.**
5. **Verify in production.** Install the Meta Pixel Helper extension, load the live page, confirm `PageView`. Click a retail link and confirm `Contact` with the expected `content_name`; click the wholesale button and confirm `Lead`. Cross-check in Events Manager → Test Events.
6. **Domain verification.** Add the serving domain in Business Manager → Brand Safety → Domains, verify with the meta tag in `index.html`. Then configure `Contact` and `Lead` as prioritized web events.
7. **Privacy notice.** If the client agrees, add a "Política de privacidad" line in the footer mentioning Meta Pixel and Google Ads cookies.

### Open questions

- Does the client already have a Pixel, or do we create one? Who is the admin of the Business Manager?
- Is `Lead` the right event for wholesale/staffing, or should everything be `Contact` for simpler campaign setup?
- Final domain for verification: `github.io` or `telascolombia.com`?
- Add the privacy notice now or wait for the client to ask?
