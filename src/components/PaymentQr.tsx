import { useState } from 'react';
import type { Language } from '../types';

export function PaymentQr({ method, lang, src }: {
  method: 'venmo' | 'zelle'; lang: Language; src?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const es = lang === 'es';
  const name = method === 'venmo' ? 'Venmo' : 'Zelle';
  const valid = typeof src === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(src)
    && src.length <= 800050;
  return (
    <div className="home-gift__zelle-qr">
      {valid && failedSrc !== src ? <>
        <img src={src} alt={es ? `Código QR del destinatario de ${name}` : `${name} recipient QR code`}
          decoding="async" onError={() => setFailedSrc(src || '')} />
        <p className="home-gift__note">{method === 'zelle'
          ? (es ? 'Escanea el QR desde la aplicación de tu banco compatible con Zelle. Comprueba el destinatario antes de enviar.' : 'Scan the QR using your Zelle-enabled banking app. Confirm the recipient before sending.')
          : (es ? 'Escanea el QR con Venmo. En este mismo móvil, guarda la imagen y ábrela desde el icono de foto del escáner de Venmo. Comprueba el destinatario antes de enviar.' : 'Scan the QR with Venmo. On this phone, save the image and open it using the photo icon in the Venmo scanner. Confirm the recipient before sending.')}</p>
      </> : <p className="home-gift__note" role="status">{es
        ? `El QR de ${name} no está disponible. Puedes usar el identificador si aparece abajo o contactar con nosotros.`
        : `The ${name} QR is unavailable. You can use the identifier if shown below or contact us.`}</p>}
    </div>
  );
}
