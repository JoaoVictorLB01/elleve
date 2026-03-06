import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/elleve-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Início" },
    { to: "/cursos", label: "Cursos" },
    { to: "/dashboard", label: "Minha Área" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "border-b border-border/60 bg-background/95 backdrop-blur-2xl shadow-lg shadow-background/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
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

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">
              <LogIn className="mr-1.5 h-4 w-4" />
              Entrar
            </Link>
          </Button>
          <Button variant="cosmic" size="sm" asChild>
            <Link to="/cadastro">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Começar
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-1 rounded-lg text-foreground hover:bg-muted/60 transition-colors active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav - Full screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden fixed inset-x-0 top-14 bottom-0 bg-background/98 backdrop-blur-2xl overflow-hidden z-40"
          >
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col px-5 pt-6 gap-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 text-[15px] font-medium rounded-xl transition-colors ${
                        location.pathname === link.to
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground active:bg-muted/50"
                      }`}
                    >
                      {link.label}
                      <ChevronRight className={`h-4 w-4 ${location.pathname === link.to ? "text-primary" : "text-muted-foreground/40"}`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="px-5 pb-8 pt-4 border-t border-border/50 space-y-3"
              >
                <Button variant="cosmic" size="lg" className="w-full h-12 text-[15px]" asChild>
                  <Link to="/cadastro" onClick={() => setIsOpen(false)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Começar Agora
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full h-12 text-[15px] border-border/60" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Entrar na Conta
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
