import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/elleve-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Início" },
    { to: "/cursos", label: "Cursos" },
    { to: "/dashboard", label: "Minha Área" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Elleve" className="h-8 w-8" />
          <span className="text-xl font-display font-bold text-gradient-gold">Elleve</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Link>
          </Button>
          <Button size="sm" className="bg-gradient-cosmic" asChild>
            <Link to="/cadastro">Começar Agora</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="flex flex-col p-4 gap-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" className="flex-1" asChild>
                <Link to="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
              </Button>
              <Button size="sm" className="flex-1 bg-gradient-cosmic" asChild>
                <Link to="/cadastro" onClick={() => setIsOpen(false)}>Cadastrar</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
