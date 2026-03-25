import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LessonCard } from "../../components/ui/LessonCard";
import { MascotBubble } from "../../components/ui/MascotBubble";
import { useProgressStore } from "../../store/useProgressStore";
import { letterLessons } from "../../data/reading/letters";
import { sightWordLessons } from "../../data/reading/sightWords";
import { phonicsLessons } from "../../data/reading/phonics";

export function ReadingHomePage() {
  const navigate = useNavigate();
  const { completedLessons, unlockedLessons } = useProgressStore();

  const topics = [
    { label: "Letters", icon: "\uD83D\uDD24", lessons: letterLessons.slice(0, 10) },
    { label: "More Letters", icon: "\uD83C\uDFB5", lessons: letterLessons.slice(10, 20) },
    { label: "Last Letters", icon: "\u2728", lessons: letterLessons.slice(20) },
    { label: "Sight Words", icon: "\uD83D\uDCD6", lessons: sightWordLessons },
    { label: "Phonics", icon: "\uD83E\uDDE9", lessons: phonicsLessons },
  ];

  return (
    <div className="flex flex-col gap-6 py-2">
      <MascotBubble message="Let's read! Pick a lesson!" mood="happy" />

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
                  onClick={() => navigate(`/reading/${lesson.id}`)}
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
