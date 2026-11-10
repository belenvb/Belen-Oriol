interface RsvpQuantityProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

/** Bounded quantities; the parent fieldset also disables both buttons while saving. */
export function RsvpQuantity({ label, value, max, onChange }: RsvpQuantityProps) {
  return <div className="rsvp-quantity" role="group" aria-label={label}>
    <button type="button" disabled={value <= 0} aria-label={`${label} −1`} onClick={() => onChange(Math.max(0, value - 1))}>−</button>
    <output aria-live="polite" aria-label={label}>{value}</output>
    <button type="button" disabled={value >= max} aria-label={`${label} +1`} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
  </div>;
}
