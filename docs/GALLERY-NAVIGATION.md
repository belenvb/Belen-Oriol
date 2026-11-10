# Gallery navigation

Keep the existing Iceland-first gallery, all 16 photos and their order, white cover title, captions, dark background and article. Only the navigation changes: larger white arrow icons and a small pause/resume button, without a visible automatic-play label or Next photo pill.

Photos advance every seven seconds only while at least 25% of the photo stage is visible and the document is active. Hover and keyboard focus temporarily suspend playback. Manual arrow, keyboard or swipe navigation pauses playback until the guest chooses resume. Reduced-motion users start paused. Timers, observer and listeners are cleaned up when the section unmounts.

Validation: TypeScript check and production build passed. Real-time browser checks at 1440px (English), 393px (Spanish) and 320px (English) verified automatic advancement, pause, previous photo, expected arrow size, no visible automatic label and no horizontal overflow. Reduced-motion mode starts paused. Desktop gallery and mobile screenshot inspected. The in-app browser also confirmed auto-advance and pause.

No backend or Apps Script update is required. Review and merge into main, then deploy through the existing Vercel production configuration. No invitation codes, sent links, hero/header layout or photos change. Nothing has been merged or deployed automatically.
