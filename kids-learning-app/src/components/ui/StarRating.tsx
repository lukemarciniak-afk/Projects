import { motion } from "framer-motion";

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function StarRating({ stars, maxStars = 3, size = "md" }: StarRatingProps) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: maxStars }, (_, i) => (
        <motion.span
          key={i}
          className={sizeMap[size]}
          initial={i < stars ? { scale: 0, rotate: -180 } : undefined}
          animate={i < stars ? { scale: 1, rotate: 0 } : undefined}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 300 }}
        >
          {i < stars ? "\u2B50" : "\u2606"}
        </motion.span>
      ))}
    </div>
  );
}
