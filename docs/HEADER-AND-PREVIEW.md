# Cover and sharing preview

The cover now has a photograph stage followed by an information band in normal document flow. Venue, date, and RSVP cannot overlap the couple. The main branch already omits the horizontal trencadis component; keep it omitted.

On 2026-11-09 the production bundle at belen-oriol-psi.vercel.app still rendered the horizontal trencadis immediately before the story section. It differed from main. After reviewing and merging, ensure Vercel's Production deployment uses the intended repository and current main commit; redeploy that commit if needed. Do not regenerate invitation codes, change personal links, or recreate sheet rows.

## Preview

Asset: public/invitacion-preview-acuarela-v2.jpg, 1200×630 JPEG. The original preview remains available. Open Graph, secure image and Twitter image use the same new filename. The canonical website URL stays unchanged. Invitation link parsing, codes, Google Apps Script and recipient data are untouched.

The artwork uses a complete large realistic burgundy envelope, warm watercolor paper, wheat and a rose, with a narrow watercolor trencadis border at the bottom and without castle illustration, landscape or olive branch. This border belongs only to the sharing image; the website cover keeps no top mosaic. Created with the built-in image generation tool, using the existing composition as edit target and invitation-identity.webp as a style reference.

Final edit prompt:

Precise edit, mixed media wedding WhatsApp preview. Image 1 is EDIT TARGET. Image 2 is watercolor paper STYLE REFERENCE ONLY. Preserve the large photorealistic burgundy envelope EXACTLY as in image 1: realistic burgundy paper texture, sharply defined complete outline and flap, realistic gold wax B|O seal, original size, position, lighting and shadow. DO NOT PAINT OR RESTYLE THE ENVELOPE OR ITS SEAL. Change ONLY the background and top-left wheat-and-rose decoration to a convincing delicate watercolor style matching the email invitation reference image 2: luminous warm ivory washes with soft variations and pigment blooms, fine watercolor cotton paper texture (less embossed/coarse), delicate translucent handpainted golden wheat and dusty burgundy rose. Maintain legible burgundy typography exactly: Belén & Oriol; Una invitación muy especial para ti; 04 · 09 · 2027; CASTILLO DEL BUEN AMOR; SALAMANCA. Bottom remains quiet empty watercolor paper. No castle illustration, landscape, hills, olive branches, mosaic/trencadis. Keep all envelope corners fully inside margins. 1.91:1 landscape composition. Priority: photographic envelope on watercolor invitation background, not a watercolor-painted envelope.

## Validation

TypeScript check and production build. Browser checks in Spanish and English at 1440×900, 1024×768, 393×852, 375×667 and 844×390: information begins at or below the photograph's bottom, no horizontal overflow, no top mosaic. Inspect desktop and mobile screenshots.

After deployment, open an existing invitation in a private mobile browser, enter the site, and check the cover. Paste an existing link into a personal WhatsApp draft and wait for its preview without sending. WhatsApp may retain cached cards; changing the image filename does not guarantee that already-sent cards refresh. No invitation identifiers need to change.
