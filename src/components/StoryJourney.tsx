import { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import type { Language } from '../types';

export function StoryJourney({ lang }: { lang: Language }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.3, once: true });
  const reduce = useReducedMotion();
  const [replay, setReplay] = useState(0);
  const es = lang === 'es';

  return (
    <div ref={ref} className="story-journey">
      <div
        key={replay}
        className={`story-film ${visible && !reduce ? 'is-playing' : ''} ${reduce ? 'is-still' : ''}`}
        role="img"
        aria-label={
          es
            ? 'Un viaje ilustrado: España, Barcelona y Salamanca; después, España y Estados Unidos unidos por el Atlántico.'
            : 'An illustrated journey: Spain, Barcelona and Salamanca; then Spain and the United States connected across the Atlantic.'
        }
      >
        <svg className="story-map" viewBox="0 0 500 570" aria-hidden="true">
          <g fill="#e9dfca" stroke="#796348" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M112 132 135 117 157 125 175 121 205 131 240 135 268 142 292 151 319 156 337 169 369 175 386 190 369 214 352 223 334 243 327 267 312 279 300 315 277 337 265 363 238 383 214 387 185 378 171 358 147 349 133 332 120 313 129 288 136 269 135 247 140 224 130 200 121 183 105 171Z" />
            <path d="M121 183 97 188 89 210 93 236 84 261 92 282 82 302 92 319 120 313 129 288 136 269 135 247 140 224 130 200Z" fill="#f4ecdc" />
            <path d="M344 290 355 282 365 288 354 298Z" />
          </g>
          <g fill="#6b202e">
            <circle cx="335" cy="220" r="4" />
            <circle cx="161" cy="245" r="4" />
          </g>
          <path d="M335 220Q238 175 161 245" fill="none" stroke="#6b202e" strokeDasharray="3 5" />
          <text x="334" y="205">Barcelona</text>
          <text x="110" y="271">Salamanca</text>
          <text x="202" y="440" className="map-country">ESPAÑA</text>
        </svg>

        <img className="story-landmarks" src="/photos/story-landmarks.png" alt="" loading="lazy" />

        <div className="story-atlantic" aria-hidden="true">
          <svg viewBox="0 0 500 570">
            <g className="story-spain-outline">
              <path d="M338 260 356 250 378 258 394 254 420 264 446 270 458 292 444 315 423 323 410 346 391 360 367 354 352 334 333 326 323 306 329 285Z" />
              <path d="M333 306 313 313 305 329 312 350 301 368 315 382 336 374 323 352Z" fill="#f6eddc" />
              <circle cx="386" cy="318" r="4" fill="#752a34" stroke="none" />
            </g>

            <g className="story-us-outline">
              <path d="M53 232 88 218 126 224 154 214 183 224 222 221 248 238 240 259 260 271 247 292 218 289 198 310 166 310 142 327 110 320 90 332 67 318 71 292 49 279 58 256Z" />
              <path d="M222 221 247 218 272 232 288 252 282 270 260 271 240 259 248 238Z" fill="#eadcc4" />
              <circle cx="113" cy="294" r="4" fill="#752a34" stroke="none" />
            </g>

            <path
              className="ocean-route"
              d="M386 318 C344 106 146 106 113 294"
              fill="none"
              stroke="#752a34"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />

            <text x="360" y="242">España</text>
            <text x="73" y="210">United States</text>
            <text x="63" y="348">Lancaster</text>
            <text x="63" y="372">Boston · 2024</text>
            <text x="118" y="466" className="map-country">
              {es ? 'AL OTRO LADO DEL ATLÁNTICO' : 'ACROSS THE ATLANTIC'}
            </text>

            {visible && !reduce && (
              <g className="story-flight-svg">
                <animateMotion
                  dur="4s"
                  begin="9s"
                  fill="freeze"
                  rotate="auto"
                  path="M386 318 C344 106 146 106 113 294"
                />
                <path
                  d="M12 0 -10 -8 -6 -1 -12 3 -9 5 -3 3 -5 10Z"
                  fill="#f2eadb"
                  stroke="#702735"
                  strokeWidth="1.3"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      <button
        type="button"
        className="story-replay"
        onClick={() => setReplay((n) => n + 1)}
        disabled={Boolean(reduce)}
      >
        <RotateCcw size={13} />
        {es ? 'Volver a ver el viaje' : 'Replay our journey'}
      </button>
    </div>
  );
}
