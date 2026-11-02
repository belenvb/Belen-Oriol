/** A small engraved botanical flourish, echoing the wedding stationery. */
export function RoseAndWheat() {
  return <svg className="rsvp-botanical" viewBox="0 0 280 120" fill="none" aria-hidden="true">
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M67 108C117 96 160 57 199 19M86 110C126 88 152 53 159 17" stroke="#a67d39" strokeWidth="1.3"/>
      {[0,1,2,3,4,5].map(i=><g key={i} transform={`translate(${157+i*6} ${59-i*7}) rotate(42)`} stroke="#967038" strokeWidth=".65">
        <path d="M0 0Q-15-4-12-17Q0-13 0 0Z" fill="#b99250"/><path d="M0 0Q15-4 12-17Q0-13 0 0Z" fill="#c4a365"/>
        <path d="M-12-17L-15-30M12-17L15-31M0 0V-19"/>
      </g>)}
      <path d="M74 105C115 81 120 57 105 37M120 77Q140 83 145 69Q128 64 120 77ZM116 69Q94 74 88 60Q109 55 116 69Z" stroke="#74734d" strokeWidth="1.2" fill="#88815b"/>
      <path d="M104 65L119 70M127 75L140 71" stroke="#c6bc93" strokeWidth=".7"/>
      <g transform="translate(105 34)" stroke="#ead5b4" strokeWidth=".8">
        <path d="M-23-7Q-24-22-10-24Q2-33 12-23Q27-22 25-7Q34 6 21 16Q13 31-2 25Q-20 29-24 12Q-34 0-23-7Z" fill="#762331" stroke="#68202a"/>
        <path d="M-10-24Q-22-8-5 4Q-13-13 4-16Q16-18 17-7Q23-7 25-7M-24 12Q-7 19 3 7Q-6 8-5 4M21 16Q7 22 3 7Q17 10 17-7M-2 25Q-1 17 3 7M-23-7Q-13-1-5 4M4-16Q-5-7 3 0Q9 4 11-5Q10-12 4-10Q0-7 3-5M3 0L3 7M12-23Q10-19 4-16"/>
      </g>
      <path d="M80 105Q61 94 52 100Q60 112 80 105M139 68Q143 45 134 34M142 55Q154 45 151 33" stroke="#a67d39" strokeWidth=".9"/>
    </g>
  </svg>;
}
