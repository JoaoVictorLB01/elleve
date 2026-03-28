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
    ...(user
      ? [{ to: "/dashboard", icon: User, label: t("nav.myArea") }]
      : [{ to: "/login", icon: LogIn, label: t("nav.login") }]
    ),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-2xl safe-area-bottom">
      <div className="flex items-stretch justify-around h-[64px]">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 min-h-[56px] gap-1 transition-colors duration-150 active:scale-[0.93] ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`h-[22px] w-[22px] ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span className={`text-[11px] leading-none ${isActive ? "font-semibold" : "font-medium"}`}>
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
