import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, LogIn, LogOut, Sparkles, ChevronRight, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/elleve-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/cursos", label: t("nav.courses") },
    { to: "/biblioteca", label: t("nav.library") },
    { to: "/produtos", label: t("nav.products") },
    { to: "/dashboard", label: t("nav.myArea") },
    ...(isAdmin ? [{ to: "/admin", label: t("nav.admin") }] : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "border-b border-border/60 bg-background/95 backdrop-blur-2xl shadow-lg shadow-background/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-[60px] sm:h-16 items-center justify-between px-6 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Elleve" className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:scale-110" />
            <span className="text-base sm:text-lg font-bold text-gradient-gold tracking-wide">
              Elleve
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  location.pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-muted"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSelector />
            {user ? (
              <>
                {isAdmin && (
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-1.5 h-4 w-4" />
                  {t("nav.logout") || "Sair"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="mr-1.5 h-4 w-4" />
                    {t("nav.login")}
                  </Link>
                </Button>
                <Button variant="cosmic" size="sm" asChild>
                  <Link to="/cadastro">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    {t("nav.start")}
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2.5 -mr-1.5 rounded-xl text-foreground hover:bg-muted/60 transition-colors active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <div className="relative w-5 h-5">
              <X className={`h-5 w-5 absolute inset-0 transition-all duration-200 ${isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`} />
              <Menu className={`h-5 w-5 absolute inset-0 transition-all duration-200 ${isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-[60px] left-0 right-0 bottom-0 bg-background border-t border-border/40 transition-all duration-300 ease-out ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col px-5 pt-5 gap-0.5 overflow-y-auto">
              {links.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 text-[15px] font-medium rounded-xl transition-all duration-200 ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground active:bg-muted/40"
                  }`}
                  style={{ transitionDelay: isOpen ? `${i * 40}ms` : "0ms" }}
                >
                  {link.label}
                  <ChevronRight className={`h-4 w-4 transition-colors ${location.pathname === link.to ? "text-primary" : "text-muted-foreground/30"}`} />
                </Link>
              ))}

              {/* Language selector in mobile menu */}
              <div className="mt-4 border-t border-border/40 pt-4">
                <LanguageSelector variant="mobile" onSelect={() => setIsOpen(false)} />
              </div>
            </div>

            <div className="px-5 pb-8 pt-4 border-t border-border/40 space-y-2.5 safe-area-bottom">
              {user ? (
                <>
                  {isAdmin && (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary mb-2">
                      <Shield className="h-3.5 w-3.5" />
                      Admin
                    </div>
                  )}
                  <Button variant="outline" size="lg" className="w-full h-[52px] text-[15px] border-border/50 rounded-xl" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout") || "Sair"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="cosmic" size="lg" className="w-full h-[52px] text-[15px] rounded-xl" asChild>
                    <Link to="/cadastro" onClick={() => setIsOpen(false)}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t("nav.startNow")}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full h-[52px] text-[15px] border-border/50 rounded-xl" asChild>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      {t("nav.loginAccount")}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
