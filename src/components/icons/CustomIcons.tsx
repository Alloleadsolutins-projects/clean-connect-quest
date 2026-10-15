// Icônes vectorielles maison pour les biens spécifiques (sedari marocain, grand SUV).

interface IconProps {
  className?: string;
}

/** Banquette marocaine basse (sedari) avec coussins et motif traditionnel. */
export const SedariIcon = ({ className = "h-10 w-10" }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* dossier long avec coussins */}
    <path d="M6 30V22a3 3 0 0 1 3-3h46a3 3 0 0 1 3 3v8" />
    <path d="M22 19v11M42 19v11" />
    {/* assise */}
    <path d="M4 30h56v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-9Z" />
    {/* motif zellige sur l'assise */}
    <path d="M16 36l3-3 3 3-3 3-3-3ZM32 36l3-3 3 3-3 3-3-3ZM48 36l3-3 3 3-3 3-3-3Z" strokeWidth="1.4" />
    {/* pieds */}
    <path d="M10 42v5M54 42v5" />
  </svg>
);

/** Grand SUV / 4x4 (véhicule haut, roues larges). */
export const BigSuvIcon = ({ className = "h-10 w-10" }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* carrosserie haute */}
    <path d="M5 42v-9l4-2 4-10a4 4 0 0 1 3.7-2.5h28.6A4 4 0 0 1 49 21l4 10 6 2v9a2 2 0 0 1-2 2h-4" />
    <path d="M21 44h22" />
    <path d="M9 44H7a2 2 0 0 1-2-2" />
    {/* vitres */}
    <path d="M13 31h38" />
    <path d="M31 21v10" />
    {/* roues larges */}
    <circle cx="16" cy="44" r="5" />
    <circle cx="48" cy="44" r="5" />
    {/* barres de toit */}
    <path d="M18 19V16h28v3" strokeWidth="1.6" />
  </svg>
);

export const customIcons = { sedari: SedariIcon, bigSuv: BigSuvIcon } as const;
export type CustomIconKey = keyof typeof customIcons;

export const OptionIcon = ({
  iconKey,
  emoji,
  size = "text-4xl",
  svgClass = "h-10 w-10",
}: {
  iconKey?: CustomIconKey;
  emoji?: string;
  size?: string;
  svgClass?: string;
}) => {
  if (iconKey && customIcons[iconKey]) {
    const Comp = customIcons[iconKey];
    return <Comp className={`${svgClass} text-primary`} />;
  }
  if (!emoji) return null;
  return <div className={size}>{emoji}</div>;
};
