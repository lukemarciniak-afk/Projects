import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LessonCard } from "../../components/ui/LessonCard";
import { MascotBubble } from "../../components/ui/MascotBubble";
import { useProgressStore } from "../../store/useProgressStore";
import { countingLessons } from "../../data/math/counting";
import { additionLessons } from "../../data/math/addition";
import { subtractionLessons } from "../../data/math/subtraction";
export function MathHomePage() {
  const navigate = useNavigate();
  const { completedLessons, unlockedLessons } = useProgressStore();

  const topics = [
    { label: "Counting", icon: "\uD83D\uDD22", lessons: countingLessons },
    { label: "Addition", icon: "\u2795", lessons: additionLessons },
    { label: "Subtraction", icon: "\u2796", lessons: subtractionLessons },
  ];

  return (
    <div className="flex flex-col gap-6 py-2">
      <MascotBubble message="Let's do some math! Pick a lesson!" mood="happy" />

      {topics.map((topic) => (
        <motion.section
          key={topic.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-display text-lg font-bold text-kid-text mb-3 flex items-center gap-2">
            <span>{topic.icon}</span> {topic.label}
          </h3>
          <div className="flex flex-col gap-2">
            {topic.lessons.map((lesson, i) => {
              const result = completedLessons[lesson.id];
              const isUnlocked = unlockedLessons.includes(lesson.id);
              return (
                <LessonCard
                  key={lesson.id}
                  title={lesson.title}
                  icon={lesson.icon}
                  description={lesson.description}
                  stars={result?.stars ?? 0}
                  locked={!isUnlocked}
                  onClick={() => navigate(`/math/${lesson.id}`)}
                  index={i}
                />
              );
            })}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
