# 1 - Google Ads tracking

## Problem

The landing page exists to generate WhatsApp contacts from paid traffic. Google Ads campaigns cannot be optimized for contacts, and cannot report which ads produce quotes, unless the site reports a conversion on every WhatsApp click.

The site is static (Vite, GitHub Pages), has no forms and no backend. The only conversion action is a click on one of the WhatsApp links.

Meta Pixel tracking is a separate plan: see `2 - META-PIXEL-TRACKING.md`.

## Findings

### Scaffolding that existed before this work

`index.html` exposes the tracking config as globals:

```html
<script>
  window.META_PIXEL_ID = "TU_PIXEL_ID";
  window.GOOGLE_ADS_ID = "AW-XXXXXXXXX";
  window.GOOGLE_ADS_CONVERSION_LABEL = "TU_LABEL";
</script>
```

`src/main.js` injects `gtag/js?id=AW-…`, runs `gtag('js')` and `gtag('config', AW-ID)`, and on click of any `[data-track="whatsapp"]` element sends `gtag('event', 'conversion', { send_to: 'AW-ID/LABEL' })`. Nothing loads while the IDs are placeholders.

There are 13 WhatsApp links (header, hero, six fabric cards, staffing, wholesale, contact text, location card, final CTA). All open `https://wa.me/573186262626` in a new tab.

### Gaps found

1. **No IDs.** Nothing loaded until real values replaced the placeholders.
2. **All clicks looked the same.** Every link reported the same label, so a hero click and a wholesale click were indistinguishable.
3. **Conversion call with a placeholder label.** With the ID set but no label, the code would have sent `send_to: 'AW-…/TU_LABEL'`, which Google silently drops.
4. **No way to verify locally.** With placeholders in place the tag never loads in dev.

### Values received from the client (2026-09-02)

Google tag:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16469976523"></script>
```

Event snippet for the "Click Whatsapp" conversion action:

```js
gtag('event', 'conversion', {
  'send_to': 'AW-16469976523/j_9VCOLa6ewcEMvLv609',
  'value': 1.0,
  'currency': 'COP'
});
```

### Platform notes

- Google Ads IDs and conversion labels are public by design (they ship in the HTML of every site that uses them), so committing them to the repo is fine.
- Enhanced Conversions need user data from a form, which this page does not have. Not applicable.
- Every link uses `target="_blank"`, so the current page stays open and the conversion beacon completes before the user lands in WhatsApp.
- The page is served from `<user>.github.io/telas-de-colombia/` while metadata points at `https://telascolombia.com/`. Google Ads conversion domain settings must use the domain the page is actually served from.

## Proposed approach

Keep the gate-by-placeholder design and the inline config block in `index.html`. It is documented in the README, needs no build-time secrets, and the values are public anyway.

Make each CTA distinguishable with a `data-track-label` attribute on every WhatsApp link, sent as `event_label` on the conversion. Use one conversion action ("Click Whatsapp") for all clicks. If the client later wants separate bidding for wholesale/staffing leads, add a second conversion action and label.

### Implementation steps

1. ~~Get the conversion ID and label from the client.~~ Done: `AW-16469976523` / `j_9VCOLa6ewcEMvLv609`.
2. ~~Add `data-track-label` to all 13 WhatsApp links in `index.html`.~~ Done. Labels: `header`, `hero`, `tela-seda`, `tela-satin`, `tela-algodon`, `tela-dril`, `tela-licra`, `tela-combinaciones`, `dotaciones`, `mayoristas`, `mayoristas-telefono`, `ubicacion`, `cta-final`.
3. ~~Update `track()` in `src/main.js`.~~ Done. Reads the label from the clicked element and sends `conversion` with `send_to`, `value: 1.0`, `currency: 'COP'` and `event_label`. Falls back to a generic `whatsapp_click` event if the label is still a placeholder.
4. ~~Add a dev override.~~ Done. `?track=1` in the URL (or `localStorage.track = "1"`) logs each click to the console.
5. ~~Replace the placeholders in `index.html`.~~ Done.
6. ~~Verify locally.~~ Done with headless Chrome over the DevTools protocol: gtag script loads with the real ID, `typeof gtag === 'function'`, 13 links wired, clicks on `hero` and `mayoristas` pushed `["event","conversion",{send_to:"AW-16469976523/j_9VCOLa6ewcEMvLv609",value:1,currency:"COP",event_label:…}]` to `dataLayer`.
7. ~~Update the README.~~ Done.
8. **Commit and push to `main`.** The GitHub Actions workflow builds and deploys.
9. **Verify in production.** Open the live URL with Tag Assistant, confirm the `AW-16469976523` tag loads and a WhatsApp click fires `conversion`. In Google Ads → Goals → Conversions, "Click Whatsapp" should move from "Unverified" to "Recording conversions" within 24-48 h of the first real click.
10. **Domain settings once the site has its final domain.** Add the serving domain in Google Ads conversion settings.

### Open questions

- Should wholesale and staffing clicks be a separate conversion action for separate bidding? Currently one shared action with per-button labels.
- Does the client want Google Analytics 4 too? The gtag loader is in place; adding a `G-` measurement ID is a small change but a separate decision.
- Final domain: `github.io/telas-de-colombia/` or `telascolombia.com`? Affects the conversion domain setting and the canonical URLs in the page.
