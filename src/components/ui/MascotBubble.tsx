import { motion } from "framer-motion";

interface MascotBubbleProps {
  message: string;
  mood?: "happy" | "encouraging" | "celebrating";
}

const mascotEmoji: Record<string, string> = {
  happy: "\uD83E\uDD89",       // owl
  encouraging: "\uD83E\uDD8A", // fox
  celebrating: "\uD83E\uDD73", // party face
};

export function MascotBubble({ message, mood = "happy" }: MascotBubbleProps) {
  return (
    <motion.div
      className="flex items-start gap-3 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.div
        className="text-4xl flex-shrink-0"
        animate={
          mood === "celebrating"
            ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }
            : { y: [0, -4, 0] }
        }
        transition={{
          duration: mood === "celebrating" ? 0.5 : 2,
          repeat: mood === "celebrating" ? 2 : Infinity,
          ease: "easeInOut",
        }}
      >
        {mascotEmoji[mood]}
      </motion.div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex-1">
        <p className="font-display text-base text-kid-text">{message}</p>
      </div>
    </motion.div>
  );
}
