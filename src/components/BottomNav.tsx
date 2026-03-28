import { Link, useLocation } from "react-router-dom";
import { Home, GraduationCap, BookOpen, Flame, User, LogIn } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const items = [
    { to: "/", icon: Home, label: t("nav.home") },
    { to: "/cursos", icon: GraduationCap, label: t("nav.courses") },
    { to: "/biblioteca", icon: BookOpen, label: "Biblioteca" },
    { to: "/elevve-se", icon: Flame, label: "Elevve-se" },
    ...(user
      ? [{ to: "/dashboard", icon: User, label: t("nav.myArea") }]
      : [{ to: "/login", icon: LogIn, label: t("nav.login") }]
    ),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-background/95 backdrop-blur-2xl safe-area-bottom">
      <div className="flex items-stretch justify-around h-[60px]">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center justify-center flex-1 min-h-[48px] gap-0.5 transition-colors duration-200 active:scale-[0.93] ${
                isActive ? "text-primary" : "text-muted-foreground/50"
              }`}
            >
              {isActive && (
                <span
                  className="absolute top-1.5 w-6 h-6 rounded-full opacity-20 blur-md pointer-events-none"
                  style={{ background: "hsl(var(--primary))" }}
                />
              )}
              <item.icon
                className={`relative z-10 transition-all duration-200 ${
                  isActive
                    ? "h-[21px] w-[21px] stroke-[2.2]"
                    : "h-[19px] w-[19px] stroke-[1.5]"
                }`}
              />
              <span
                className={`relative z-10 leading-none transition-all duration-200 ${
                  isActive ? "text-[10px] font-semibold" : "text-[10px] font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
