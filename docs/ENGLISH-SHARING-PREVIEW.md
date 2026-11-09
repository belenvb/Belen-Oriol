# English WhatsApp preview

The English link previously returned Spanish Open Graph metadata and the same Spanish-lettered image. React's language choice cannot change the initial HTML read by sharing crawlers.

Vite now builds index.html and english.html with shared application assets. A Vercel rewrite for the existing root URL with lang=en serves english.html without redirecting or changing the browser URL. Existing private codes stay in the fragment; no codes or guest data appear in public metadata. The English Open Graph URL retains only the public language query. Spanish HTML and artwork remain unchanged. The separate English JPEG is 1200×630.

Validation: npm run check and npm run build. Check generated HTML for separate locales, titles, descriptions and images; both HTML outputs load the same app bundle. Manually verify Vercel routing after deployment by requesting /?lang=en without running JavaScript: the HTML should contain en_US and the English image. Repeat /?lang=es and root: Spanish should remain. Open an existing English invitation with the original fragment; confirm envelope language and invitation prefill. Test only with a controlled code; never put it in metadata.

No deployment, merge or invitation sending performed. Already-sent WhatsApp cards may remain cached. Invitations that omit lang=en cannot identify the intended preview language from their private fragment: the fragment is never sent to the server. Current sender already generates lang=en for English rows; reload the sending panel after editing a group's language.

Artwork created with the built-in image generation tool from the approved Spanish preview. Final prompt:

Text-localization precise edit. Translate ONLY the italic Spanish tagline on the left from 'Una invitación muy especial para ti' to exact English text 'A very special invitation for you', in two balanced italic lines using the same burgundy font size and position. Keep ALL OTHER ELEMENTS EXACTLY unchanged: Belén & Oriol names, numeric date 04 · 09 · 2027, venue CASTILLO DEL BUEN AMOR and SALAMANCA, the complete large PHOTOREALISTIC burgundy envelope and gold B|O seal (do not watercolor-paint the envelope), warm watercolor ivory paper, wheat and rose upper-left, narrow watercolor trencadis mosaic bottom border. Same aspect ratio 1200:630. No extra text, no personal names or codes. Preserve layout, typography style, colors, and all safe margins.

Routing reference: https://vercel.com/docs/routing/rewrites
