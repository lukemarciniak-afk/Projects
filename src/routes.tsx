import { createHashRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./pages/HomePage";
import { MathHomePage } from "./pages/math/MathHomePage";
import { ReadingHomePage } from "./pages/reading/ReadingHomePage";
import { LessonPage } from "./pages/LessonPage";
import { ProfilePage } from "./pages/ProfilePage";

export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/math", element: <MathHomePage /> },
      { path: "/math/:lessonId", element: <LessonPage /> },
      { path: "/reading", element: <ReadingHomePage /> },
      { path: "/reading/:lessonId", element: <LessonPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
]);
