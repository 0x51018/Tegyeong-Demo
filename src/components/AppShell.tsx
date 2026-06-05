import {
  House,
  MessageCircle,
  ShoppingBag,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { PropsWithChildren } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "홈", icon: House },
  { to: "/group-buy", label: "공구", icon: UsersRound },
  { to: "/market", label: "중고 거래", icon: ShoppingBag },
  { to: "/community", label: "커뮤니티", icon: MessageCircle },
  { to: "/profile", label: "마이", icon: UserRound },
];

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/vinyl/") || location.pathname.startsWith("/inventory/");

  return (
    <div className="page-background">
      <div className="app-frame">
        <main className={isDetail ? "app-content detail-content" : "app-content"}>
          {children}
        </main>
        {isDetail ? null : (
          <nav className="bottom-nav" aria-label="주요 메뉴">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
                end={to === "/"}
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
