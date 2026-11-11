import React from "react";

interface NavyaLogoProps {
  variant?: "light" | "dark";
  compact?: boolean;
}

export function NavyaLogo({
  variant = "dark",
  compact = false,
}: NavyaLogoProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-[#ECC572]" : "text-[#6B0F1A]";
  const subColor = isLight ? "text-[#F8EEDB]/85" : "text-[#8B1524]";
  const ringStroke = isLight ? "#ECC572" : "#B88226";
  const fillBg = isLight ? "#4B0710" : "#6B0F1A";

  return (
    <span className="inline-flex items-center gap-1.5 sm:gap-2.5 select-none">
      <svg
        viewBox="0 0 64 48"
        className={compact ? "w-8 h-6 sm:w-11 sm:h-8 shrink-0" : "w-12 h-9 sm:w-14 sm:h-10 shrink-0"}
        aria-hidden="true"
      >
        {/* Ornate gold leaves */}
        <path
          d="M12 30C7 26 5 20 8 15C11 20 14 24 18 27"
          fill="none"
          stroke={ringStroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M52 30C57 26 59 20 56 15C53 20 50 24 46 27"
          fill="none"
          stroke={ringStroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 35C11 33 8 29 10 25"
          fill="none"
          stroke={ringStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M48 35C53 33 56 29 54 25"
          fill="none"
          stroke={ringStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Crown crest */}
        <path
          d="M25 10L29 5L32 8L35 5L39 10Z"
          fill={ringStroke}
        />
        {/* Center emblem */}
        <ellipse
          cx="32"
          cy="24"
          rx="16"
          ry="13"
          fill={fillBg}
          stroke={ringStroke}
          strokeWidth="2"
        />
        <text
          x="32"
          y="29"
          textAnchor="middle"
          fill="#ECC572"
          fontSize="14"
          fontWeight="700"
          fontFamily="Georgia, serif"
          letterSpacing="0.5"
        >
          NG
        </text>
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-bold tracking-tight whitespace-nowrap ${
            compact ? "text-[15px] sm:text-lg" : "text-lg sm:text-2xl"
          } ${textColor}`}
        >
          Navya Grand
        </span>
        <span
          className={`${
            compact ? "hidden min-[380px]:block text-[8px] sm:text-[10px]" : "text-[9px] sm:text-[10px]"
          } uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold mt-0.5 whitespace-nowrap ${subColor}`}
        >
          Fine Dining &amp; Banquet
        </span>
      </span>
    </span>
  );
}

