# Compact RSVP controls and visible postal addresses

## Website

Approved compact soft cards replace the old attendance controls. Friday and Saturday remain independent toggles. Declining clears both; selecting a day restores attendance. Friday remains hidden for invitations without Friday access. Existing invitation codes and payload semantics are unchanged. Deploy the reviewed website changes through main.

## Postal addresses in Respuestas web

Postal addresses were already saved in the private Respuesta JSON field (column W), but were not copied into a separate visible column. This change creates or reuses a column named Dirección postal at the end of the response sheet. It preserves existing columns, including custom columns, and mirrors future submitted addresses there as plain text.

1. Update Code.gs in the existing Apps Script project and save.
2. In the editor's function dropdown select `prepareRsvpPostalAddressColumn` and click Ejecutar once. It creates the visible column and copies previously saved addresses from Respuesta JSON into empty cells. Existing nonempty cells and formulas are preserved. Running it again is safe. It does not send invitations or change codes.
3. To apply this to future web submissions: Implementar → Gestionar implementaciones → edit the current web deployment → Nueva versión → Implementar. Keep the same deployment URL.
4. In Respuestas web scroll to the rightmost columns and locate Dirección postal. An address absent from the saved JSON cannot be recovered by this helper.

The address remains optional and private. Submitted spreadsheet formulas are escaped as text. A blank address on an edited RSVP clears its mirrored cell. No live sheet has been modified while preparing this change.

Tests: `node google-apps-script/tests/postal-address-column.cjs`, TypeScript check and production build. Browser checks use mocked guests and intercepted backend requests, not actual guest data.
