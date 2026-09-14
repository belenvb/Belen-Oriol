import { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { LancasterCarriage } from './LancasterCarriage';
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
            ? 'Un viaje ilustrado: España, Barcelona y Salamanca; después, España y Estados Unidos unidos por el Atlántico, y un carruaje Amish de Lancaster.'
            : 'An illustrated journey: Spain, Barcelona and Salamanca; then Spain and the United States connected across the Atlantic, and an Amish carriage in Lancaster.'
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
              <path d="M46 252 80 235 118 238 150 226 184 235 225 231 258 246 283 266 297 292 286 320 255 327 230 314 205 331 172 328 145 345 112 337 86 348 59 331 64 304 42 289 52 270Z" />
              <path d="M258 246 287 244 314 262 332 286 326 305 297 292 283 266Z" fill="#eadcc4" />
              <circle className="story-east-coast-dot" cx="318" cy="282" r="4" stroke="none" />
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
            <text x="74" y="222">United States</text>
            <text x="300" y="258">Lancaster</text>
            <text x="302" y="303">Boston · 2024</text>
            <LancasterCarriage />
            <text x="250" y="544" textAnchor="middle" className="map-country">
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
