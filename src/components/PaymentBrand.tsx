type PaymentApp = 'bizum' | 'venmo' | 'zelle';

export function PaymentBrand({ method }: { method: PaymentApp }) {
  const name = method === 'bizum' ? 'Bizum' : method === 'venmo' ? 'Venmo' : 'Zelle';
  return <span className={'home-gift__brand home-gift__brand--' + method}>
    <img src={'/payment-brands/' + method + (method === 'bizum' ? '.png' : '.svg')}
      alt={method === 'zelle' ? '' : name} aria-hidden={method === 'zelle' ? true : undefined}
      width={method === 'zelle' ? 16 : 67} height={method === 'zelle' ? 24 : 21} />
    {method === 'zelle' && <span>Zelle</span>}
  </span>;
}
