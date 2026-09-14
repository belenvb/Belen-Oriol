/** Ink drawing inspired by the couple's Lancaster carriage reference. */
export function LancasterCarriage() {
  return <g transform="translate(100 370) scale(.82)" fill="none" stroke="#705b43" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M0 154 Q110 151 198 155 T363 151" strokeWidth=".7" opacity=".45" />
    <g fill="#eee4d2">
      <path d="M42 99V32Q82 5 133 28L143 97Z" fill="#594b3d" />
      <path d="M48 37H91V91H48ZM100 35L128 39V86H100Z" />
      <path d="M29 103H162L174 113H35Z" fill="#8c785b" />
      <circle cx="43" cy="125" r="29" /><circle cx="140" cy="126" r="24" />
    </g>
    {[{x:43,y:125,r:29},{x:140,y:126,r:24}].map(w=><g key={w.x}>
      <circle cx={w.x} cy={w.y} r="4" fill="#705b43" />
      {[0,30,60,90,120,150].map(a=><path key={a} d={`M${w.x-w.r} ${w.y}H${w.x+w.r}`} transform={`rotate(${a} ${w.x} ${w.y})`} strokeWidth=".8" />)}
    </g>)}
    <path d="M141 106L242 91M153 113L250 99M158 78Q224 54 296 62" />
    <path d="M226 68Q252 49 282 65L295 35 299 16 310 10 310 1 316 12 328 26 339 51 333 60 316 52 311 41 304 73Q298 87 281 94L270 117 285 143 278 148 258 120 261 93 244 100 235 124 220 147 211 146 225 119 225 94 208 114 199 143 191 142 196 113 216 85Z" fill="#d1c2a9" />
    <path d="M298 20Q283 38 286 67M312 18L323 44 333 48M301 61L286 91M229 71Q202 54 198 90M306 31L302 41M242 67L253 94" />
    <path d="M202 149h18m54 2h15m-101-5h14" strokeWidth="2.2" />
    <circle cx="318" cy="26" r="1.5" fill="#705b43" />
    <text x="173" y="181" textAnchor="middle" style={{font:"italic 17px 'Cormorant Garamond',serif",letterSpacing:0,textTransform:'none'}} stroke="none" fill="#705b43">Lancaster · Pennsylvania</text>
  </g>;
}
