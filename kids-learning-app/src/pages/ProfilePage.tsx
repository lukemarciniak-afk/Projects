import { motion } from "framer-motion";
import { useProgressStore } from "../store/useProgressStore";
import { MascotBubble } from "../components/ui/MascotBubble";
import { StarRating } from "../components/ui/StarRating";

interface Badge {
  id: string;
  title: string;
  icon: string;
  condition: (state: { totalStars: number; currentStreak: number; longestStreak: number; completedCount: number }) => boolean;
}

const badges: Badge[] = [
  { id: "first-steps", title: "First Steps!", icon: "\uD83D\uDC63", condition: (s) => s.completedCount >= 1 },
  { id: "star-5", title: "5 Stars!", icon: "\u2B50", condition: (s) => s.totalStars >= 5 },
  { id: "star-10", title: "10 Stars!", icon: "\uD83C\uDF1F", condition: (s) => s.totalStars >= 10 },
  { id: "star-25", title: "25 Stars!", icon: "\uD83D\uDCAB", condition: (s) => s.totalStars >= 25 },
  { id: "star-50", title: "50 Stars!", icon: "\uD83C\uDFC6", condition: (s) => s.totalStars >= 50 },
  { id: "streak-3", title: "3 Day Streak!", icon: "\uD83D\uDD25", condition: (s) => s.longestStreak >= 3 },
  { id: "streak-7", title: "Week Streak!", icon: "\u26A1", condition: (s) => s.longestStreak >= 7 },
  { id: "math-5", title: "Math Explorer", icon: "\uD83E\uDDE0", condition: (s) => s.completedCount >= 5 },
  { id: "reading-5", title: "Book Worm", icon: "\uD83D\uDC1B", condition: (s) => s.completedCount >= 10 },
];

export function ProfilePage() {
  const { totalStars, currentStreak, longestStreak, completedLessons } = useProgressStore();
  const completedCount = Object.keys(completedLessons).length;
  const state = { totalStars, currentStreak, longestStreak, completedCount };

  const earnedBadges = badges.filter((b) => b.condition(state));
  const lockedBadges = badges.filter((b) => !b.condition(state));

  return (
    <div className="flex flex-col gap-6 py-2">
      <MascotBubble
        message={
          totalStars === 0
            ? "Complete lessons to earn stars!"
            : `Amazing! You have ${totalStars} stars!`
        }
        mood={totalStars > 10 ? "celebrating" : "happy"}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm text-center"
        >
          <div className="text-3xl mb-1">&#11088;</div>
          <div className="font-display text-2xl font-bold text-kid-star">{totalStars}</div>
          <div className="text-xs text-kid-text-light font-display">Stars</div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm text-center"
        >
          <div className="text-3xl mb-1">&#128293;</div>
          <div className="font-display text-2xl font-bold text-kid-orange">{currentStreak}</div>
          <div className="text-xs text-kid-text-light font-display">Streak</div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm text-center"
        >
          <div className="text-3xl mb-1">&#128218;</div>
          <div className="font-display text-2xl font-bold text-kid-green">{completedCount}</div>
          <div className="text-xs text-kid-text-light font-display">Lessons</div>
        </motion.div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <section>
          <h3 className="font-display text-lg font-bold text-kid-text mb-3">
            &#127942; My Badges
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="bg-white rounded-2xl p-3 shadow-sm text-center"
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="font-display text-xs font-bold text-kid-text">
                  {badge.title}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <section>
          <h3 className="font-display text-lg font-bold text-kid-text-light mb-3">
            &#128274; Keep Going!
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-100 rounded-2xl p-3 text-center opacity-50"
              >
                <div className="text-3xl mb-1 grayscale">&#10067;</div>
                <div className="font-display text-xs font-bold text-kid-text-light">
                  {badge.title}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Lessons */}
      {completedCount > 0 && (
        <section>
          <h3 className="font-display text-lg font-bold text-kid-text mb-3">
            &#128200; Recent Lessons
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(completedLessons)
              .sort(([, a], [, b]) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
              .slice(0, 5)
              .map(([id, result]) => (
                <div
                  key={id}
                  className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between"
                >
                  <span className="font-display text-sm font-bold text-kid-text truncate">
                    {id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <StarRating stars={result.stars} size="sm" />
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
