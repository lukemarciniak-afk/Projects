import { useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useExercise } from "../hooks/useExercise";
import { useSound } from "../hooks/useSound";
import { useProgressStore } from "../store/useProgressStore";
import { MascotBubble } from "../components/ui/MascotBubble";
import { ProgressBar } from "../components/ui/ProgressBar";
import { BigButton } from "../components/ui/BigButton";
import { CelebrationOverlay } from "../components/ui/CelebrationOverlay";
import { ExerciseFeedback } from "../components/exercises/ExerciseFeedback";
import { MultipleChoice } from "../components/exercises/MultipleChoice";
import { CountingExercise } from "../components/exercises/CountingExercise";
import { FillInBlank } from "../components/exercises/FillInBlank";
import { DragAndDrop } from "../components/exercises/DragAndDrop";
import { ObjectGroup } from "../components/visual-aids/ObjectGroup";
import { LetterCard } from "../components/visual-aids/LetterCard";
import { countingLessons } from "../data/math/counting";
import { additionLessons } from "../data/math/addition";
import { subtractionLessons } from "../data/math/subtraction";
import { letterLessons } from "../data/reading/letters";
import { sightWordLessons } from "../data/reading/sightWords";
import { phonicsLessons } from "../data/reading/phonics";
import type { Lesson } from "../types/exercises";

const allLessons: Lesson[] = [
  ...countingLessons,
  ...additionLessons,
  ...subtractionLessons,
  ...letterLessons,
  ...sightWordLessons,
  ...phonicsLessons,
];

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { play, speak } = useSound();
  const { completeLesson, unlockLesson } = useProgressStore();

  const lesson = useMemo(
    () => allLessons.find((l) => l.id === lessonId),
    [lessonId]
  );

  const nextLesson = useMemo(() => {
    if (!lesson) return null;
    const sameTopic = allLessons
      .filter((l) => l.topic === lesson.topic)
      .sort((a, b) => a.order - b.order);
    const idx = sameTopic.findIndex((l) => l.id === lesson.id);
    return idx >= 0 && idx < sameTopic.length - 1 ? sameTopic[idx + 1] : null;
  }, [lesson]);

  const exercises = lesson?.exercises ?? [];
  const ex = useExercise(exercises);

  // Speak prompt when presenting
  useEffect(() => {
    if (ex.phase === "presenting" && ex.currentExercise) {
      speak(ex.currentExercise.prompt);
      const timer = setTimeout(() => ex.startAnswering(), 2000);
      return () => clearTimeout(timer);
    }
  }, [ex.phase, ex.currentIndex]);

  // Play sounds on feedback
  useEffect(() => {
    if (ex.phase === "feedback") {
      play(ex.feedbackCorrect ? "correct" : "wrong");
      if (ex.feedbackCorrect) {
        const timer = setTimeout(() => ex.nextExercise(), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [ex.phase, ex.feedbackCorrect]);

  // Handle lesson completion
  useEffect(() => {
    if (ex.phase === "complete" && lesson) {
      play("celebrate");
      completeLesson(lesson.id, ex.score, ex.totalExercises);
      if (nextLesson) {
        unlockLesson(nextLesson.id);
      }
    }
  }, [ex.phase]);

  const handleAnswer = useCallback(
    (value: string | number) => {
      ex.submitAnswer(value);
    },
    [ex.submitAnswer]
  );

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="font-display text-xl text-kid-text">Lesson not found!</p>
        <BigButton onClick={() => navigate(-1)} color="purple">
          Go Back
        </BigButton>
      </div>
    );
  }

  const stars =
    ex.score === ex.totalExercises ? 3 : ex.score / ex.totalExercises >= 0.8 ? 2 : 1;

  const currentEx = ex.currentExercise;
  const visual = currentEx?.visual;

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <ProgressBar value={ex.progress} />
        <span className="font-display text-sm font-bold text-kid-text-light whitespace-nowrap">
          {ex.currentIndex + 1}/{ex.totalExercises}
        </span>
      </div>

      {/* Lesson title */}
      <h2 className="font-display text-xl font-bold text-kid-purple text-center">
        {lesson.icon} {lesson.title}
      </h2>

      {/* Exercise content */}
      {ex.phase !== "complete" && currentEx && (
        <motion.div
          key={`${currentEx.id}-${ex.currentIndex}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex flex-col gap-4"
        >
          {/* Prompt */}
          <MascotBubble
            message={currentEx.prompt}
            mood={ex.feedbackCorrect === false ? "encouraging" : "happy"}
          />

          {/* Visual aid */}
          {visual?.type === "objects" && (
            <ObjectGroup
              count={visual.data.count as number}
              objectType={visual.data.item as string}
            />
          )}

          {visual?.type === "addition-scene" && (
            <div className="flex items-center justify-center gap-2">
              <ObjectGroup
                count={visual.data.a as number}
                objectType={visual.data.item as string}
                size="sm"
              />
              <span className="font-display text-3xl font-bold text-kid-orange">+</span>
              <ObjectGroup
                count={visual.data.b as number}
                objectType={visual.data.item as string}
                size="sm"
              />
            </div>
          )}

          {visual?.type === "subtraction-scene" && (
            <div className="flex flex-col items-center gap-2">
              <ObjectGroup
                count={visual.data.total as number}
                objectType={visual.data.item as string}
                size="sm"
              />
              <span className="font-display text-sm text-kid-orange">
                {visual.data.remove as number} go away!
              </span>
            </div>
          )}

          {visual?.type === "letter" && (
            <LetterCard
              letter={visual.data.letter as string}
              word={visual.data.word as string}
              emoji={visual.data.emoji as string}
            />
          )}

          {visual?.type === "word-card" && (
            <motion.div
              className="bg-white rounded-2xl shadow-md p-6 text-center mx-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <span className="font-display text-4xl font-bold text-kid-purple">
                {visual.data.word as string}
              </span>
            </motion.div>
          )}

          {/* Exercise interaction */}
          {(ex.phase === "answering" ||
            (ex.phase === "feedback" && !ex.feedbackCorrect && ex.currentAttempts < 3)) && (
            <>
              {currentEx.type === "counting" && visual?.type === "objects" && (
                <CountingExercise
                  count={visual.data.count as number}
                  objectType={visual.data.item as string}
                  onAnswer={handleAnswer}
                />
              )}

              {currentEx.type === "multiple-choice" && currentEx.choices && (
                <MultipleChoice
                  choices={currentEx.choices}
                  onAnswer={handleAnswer}
                  disabled={ex.phase === "feedback"}
                />
              )}

              {currentEx.type === "fill-in-blank" && currentEx.blanks && (
                <FillInBlank
                  equation={currentEx.prompt}
                  options={currentEx.blanks[0].options}
                  onAnswer={handleAnswer}
                  disabled={ex.phase === "feedback"}
                />
              )}

              {currentEx.type === "drag-and-drop" &&
                currentEx.dragItems &&
                currentEx.dropTargets && (
                  <DragAndDrop
                    items={currentEx.dragItems}
                    targets={currentEx.dropTargets}
                    onComplete={(correct) =>
                      handleAnswer(correct ? currentEx.correctAnswer : "wrong")
                    }
                  />
                )}
            </>
          )}

          {/* Feedback */}
          <ExerciseFeedback
            correct={ex.feedbackCorrect}
            correctAnswer={
              ex.phase === "feedback" && !ex.feedbackCorrect
                ? currentEx.correctAnswer
                : undefined
            }
            show={ex.phase === "feedback" || ex.feedbackCorrect === false}
          />

          {/* Wrong answer - try again or continue */}
          {ex.phase === "feedback" && !ex.feedbackCorrect && (
            <BigButton onClick={() => ex.nextExercise()} color="orange">
              Continue &#10145;
            </BigButton>
          )}

          {/* Presenting phase - tap to start */}
          {ex.phase === "presenting" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <BigButton onClick={() => ex.startAnswering()} color="teal">
                Let&apos;s Go! &#128640;
              </BigButton>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Celebration */}
      <CelebrationOverlay
        show={ex.phase === "complete"}
        stars={stars}
        score={ex.score}
        total={ex.totalExercises}
        onNext={
          nextLesson
            ? () => {
                const base = lesson.subject === "math" ? "/math" : "/reading";
                navigate(`${base}/${nextLesson.id}`);
              }
            : undefined
        }
        onHome={() => navigate("/")}
      />
    </div>
  );
}
