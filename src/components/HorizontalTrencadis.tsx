import { useId, useLayoutEffect, useRef, useState } from 'react';

/** V9 is retained at native scale in the centre, with distinct new end pieces. */
export function HorizontalTrencadis({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fullWidth = 3872;
  const bandHeight = 199;
  // Preserve every vertical row, including both original gold rails.
  const height = width ? Math.max(42, width * bandHeight / fullWidth) : 42;
  const visibleWidth = width ? Math.min(fullWidth, width * bandHeight / height) : fullWidth;
  const left = (fullWidth - visibleWidth) / 2;
  const extensionScale = bandHeight / 146;
  const extensionWidth = 2172 * extensionScale;
  const original = '/photos/trencadis-v9-original-v18.png';
  const extension = '/photos/trencadis-new-ends-v18.png';

  return <div ref={ref} className={className} aria-hidden="true"
    style={{ width: '100%', height, padding: 0, border: 0, lineHeight: 0, overflow: 'hidden' }}>
    {width > 0 && <svg width="100%" height={height}
      viewBox={`${left} 0 ${visibleWidth} ${bandHeight}`}
      preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <defs>
        <clipPath id={`${id}-left`}><rect width="980" height="199" /></clipPath>
        <clipPath id={`${id}-right`}><rect x="2892" width="980" height="199" /></clipPath>
        <clipPath id={`${id}-centre`}>
          <path d="M900 0 L900 12 L917 40 L883 69 L913 96 L887 124 L914 151 L891 179 L900 199 L2972 199 L2988 177 L2956 147 L2986 119 L2957 92 L2988 67 L2954 38 L2972 12 L2972 0 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-left)`}>
        <image href={extension} width={extensionWidth} height={724 * extensionScale}
          x="0" y={-213 * extensionScale} />
      </g>
      <g clipPath={`url(#${id}-right)`}>
        <image href={extension} width={extensionWidth} height={724 * extensionScale}
          x={fullWidth - extensionWidth} y={-213 * extensionScale} />
      </g>
      <g clipPath={`url(#${id}-centre)`}>
        <image href={original} x="850" y="-258" width="2172" height="724" />
      </g>
      {/* Only the straight gold rails span the composition; no tile is stretched. */}
      <svg width={fullWidth} height="11" viewBox="0 258 2172 11" preserveAspectRatio="none" overflow="hidden">
        <image href={original} width="2172" height="724" />
      </svg>
      <svg y="188" width={fullWidth} height="11" viewBox="0 446 2172 11" preserveAspectRatio="none" overflow="hidden">
        <image href={original} width="2172" height="724" />
      </svg>
    </svg>}
  </div>;
}
