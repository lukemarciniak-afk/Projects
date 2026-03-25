import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { NavBar } from "./NavBar";

export function AppShell() {
  return (
    <div className="min-h-dvh flex flex-col bg-kid-bg">
      <Header />
      <main className="flex-1 px-4 pb-24 pt-4 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
}
