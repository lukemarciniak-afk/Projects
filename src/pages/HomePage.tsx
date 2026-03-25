import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MascotBubble } from "../components/ui/MascotBubble";
import { BigButton } from "../components/ui/BigButton";
import { useProgressStore } from "../store/useProgressStore";

export function HomePage() {
  const navigate = useNavigate();
  const { currentStreak, totalStars } = useProgressStore();

  const greeting =
    currentStreak > 1
      ? `Welcome back! ${currentStreak} day streak! Keep it up!`
      : totalStars > 0
        ? "Welcome back! Ready to learn more?"
        : "Hi there! Let's learn together!";

  return (
    <div className="flex flex-col gap-6 py-4">
      <MascotBubble message={greeting} mood={currentStreak > 1 ? "celebrating" : "happy"} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="font-display text-2xl font-bold text-kid-text mb-1">
          What do you want to learn?
        </h2>
      </motion.div>

      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BigButton
            onClick={() => navigate("/math")}
            color="blue"
            variant="nav"
            className="w-full"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-3xl">&#128290;</span>
              <span>Math</span>
            </span>
          </BigButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BigButton
            onClick={() => navigate("/reading")}
            color="green"
            variant="nav"
            className="w-full"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-3xl">&#128218;</span>
              <span>Reading</span>
            </span>
          </BigButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <BigButton
            onClick={() => navigate("/profile")}
            color="yellow"
            variant="nav"
            className="w-full"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-3xl">&#11088;</span>
              <span>My Stars</span>
            </span>
          </BigButton>
        </motion.div>
      </div>
    </div>
  );
}
