# Caliber Tech Solutions — Website Redesign

Static, dependency-free build (HTML + CSS + vanilla JS). Open `index.html` in a browser or upload the folder to any web host.

## Structure
```
index.html        All page sections
css/styles.css    Design tokens (top of file), layout, components, motion
js/config.js      Contact details: email, phone, WhatsApp, social links (edit this one)
js/main.js        Contact wiring, header state, mobile menu, load sequence, counters, scroll reveal, tabs, form validation
assets/           favicon.svg (add logo, hero photo and project images here)
```

## Sections
Top contact bar → Sticky header → Hero (animated steel-frame BIM drawing + title-block stats) → Trust strip → About → Core expertise (3 cards) → Full services → Process (5 steps) → Projects (sector tabs) → Why Caliber → Insights → Quote form + offices → Footer + floating WhatsApp button

## Before going live — replace placeholders
- **Phone and WhatsApp (PLACEHOLDERS)**: no verified number was available, so `js/config.js` holds `+1 (000) 000-0000` and `10000000000`. Replace `phoneDisplay`, `phoneLink` and `whatsapp` (country code + number, digits only). The top bar, contact section and WhatsApp button all update from this one file.
- **Email**: `info@calibertechsolutions.com` was carried over from the previous build. Confirm it is the official inbox.
- **Social icons**: none are shown yet because no confirmed company profile URLs were available. Paste a full `https://` URL into `social.linkedin` / `facebook` / `instagram` / `youtube` in `js/config.js` and that icon appears in the top bar automatically.
- **Logo**: swap the inline SVG mark in the header and footer for the official logo (comment in `index.html`).
- **Office addresses**: confirm the Overland Park and New Delhi offices in the Contact section.
- **Client logos**: replace the text items in `.trust-list` with `<li><img src="assets/clients/x.svg" alt="Client"></li>` (grayscale + hover already styled).
- **Hero photo (optional)**: put an image at `assets/hero.jpg` and follow the comment in `.hero-photo` in `styles.css`.
- **Project images**: replace the sector line drawings with real photos (comment in `.panel-visual`), and add real project names/tonnage.
- **Insights**: link the three article cards to real blog posts.
- **Quote form**: currently validates and shows a confirmation only. Connect it to your backend / form service in `js/main.js` (see the `fetch` comment).

## Design tokens
Navy #0A1A33 / #071428 · Charcoal #1F2731 · Steel blue #2D6CA8 · Cyan tint #5EB8D9 · Soft gray #F5F7FA / #EDF1F5
Font: Manrope (Google Fonts). Gradient is reserved for the hero heading, CTA buttons, card top-edge on hover, tab underline and process line.

## Accessibility & motion
Keyboard focus styles, skip link, ARIA tabs with arrow-key support, accessible form errors, and full `prefers-reduced-motion` support (all animation disabled).

## Top bar and WhatsApp behaviour
- The top bar sits inside the fixed header and collapses on scroll, so the sticky header stays compact. On narrow phones (≤400px) the phone number shrinks to its icon to prevent horizontal scrolling.
- The WhatsApp button is fixed 24px from the bottom-right on desktop (16px and smaller on mobile, respecting the iPhone safe area). It opens `wa.me/<number>` with a prefilled message, shows a "Chat with us" tooltip on hover/focus, and only scales slightly on hover — no pulsing.
