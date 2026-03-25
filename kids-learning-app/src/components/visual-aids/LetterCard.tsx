import { motion } from "framer-motion";

interface LetterCardProps {
  letter: string;
  word: string;
  emoji: string;
}

export function LetterCard({ letter, word, emoji }: LetterCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center gap-3 max-w-xs mx-auto"
    >
      <div className="flex items-baseline gap-2">
        <motion.span
          className="font-display text-7xl font-bold text-kid-purple"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {letter.toUpperCase()}
        </motion.span>
        <span className="font-display text-5xl font-bold text-kid-pink">
          {letter.toLowerCase()}
        </span>
      </div>

      <div className="text-5xl my-2">{emoji}</div>

      <p className="font-display text-lg text-kid-text">
        <span className="font-bold text-kid-purple">{letter.toUpperCase()}</span> is for{" "}
        <span className="font-bold">{word}</span>
      </p>
    </motion.div>
  );
}
