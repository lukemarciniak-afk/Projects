import { motion } from "framer-motion";

interface BigButtonProps {
  onClick: () => void;
  color?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "choice" | "nav";
}

const colorMap: Record<string, string> = {
  blue: "bg-kid-blue hover:bg-kid-blue/90",
  green: "bg-kid-green hover:bg-kid-green/90",
  yellow: "bg-kid-yellow hover:bg-kid-yellow/90",
  pink: "bg-kid-pink hover:bg-kid-pink/90",
  purple: "bg-kid-purple hover:bg-kid-purple/90",
  orange: "bg-kid-orange hover:bg-kid-orange/90",
  teal: "bg-kid-teal hover:bg-kid-teal/90",
};

export function BigButton({
  onClick,
  color = "blue",
  disabled = false,
  children,
  className = "",
  variant = "primary",
}: BigButtonProps) {
  const bg = colorMap[color] ?? colorMap.blue;
  const sizeClass =
    variant === "nav"
      ? "min-h-[80px] text-xl px-6"
      : variant === "choice"
        ? "min-h-[64px] text-lg px-5"
        : "min-h-[64px] text-xl px-8";

  return (
    <motion.button
      whileTap={{ scale: 0.95, y: 2 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${bg} ${sizeClass}
        text-white font-display font-bold
        rounded-2xl
        shadow-[0_4px_0_rgba(0,0,0,0.15)]
        active:shadow-[0_2px_0_rgba(0,0,0,0.15)]
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
