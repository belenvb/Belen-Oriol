# Optional extra castle night: September 3–4

After selecting at least one room for September 4–5, guests see a yes/no follow-up asking whether they would like availability and pricing for September 3–4. The default is no. Both languages explain that Friday's rate may differ and that requesting information does not confirm a booking. The answer applies to the group's room request.

Removing all selected rooms clears the interest. A declined RSVP or no-room submission cannot retain it. Existing responses without this field continue to work. Previously saved interest loads when editing an RSVP. Hotel interest is independent of an invitation to the Friday event.

`fridayCastleInterest` is stored as a normalized boolean in the existing private Respuesta JSON column. A yes also appends an explicit pending-pricing note to the existing Habitaciones solicitadas summary so the organizer can see it without opening JSON. No columns, guest rows, invitation codes or URLs are regenerated. Friday interest does not consume additional room inventory and does not reuse Saturday's price.

## Activation

Review and merge the website changes into main, then let Vercel deploy main. Update Code.gs in the existing Apps Script project and save. Implementar → Gestionar implementaciones → edit the existing web deployment → Nueva versión → Implementar. Keep the same deployment URL. Backend first is preferable: it supports old clients that omit the optional field.

## Validation

`npm run check`, `npm run build`, and `node google-apps-script/tests/friday-castle-interest.cjs`.

Browser checks with mocked requests in English and Spanish: hidden before selecting rooms, appears after selection, yes choice, removal clears choice, re-selection defaults to no, and submitted yes payload preserves the Saturday room quantity. No actual RSVP or guest data was sent.

Manual check after deployment: use a controlled invitation, request a September 4–5 room, select Friday interest, submit, and check the pending-price note in the private sheet. Reopen/edit that response to verify the answer reloads. Friday availability and rates must be confirmed separately before accepting an extra night.
