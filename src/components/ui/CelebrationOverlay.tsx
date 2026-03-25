import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { StarRating } from "./StarRating";
import { BigButton } from "./BigButton";

interface CelebrationOverlayProps {
  show: boolean;
  stars: number;
  score: number;
  total: number;
  onNext?: () => void;
  onHome?: () => void;
}

export function CelebrationOverlay({
  show,
  stars,
  score,
  total,
  onNext,
  onHome,
}: CelebrationOverlayProps) {
  useEffect(() => {
    if (show) {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#4FC3F7", "#81C784", "#FFD54F", "#F48FB1", "#CE93D8"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#4FC3F7", "#81C784", "#FFD54F", "#F48FB1", "#CE93D8"],
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white/95 flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            &#127881;
          </motion.div>

          <motion.h2
            className="font-display text-3xl font-bold text-kid-purple mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Great Job!
          </motion.h2>

          <motion.p
            className="font-display text-lg text-kid-text-light mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            You got {score} out of {total} right!
          </motion.p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="mb-8"
          >
            <StarRating stars={stars} size="lg" />
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 w-full max-w-xs"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {onNext && (
              <BigButton onClick={onNext} color="green">
                Next Lesson &#10145;
              </BigButton>
            )}
            {onHome && (
              <BigButton onClick={onHome} color="purple">
                Go Home &#127968;
              </BigButton>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
