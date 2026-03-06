import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-10">
        <div className="sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-base font-bold text-gradient-gold">Elleve</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[200px]">
            Eleve sua consciência. Transforme sua energia. Evolua como ser.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:col-span-2 sm:gap-10">
          <div>
            <h4 className="font-semibold mb-3 text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground">
              Plataforma
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/cursos" className="text-sm sm:text-sm text-foreground/70 hover:text-foreground transition-colors">Cursos</Link>
              <Link to="/dashboard" className="text-sm sm:text-sm text-foreground/70 hover:text-foreground transition-colors">Minha Área</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground">
              Conta
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/login" className="text-sm sm:text-sm text-foreground/70 hover:text-foreground transition-colors">Login</Link>
              <Link to="/cadastro" className="text-sm sm:text-sm text-foreground/70 hover:text-foreground transition-colors">Cadastro</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-[11px] sm:text-xs text-muted-foreground">
          © 2026 Elleve. Todos os direitos reservados.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">Termos</a>
          <a href="#" className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
