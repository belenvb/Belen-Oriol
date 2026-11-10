# Compact RSVP redesign

Implements the approved preview throughout the existing RSVP form. Desktop retains the left/right guest columns and price-sorted room columns (three cheaper categories on the left, suites on the right). Phones stack the content. Guest names, invitation summary, attendance questions and menu legends stay personalised in both languages.

The form shares the section background. Name, email, allergies, postal address, song and dedication use compact underline fields. Both attendance days use the same soft burgundy selection. Menu names are fully spelled out, with a cutlery icon and “Otro” / “Other”, in one row. Full room descriptions, real room photos and their existing photo dialog remain. Availability appears directly under the description; prices and bounded quantity controls sit on the right. The return shuttle explicitly states the night of September 4–5. The room heading and complete subtitle retain dates, breakfast, request deadline and hotel confirmation/payment details.

## Friday night

The optional September 3–4 interest checkbox is visible before selecting a September 4–5 room. Its heading matches the main room heading, with the full availability, pricing and confirmation explanation underneath. It remains a nonbinding inquiry, without Friday inventory allocation or an assumed price. A guest may ask about Friday without requesting a Saturday room. Declining attendance still clears the submitted interest.

**Backend update required:** copy the updated `google-apps-script/Code.gs` into the existing Apps Script project, save, and deploy a new version of the **existing** web-app deployment. Keep the same deployment URL and private Script Properties. The helper `normalizeFridayCastleInterest_` now accepts interest from an attending guest without requiring a September 4–5 room. An older backend would discard that standalone interest. No sheet migration or code/link regeneration is needed.

## Validation

TypeScript check and production build passed. Mocked browser checks at 1440px Spanish, 736px English, 393px Spanish and 320px English verified two desktop guest columns, stacked mobile layout, one-row full menu labels, personalised names, room-photo dialog, live availability limits, Friday interest surviving removal of Saturday rooms, and no horizontal overflow. Submitted payloads retained guest diets, postal address, Friday interest without Saturday rooms, return-passenger count, song, message and the unchanged example invitation code. A further browser check covered a Saturday-only invitation, disabled controls during saving, reloading the saved response, editing and declining attendance (which clears Friday interest on submission). No real guest responses were sent.

Friday normalization/reload tests and postal-column recovery tests passed. The older postal-address integration fixture was updated to include the existing visible postal column; all six integration cases passed, including address reload, clearing and standalone Friday-interest persistence. The original fixture failed on main because it still modeled a 23-column sheet without a setter for the postal column.

Before production rollout, use a controlled invitation to confirm save, reopen/edit and Friday-interest persistence after updating Apps Script. Review the PR, merge into main when approved, and deploy through the existing Vercel configuration. This PR does not change invitation credentials, sent links, payment settings, WhatsApp previews, the site hero or gallery. Nothing is automatically merged, deployed or sent.
