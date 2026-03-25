import { motion } from "framer-motion";

interface ObjectGroupProps {
  count: number;
  objectType: string;
  size?: "sm" | "md" | "lg";
}

const OBJECT_EMOJIS: Record<string, string> = {
  apple: "\uD83C\uDF4E",
  star: "\u2B50",
  butterfly: "\uD83E\uDD8B",
  fish: "\uD83D\uDC1F",
  cookie: "\uD83C\uDF6A",
  balloon: "\uD83C\uDF88",
  flower: "\uD83C\uDF3B",
  heart: "\u2764\uFE0F",
  bear: "\uD83D\uDC3B",
  cat: "\uD83D\uDC31",
};

const sizeMap = { sm: "text-2xl w-10 h-10", md: "text-3xl w-14 h-14", lg: "text-4xl w-16 h-16" };

export function ObjectGroup({ count, objectType, size = "md" }: ObjectGroupProps) {
  const emoji = OBJECT_EMOJIS[objectType] ?? "\uD83C\uDF4E";

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: i * 0.08,
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
          className={`${sizeMap[size]} flex items-center justify-center`}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}
