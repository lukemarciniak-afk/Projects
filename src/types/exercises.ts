export type Subject = "math" | "reading";
export type MathTopic = "counting" | "addition" | "subtraction";
export type ReadingTopic = "letters" | "sight-words" | "phonics";
export type Topic = MathTopic | ReadingTopic;

export type ExerciseType =
  | "multiple-choice"
  | "drag-and-drop"
  | "fill-in-blank"
  | "counting"
  | "tap-correct";

export interface Lesson {
  id: string;
  subject: Subject;
  topic: Topic;
  title: string;
  description: string;
  icon: string;
  order: number;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  visual?: VisualConfig;
  choices?: Choice[];
  correctAnswer: string | number;
  dragItems?: DragItem[];
  dropTargets?: DropTarget[];
  blanks?: BlankConfig[];
  items?: TapItem[];
}

export interface Choice {
  value: string | number;
  label: string;
}

export interface VisualConfig {
  type: "objects" | "number-line" | "addition-scene" | "subtraction-scene"
    | "letter" | "word-card" | "phonics-blend";
  data: Record<string, unknown>;
}

export interface DragItem {
  id: string;
  content: string;
}

export interface DropTarget {
  id: string;
  label: string;
  acceptsId: string;
}

export interface BlankConfig {
  position: number;
  answer: string | number;
  options: (string | number)[];
}

export interface TapItem {
  id: string;
  content: string;
  isCorrect: boolean;
}
