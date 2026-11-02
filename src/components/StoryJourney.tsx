import type { Language } from '../types';

/** The couple's clarified route, using their original Spanish landmark artwork. */
export function StoryJourney({ lang }: { lang: Language }) {
  const es = lang === 'es';
  return (
    <figure className="story-editorial__route">
      <figcaption>{es ? 'A ambos lados del Atlántico' : 'On both sides of the Atlantic'}</figcaption>
      <svg viewBox="0 0 460 280" role="img" aria-labelledby="story-route-title story-route-description">
        <title id="story-route-title">{es ? 'Los lugares de nuestra historia' : 'The places in our story'}</title>
        <desc id="story-route-description">{es ? 'De España, Salamanca y Barcelona, a Boston; después Lancaster, Pennsylvania, y de nuevo Boston desde 2024.' : 'From Spain, Salamanca and Barcelona, to Boston; then Lancaster, Pennsylvania, and back to Boston since 2024.'}</desc>
        {/* Reuse the supplied illustration without changing the original image file. */}
        <g className="story-editorial__landmarks">
          <svg x="14" y="16" width="220" height="100" viewBox="30 560 650 280" preserveAspectRatio="xMidYMid meet">
            <image href="/photos/story-landmarks.png" width="706" height="854" />
          </svg>
          <svg x="255" y="10" width="165" height="110" viewBox="30 20 430 290" preserveAspectRatio="xMidYMid meet">
            <image href="/photos/story-landmarks.png" width="706" height="854" />
          </svg>
        </g>
        <g className="story-editorial__route-labels" fill="currentColor" textAnchor="middle">
          <text x="124" y="136">Salamanca</text><text x="337" y="136">Barcelona</text>
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M124 145 Q76 144 46 188 M337 145 Q171 151 46 188" opacity=".3" />
          <path d="M46 188 C82 157 130 157 164 188 S252 219 288 188 S373 157 410 188" strokeDasharray="2 5" opacity=".8" />
          <path d="m105 169 5 -1 -3 -4 m112 36 5 1 -1 -5 m120 -32 5 -1 -3 -4" />
        </g>
        <g fill="#f8f2e7" stroke="currentColor" strokeWidth="1.4">
          <circle cx="46" cy="188" r="3" /><circle cx="164" cy="188" r="3" /><circle cx="288" cy="188" r="3" /><circle cx="410" cy="188" r="3" />
        </g>
        <g className="story-editorial__route-labels" fill="currentColor" textAnchor="middle">
          <text x="46" y="225">{es ? 'España' : 'Spain'}</text>
          <text x="164" y="225">Boston</text>
          <text x="288" y="225">Lancaster</text>
          <text x="288" y="248" className="story-editorial__route-note">Pennsylvania</text>
          <text x="410" y="225">Boston</text>
          <text x="410" y="248" className="story-editorial__route-note">2024</text>
        </g>
      </svg>
    </figure>
  );
}
