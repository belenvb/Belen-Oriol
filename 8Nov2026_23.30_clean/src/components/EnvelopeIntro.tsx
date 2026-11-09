import { useEffect, useRef, useState } from 'react';
import boLogo from '../assets/images/bo-logo.webp';
import type { Language } from '../types';
import './EnvelopeIntro.css';

interface EnvelopeIntroProps {
  lang: Language;
  onLanguageChange: (language: Language) => void;
  onEnter: () => void;
  monogramSrc?: string;
  coupleNames?: string;
  weddingDate?: string;
  location?: string;
}



/** A single cinematic opening scene; the actual wedding site remains behind it. */
export function EnvelopeIntro({
  lang,
  onLanguageChange,
  onEnter,
  coupleNames = 'Belén & Oriol',
  weddingDate,
  location = 'Castillo del Buen Amor · Salamanca',
}: EnvelopeIntroProps) {
  const [opening, setOpening] = useState(false);
  const [canEnter, setCanEnter] = useState(false);
  const reveal = useRef<(() => void) | null>(null);
  const hasEntered = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const enterRef = useRef(onEnter);
  const hasOpened = useRef(false);

  useEffect(() => { enterRef.current = onEnter; }, [onEnter]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const siblings = Array.from(root.current!.parentElement!.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== root.current);
    const previousInert = siblings.map(element => element.inert);
    siblings.forEach(element => { element.inert = true; });

    return () => {
      animations.current.forEach(animation => animation.cancel());
      document.body.style.overflow = previousOverflow;
      siblings.forEach((element, index) => { element.inert = previousInert[index]; });
      if (hasOpened.current) document.querySelector<HTMLButtonElement>('.hero-discover')?.focus({ preventScroll: true });
    };
  }, []);

  const startOpening = () => {
    if (hasOpened.current) return;
    hasOpened.current = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setOpening(true);
    const scene = root.current!;
    // All tracks share one document-timeline origin. No timers or phase renders.
    let origin = document.timeline.currentTime;
    const track = (selector: string, frames: Keyframe[], delay: number, duration: number,
      easing = 'cubic-bezier(.4,0,.2,1)') => {
      const element = selector === ':root' ? scene : scene.querySelector<HTMLElement>(selector)!;
      const animation = element.animate(frames, { delay, duration, easing, fill: 'both' });
      animation.startTime = origin;
      animations.current.push(animation);
      return animation;
    };
    const letter = scene.querySelector<HTMLElement>('.bo-intro__letter')!;
    const portal = scene.querySelector<HTMLElement>('.bo-intro__portal')!;
    const box = letter.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const dx = vw / 2 - (box.left + box.width / 2);
    const lowerBy = Math.max(0, box.height * 1.10 + 32 - box.top);
    const dy = vh / 2 - 25 - (box.top + box.height / 2) - lowerBy;
    const readingScale = Math.min(1.4, (vw - 42) / box.width, (vh - 180) / box.height);
    const fillScale = Math.max(vw / box.width, vh / box.height) * 1.015;
    // A visual snapshot of the actual hero lives in the same physical sheet.
    // At the final camera position its dimensions exactly match the live page.
    const hero = document.getElementById('hero')!;
    const snapshot = hero.cloneNode(true) as HTMLElement;
    snapshot.removeAttribute('id');
    snapshot.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    snapshot.inert = true;
    snapshot.style.height = hero.offsetHeight + 'px';
    snapshot.style.minHeight = hero.offsetHeight + 'px';
    for (const selector of ['.hero-copy', '.hero-discover']) {
      const original = hero.querySelector<HTMLElement>(selector);
      const copy = snapshot.querySelector<HTMLElement>(selector);
      if (original && copy) {
        const style = getComputedStyle(original);
        copy.style.animation = 'none';
        copy.style.transform = style.transform;
        copy.style.opacity = style.opacity;
      }
    }
    portal.replaceChildren(snapshot);
    portal.style.width = vw + 'px';
    portal.style.height = vh + 'px';
    portal.style.transform = 'translate(-50%,-50%) scale(' + (1 / fillScale) + ')';
    track('.bo-intro__envelope', [{transform:'translateY(0px)'},{transform:'translateY(' + lowerBy + 'px)'}], 0, 800);
    track('.bo-intro__closed-photo', [{opacity:1},{opacity:0}], 0, 200);
    track('.bo-intro__action', [{opacity:1},{opacity:0}], 0, 200);


    track('.bo-intro__topline', [{opacity:1},{opacity:0}], 900, 500);

    // Continuous hinge rotation; depth order changes only as the flap passes edge-on.
    track('.bo-intro__flap', [
      {transform:'rotateX(0deg)'}, {transform:'rotateX(176deg)'},
    ], 0, 900, 'cubic-bezier(.42,0,.24,1)');
    track('.bo-intro__flap', [{zIndex:5},{zIndex:0}], 445, 1, 'linear');
    // Extract behind the opaque pocket only after the flap is fully open.
    track('.bo-intro__letter', [{visibility:'hidden'},{visibility:'visible'}], 900, 1, 'linear');
    track('.bo-intro__letter', [
      {transform:'translate(0px,0px) scale(1)'},
      {transform:'translate(0px,' + (-box.height * 1.10) + 'px) scale(1)'},
    ], 900, 900, 'cubic-bezier(.35,0,.2,1)').effect!.updateTiming({fill:'forwards'});
    // Advance towards the reader only once the entire sheet clears the pocket.
    track('.bo-intro__letter', [
      {transform:'translate(0px,' + (-box.height * 1.10) + 'px) scale(1)'},
      {transform:'translate(' + dx + 'px,' + dy + 'px) scale(' + readingScale + ')'},
    ], 1800, 650, 'cubic-bezier(.35,0,.2,1)').effect!.updateTiming({fill:'forwards'});
    track('.bo-intro__letter', [{zIndex:1},{zIndex:8}], 1800, 1, 'linear');
    for (const part of ['.bo-intro__photo-back', '.bo-intro__photo-front', '.bo-intro__flap-face', '.bo-intro__flap-reverse', '.bo-intro__seal', '.bo-intro__seal-back', '.bo-intro__envelope-shadow']) {
      track(part, [{opacity:1},{opacity:0}], 1800, 350);
    }
    const openingTracks = [...animations.current];
    Promise.all(openingTracks.map(animation => animation.finished)).then(() => {
      setCanEnter(true);
    }).catch(() => { /* unmounted */ });
    if (reducedMotion) openingTracks.forEach(animation => animation.finish());
    reveal.current = () => {
      if (hasEntered.current) return;
      hasEntered.current = true;
      setCanEnter(false);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        enterRef.current();
        return;
      }
      origin = document.timeline.currentTime;
      // Move from the reading position to the exact centre for the final match.
    // A continuous camera move into this sheet reveals the real hero, not a new card.
    track('.bo-intro__letter', [
      {transform:'translate(' + dx + 'px,' + dy + 'px) scale(' + readingScale + ')'},
      {transform:'translate(' + dx + 'px,' + (dy + 25) + 'px) scale(' + fillScale + ')'},
    ], 0, 1500, 'cubic-bezier(.45,0,.2,1)').effect!.updateTiming({fill:'forwards'});
    for (const selector of ['.bo-intro__identity-mark', '.bo-intro__letter-small', '.bo-intro__letter-names', '.bo-intro__letter-date', '.bo-intro__letter-place']) {
      track(selector, [{opacity:1},{opacity:0}], 100, 280);
    }
    track('.bo-intro__portal', [{opacity:0},{opacity:1}], 350, 850);
    const finish = track(':root', [{opacity:1},{opacity:0}], 1500, 150);
    finish.finished.then(() => enterRef.current()).catch(() => { /* unmounted */ });
    };
  };

  useEffect(() => {
    if (canEnter) root.current?.querySelector<HTMLButtonElement>('.bo-intro__enter')?.focus({preventScroll:true});
  }, [canEnter]);

  const date = weddingDate ?? (lang === 'es' ? '4 de septiembre de 2027' : '4 September 2027');
  const [venueName, ...venueCityParts] = location.split(/\s*·\s*/);
  const venueCity = venueCityParts.join(' · ');

  return (
    <div ref={root} className="bo-intro" data-opening={opening} role="dialog" aria-modal="true" onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const buttons = Array.from<HTMLElement>(root.current!.querySelectorAll<HTMLElement>('button:not(:disabled), [role=button]:not([aria-disabled=true])'));
      if (!buttons.length) { event.preventDefault(); return; }
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}
      aria-label={lang === 'es' ? 'Invitación de boda' : 'Wedding invitation'}>
      <svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}><defs>
        <filter id="bo-monogram-ink"><feComponentTransfer><feFuncA type="linear" slope="3" /></feComponentTransfer></filter>
        <clipPath id="bo-pocket-cut" clipPathUnits="objectBoundingBox"><path d="M0,0 C.16,.12 .34,.34 .475,.50 Q.50,.53 .525,.50 C.66,.34 .84,.12 1,0 L1,1 L0,1 Z" /></clipPath>
        <clipPath id="bo-flap-cut" clipPathUnits="objectBoundingBox"><path d="M0,0 L1,0 Q.995,.06 .965,.10 L.535,.975 Q.50,1.025 .465,.975 L.035,.10 Q.005,.06 0,0 Z" /></clipPath>
      </defs></svg>
      <div className="bo-intro__backdrop" aria-hidden="true" />
      <div className="bo-intro__veil" aria-hidden="true" />
      <div className="bo-intro__grain" aria-hidden="true" />
      <div className="bo-intro__light" aria-hidden="true" />

      <header className="bo-intro__topline">
        <div className="bo-intro__languages" aria-label={lang === 'es' ? 'Idioma' : 'Language'}>
          <button type="button" aria-pressed={lang === 'es'} disabled={opening} onClick={() => onLanguageChange('es')}>ES</button>
          <span aria-hidden="true">/</span>
          <button type="button" aria-pressed={lang === 'en'} disabled={opening} onClick={() => onLanguageChange('en')}>EN</button>
        </div>
      </header>

      <main className="bo-intro__scene">
        <div className="bo-intro__stationery">
          <div className="bo-intro__envelope" role="button" tabIndex={opening && !canEnter ? -1 : 0} onClick={() => canEnter ? reveal.current?.() : startOpening()} aria-disabled={opening && !canEnter}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (canEnter) reveal.current?.(); else startOpening(); } }}
            aria-label={canEnter ? (lang === 'es' ? 'Entrar en nuestra web' : 'Enter our wedding website') : (lang === 'es' ? 'Abrir la invitación' : 'Open the invitation')}>
            <span className="bo-intro__closed-photo" aria-hidden="true" />
            <span className="bo-intro__envelope-shadow" aria-hidden="true" />
            <span className="bo-intro__shell bo-intro__photo-back" aria-hidden="true" />
            <span className="bo-intro__letter">
              <span className="bo-intro__letter-frame">
                <span className="bo-intro__identity-mark" aria-hidden="true"><img src={boLogo} alt="" /></span>
                <span className="bo-intro__letter-names">{coupleNames}</span>
                <span className="bo-intro__letter-small">{lang === 'es' ? 'Os invitamos a celebrar nuestra boda' : 'We invite you to celebrate our wedding'}</span>
                <span className="bo-intro__letter-date">{date}</span>
                <span className="bo-intro__letter-place"><span className="bo-intro__letter-venue">{venueName}</span>{venueCity && <span className="bo-intro__letter-city">{venueCity}</span>}</span>
              </span>
              <span className="bo-intro__portal" aria-hidden="true" />
            </span>
            <span className="bo-intro__shell bo-intro__photo-front" aria-hidden="true" />
            <span className="bo-intro__flap" aria-hidden="true"><span className="bo-intro__flap-face" /><span className="bo-intro__flap-reverse" />
            <span className="bo-intro__seal" aria-hidden="true"><img src={boLogo} alt="" /></span><span className="bo-intro__seal-back" aria-hidden="true" /></span>
          </div>
          <button className="bo-intro__action" type="button" onClick={startOpening} disabled={opening}>
            {lang === 'es' ? 'Abrir la invitación' : 'Open the invitation'}
          </button>
        </div>
      </main>
      {canEnter && <div className="bo-intro__read-actions">
        <button type="button" className="bo-intro__enter" onClick={() => reveal.current?.()}>
          {lang === 'es' ? 'Entrar en nuestra web' : 'Enter our wedding website'} <span aria-hidden="true">→</span>
        </button>
      </div>}

    </div>
  );
}

export default EnvelopeIntro;
