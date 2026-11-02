# Invitation with identity — centred immersive edition

Base: complete local project 2026.11/2Nov2026_5.19am. Only the two original EnvelopeIntro files changed (SHA-256 comparison); the rest of the original site remains unchanged. Two new generated assets are in public/photos/.

The opening now centres the envelope alone over Salamanca, without the left-hand heading/subtitle or decorative outlines. The invitation says ESTÁS INVITADO / YOU ARE INVITED; the Barcelona · Salamanca signature is removed. The reading control is borderless and contains only the entry button; Our story continues with you and its Spanish equivalent have been removed. The invitation date is larger and bolder; the initial footer with date and venue has been removed.

The burgundy cotton-paper envelope opens in about 1.9 seconds. The same illustrated sheet exits the pocket and remains in the reading position indefinitely. There is NO automatic transition. Guests explicitly click Entrar en nuestra web / Enter our wedding website to start the 1.65-second reveal into the existing hero. Reduced motion shows the reading state immediately, still requiring the second click. Keyboard focus is moved to the entry button and restored on entering the site.

Identity: existing intertwined B&O monogram, burgundy and ivory, an illustration based on the project's existing castle sketch, with trencadís connecting Barcelona and Salamanca. The artwork is interpretive, not an architectural photograph. The envelope's photographic-style material is AI-generated; its hinge, pocket, letter and movement are browser layers.

Validation: Vite build and TypeScript passed. Real Chromium tests verified the opening/transition across 1440×900, 390×844, 320×568, 844×390 and 768×1024 in ES/EN before adding the reading hold. Final click-to-enter tests cover desktop, mobile, small mobile and landscape, ES/EN, a six-second no-click wait after opening, card and button bounds/non-overlap, click completion, reduced motion, keyboard and restored scrolling. No JavaScript exceptions. Latest copy-only change: the caption above the entry button was removed in both languages; build and TypeScript rechecked. Prior screenshots are omitted to avoid showing outdated text. Safari/Firefox and physical phones were not tested.

Existing build warning: trencadis-glass-dark.svg is absent in the base project. Unrelated site sections were not changed.

Run: npm ci; npm run dev; visit http://localhost:3000/?intro to replay. dist/ is the compiled full site for HTTP hosting. The tests/envelope-opening.mjs script now tests click-to-enter; install Playwright and its Chromium browser before running it with the dev server on port 3000.
