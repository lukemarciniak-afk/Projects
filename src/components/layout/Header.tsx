import { useProgressStore } from "../../store/useProgressStore";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const { totalStars, currentStreak } = useProgressStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between">
      {!isHome ? (
        <button
          onClick={() => navigate(-1)}
          className="text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-kid-bg-dark transition-colors"
          aria-label="Go back"
        >
          &#8592;
        </button>
      ) : (
        <div className="w-10" />
      )}

      <h1
        className="font-display text-xl font-bold text-kid-purple cursor-pointer"
        onClick={() => navigate("/")}
      >
        KidLearn
      </h1>

      <div className="flex items-center gap-3">
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 text-kid-orange font-bold font-display">
            <span className="text-lg">&#128293;</span>
            <span>{currentStreak}</span>
          </div>
        )}
        <motion.div
          className="flex items-center gap-1 bg-kid-yellow/30 px-3 py-1 rounded-full font-bold font-display"
          key={totalStars}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-lg">&#11088;</span>
          <span className="text-kid-text">{totalStars}</span>
        </motion.div>
      </div>
    </header>
  );
}
