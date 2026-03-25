import { motion } from "framer-motion";
import { StarRating } from "./StarRating";

interface LessonCardProps {
  title: string;
  icon: string;
  description: string;
  stars: number;
  locked: boolean;
  onClick: () => void;
  index: number;
}

export function LessonCard({
  title,
  icon,
  description,
  stars,
  locked,
  onClick,
  index,
}: LessonCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileTap={locked ? undefined : { scale: 0.97 }}
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`
        w-full flex items-center gap-4 p-4 rounded-2xl text-left
        transition-all cursor-pointer
        ${locked
          ? "bg-gray-100 opacity-60"
          : "bg-white shadow-sm hover:shadow-md border border-gray-100"
        }
      `}
    >
      <div className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center">
        {locked ? "\uD83D\uDD12" : icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-base text-kid-text truncate">
          {title}
        </h3>
        <p className="text-sm text-kid-text-light truncate">{description}</p>
      </div>
      {stars > 0 && !locked && (
        <div className="flex-shrink-0">
          <StarRating stars={stars} size="sm" />
        </div>
      )}
    </motion.button>
  );
}
