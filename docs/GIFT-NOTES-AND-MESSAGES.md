# Gift notes, registry wording and Messages previews

The registry no longer displays “A gift for what comes next” / “Un regalo para lo que viene”. After guest access, an optional note form appears alongside the existing bank/Bizum/Venmo/Zelle options. Choosing a method never sends an email: the guest explicitly sends a name and message. The selected method is included in the card, without payment identifiers, credentials, amounts or any claim that a payment was made. English and Spanish are supported.

The organizer receives an ivory, burgundy and gold HTML email card, with a plain-text fallback. User content is escaped and recipient selection is server-only. Notes do not modify RSVPs, invitation codes, send history or payment settings.

## Setup (private)

1. In the existing Apps Script project, set Script Property `WEDDING_GIFT_NOTE_EMAIL` to the organizer's requested personal email. Do not put the address in the repository or website. This must be a single email address.
2. Replace `Code.gs` with this version. Run `checkWeddingGiftNoteEmailConfiguration` manually once as the deployment owner to grant mail permission and check configuration/quota. It returns `ready:true` when configured and sends no email.
3. Update the existing web-app deployment to a new version, with the same deployment URL, execution identity and private properties. Deploy the frontend through the normal reviewed main-branch workflow. If the backend is older or the recipient is not configured, the optional form remains hidden; existing payment access continues to work.
4. With a controlled invitation, send one deliberate test note after rollout and check the organizer inbox and Spam folder. No real email has been sent during implementation.

The existing gift lookup is convenience access, including first-name matching, rather than strong identity verification. It now issues a random six-hour, one-note capability after successful access. The server validates the token, name, message, language and method; a lock, one-use token and coarse 30-notes-per-hour cap protect mail quota. A successful retry with the same request ID returns success without mailing twice. Missing/expired cache entries fail closed. An ambiguous mail failure consumes the attempt instead of automatically resending; the guest is asked to contact the couple. Cache limits are best-effort and delivery to the inbox is still subject to the mail provider.

## iPhone Messages

The published page supplies static Open Graph metadata, a 1200×630 preview image, a high-resolution Apple icon and the correct language response without JavaScript. The current SMS template already ends in one URL. Apple Messages decides whether it builds a rich preview; the website cannot force a preview in an already-sent SMS.

The sending panel adds **Copiar solo enlace · SMS**. It copies the exact original private URL as a standalone message for a controlled check. No code or URL is regenerated, no message is sent automatically, and no invitation is marked sent by copying. Replace `SendingPanel.html` in Apps Script and reopen the panel to use it.

The panel card remains explicitly labeled a simulation. If the standalone URL still has no preview after sending, test the same public language URL without the private fragment to distinguish an app/device issue from this invitation's URL cache. Do not publish private invitation URLs to external preview checkers. There is no guaranteed site-side repair for a device that declines to render the card.

References: [Apple TN3156](https://developer.apple.com/documentation/technotes/tn3156-create-rich-previews-for-messages/) and [Twilio SMS/MMS preview behavior](https://help.twilio.com/articles/360013199334-How-do-SMS-and-MMS-URL-Link-Previews-Work-on-Mobile-Devices-).

## Dress code and validation

“Dark suit” becomes “suit”, and “traje oscuro” becomes “traje”, in both the FAQ and shared content, without changing the remaining dress code.

TypeScript and production build passed. Backend tests mock every email call and cover token access, invalid/expired capabilities, validation, HTML escaping, private fixed recipient, duplicate requests, ambiguous failure, quota and global rate limiting. Existing gift and postal-address checks passed. Browser checks at 1024px English, 320px Spanish and 393px English verified guest access, the optional form, chosen payment method, successful acknowledgement, retained text on failure and no horizontal overflow. The email card was rendered and checked at desktop and 320px widths. Actual inbox delivery and iPhone Messages behavior still require the controlled manual checks above.
