# English WhatsApp preview: routing priority

Production diagnosis: requesting /?lang=en without JavaScript returned Spanish HTML (es_ES and the Spanish preview image), while /english.html returned English HTML (en_US and invitation-preview-watercolor-en-v1.jpg). This is a routing failure, independent of WhatsApp's cached cards.

Replace the fallback rewrite with an explicit route before the filesystem handler. Vercel gives existing static files priority over high-level rewrites; the root index.html was therefore served first. Only the root URL with lang=en is routed to english.html. Other paths and assets use the filesystem as before. There is no redirect, and the browser URL, private fragment, invitation codes and sender remain unchanged. No guest data is added to public metadata.

References: https://vercel.com/docs/project-configuration/vercel-json#rewrites and https://vercel.com/docs/build-output-api/configuration#routes

After reviewing and merging, deploy main through the existing Vercel production project. Verify the raw HTML at /?lang=en includes en_US and the English image; /?lang=es and / remain Spanish. Check both preview image URLs return image/jpeg. Open an existing controlled invitation to confirm its private fragment and prefill are retained. No Apps Script changes are required.

For a fresh WhatsApp check, paste the English link into a new unsent message and wait for its card. Previously sent cards can retain their old cached appearance. If a fresh card still shows Spanish after the raw HTML is confirmed English, try adding &preview=en2 before the # in a controlled copy of the link, leaving the entire private fragment untouched; this produces a new public cache key without changing the invitation code. Do not mass-resend invitations or regenerate codes.

Nothing is automatically merged, deployed or sent by this change.
