import { motion } from 'motion/react';

interface OrnamentalDividerProps {
  className?: string;
  variant?: 'braid' | 'flourish' | 'simple';
}

export function OrnamentalDivider({ className = '', variant = 'braid' }: OrnamentalDividerProps) {
  if (variant === 'simple') {
    return (
      <div className={`w-full flex items-center justify-center py-6 select-none ${className}`}>
        <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#b89243] to-transparent opacity-60" />
        <div className="mx-3 rotate-45 w-2 h-2 border border-[#b89243] bg-[#faf7f2]" />
        <div className="h-[1px] w-28 bg-gradient-to-r from-[#b89243] via-transparent to-transparent opacity-60" />
      </div>
    );
  }

  if (variant === 'flourish') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`w-full flex items-center justify-center py-8 select-none ${className}`}
      >
        <svg
          viewBox="0 0 400 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-72 md:w-96 h-auto text-[#b89243] opacity-80"
        >
          <path
            d="M20 20 H160 M240 20 H380"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <path
            d="M165 20 C180 10 190 30 200 20 C210 10 220 30 235 20"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="200" cy="20" r="3" fill="currentColor" />
          <circle cx="175" cy="20" r="1.5" fill="currentColor" />
          <circle cx="225" cy="20" r="1.5" fill="currentColor" />
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`w-full flex items-center justify-center py-9 select-none ${className}`}
    >
      <svg
        viewBox="0 0 500 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-80 md:w-[480px] h-auto text-[#b89243] opacity-85 drop-shadow-xs"
      >
        <path
          d="M10,20 C70,2 130,38 190,20 C250,2 310,38 370,20 C430,2 490,20 490,20"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M10,20 C70,38 130,2 190,20 C250,38 310,2 370,20 C430,38 490,20 490,20"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="250" cy="20" r="3.5" fill="currentColor" />
        <circle cx="190" cy="20" r="2.5" fill="currentColor" />
        <circle cx="310" cy="20" r="2.5" fill="currentColor" />
        <circle cx="130" cy="20" r="1.5" fill="currentColor" />
        <circle cx="370" cy="20" r="1.5" fill="currentColor" />
      </svg>
    </motion.div>
  );
}
