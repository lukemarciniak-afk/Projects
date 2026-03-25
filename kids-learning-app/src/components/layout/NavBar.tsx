import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home", icon: "&#127968;" },
  { to: "/math", label: "Math", icon: "&#128290;" },
  { to: "/reading", label: "Reading", icon: "&#128218;" },
  { to: "/profile", label: "Stars", icon: "&#11088;" },
];

export function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 min-w-[64px] transition-all ${
                isActive
                  ? "text-kid-purple scale-110"
                  : "text-kid-text-light hover:text-kid-purple"
              }`
            }
          >
            <span
              className="text-2xl leading-none"
              dangerouslySetInnerHTML={{ __html: tab.icon }}
            />
            <span className="text-xs font-display font-semibold mt-1">
              {tab.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
