import { motion, AnimatePresence } from "framer-motion";

interface ExerciseFeedbackProps {
  correct: boolean | null;
  correctAnswer?: string | number;
  show: boolean;
}

export function ExerciseFeedback({ correct, correctAnswer, show }: ExerciseFeedbackProps) {
  return (
    <AnimatePresence>
      {show && correct !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`
            text-center py-3 px-6 rounded-2xl font-display font-bold text-lg
            ${correct
              ? "bg-kid-correct/20 text-kid-correct"
              : "bg-kid-incorrect/20 text-kid-orange"
            }
          `}
        >
          {correct ? (
            <span>&#10024; Awesome! That&apos;s right! &#10024;</span>
          ) : (
            <span>
              Try again! &#128170;
              {correctAnswer !== undefined && (
                <span className="block text-base mt-1">
                  The answer is {String(correctAnswer)}
                </span>
              )}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
