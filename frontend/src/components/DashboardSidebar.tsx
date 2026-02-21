import { NavLink } from "react-router-dom";

import { useChatbot } from "../context/ChatbotContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/dashboard#account", label: "Account", icon: "💳" },
  { to: "/dashboard#statements", label: "Statements", icon: "📄" },
  { to: "/dashboard#support", label: "Support", icon: "📞" },
  { to: "/dashboard#settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardSidebar() {
  const { setOpen: openChatbot } = useChatbot();

  return (
    <aside className="dashboard-sidebar">
      <nav className="dashboard-sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `dashboard-sidebar__link ${isActive ? "dashboard-sidebar__link--active" : ""}`
            }
            end={item.to === "/dashboard"}
          >
            <span className="dashboard-sidebar__icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className="dashboard-sidebar__chat"
          onClick={() => openChatbot(true)}
        >
          <span className="dashboard-sidebar__icon" aria-hidden="true">🤖</span>
          <span>Chat with Jack AI</span>
        </button>
      </nav>
    </aside>
  );
}
