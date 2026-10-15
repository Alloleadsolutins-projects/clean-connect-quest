const WashPattern = ({ className = "" }: { className?: string }) => (
  <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="wash-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        {/* Water droplet */}
        <path d="M20 30 Q20 20 25 15 Q30 20 30 30 Q30 38 25 38 Q20 38 20 30Z" fill="currentColor" opacity="0.04" />
        {/* Bubble */}
        <circle cx="70" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.05" />
        <circle cx="90" cy="60" r="5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.04" />
        {/* Car silhouette */}
        <path d="M40 80 L45 70 L65 70 L70 80 L75 80 L75 88 L40 88 L40 80Z" fill="currentColor" opacity="0.03" />
        {/* Spray */}
        <path d="M100 90 L105 85 M100 90 L107 90 M100 90 L105 95" stroke="currentColor" strokeWidth="1" opacity="0.04" fill="none" />
        {/* Small droplets */}
        <circle cx="15" cy="100" r="2" fill="currentColor" opacity="0.04" />
        <circle cx="55" cy="45" r="2" fill="currentColor" opacity="0.03" />
        <circle cx="95" cy="110" r="3" fill="currentColor" opacity="0.04" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#wash-pattern)" />
  </svg>
);

export default WashPattern;
