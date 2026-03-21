import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Sparkles, BookOpen, User, LogIn } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const items = [
    { to: "/", icon: Home, label: t("nav.home") },
    { to: "/produtos", icon: ShoppingBag, label: t("nav.products") },
    { to: "/biblioteca", icon: BookOpen, label: "Biblioteca" },
    ...(user
      ? [{ to: "/dashboard", icon: User, label: t("nav.myArea") }]
      : [{ to: "/login", icon: LogIn, label: t("nav.login") }]
    ),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-2xl safe-area-bottom">
      <div className="flex items-stretch justify-around h-[56px]">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors duration-150 active:scale-95 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`h-[20px] w-[20px] ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span className={`text-[10px] leading-none ${isActive ? "font-semibold" : "font-medium"}`}>
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
