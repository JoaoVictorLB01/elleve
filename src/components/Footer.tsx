import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-base font-display font-bold text-gradient-gold">Elleve</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Eleve sua consciência.<br />Transforme sua energia.<br />Evolua como ser.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-muted-foreground">
            Plataforma
          </h4>
          <div className="flex flex-col gap-3">
            <Link to="/cursos" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Cursos</Link>
            <Link to="/dashboard" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Minha Área</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-muted-foreground">
            Conta
          </h4>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Login</Link>
            <Link to="/cadastro" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Cadastro</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-muted-foreground">
            Contato
          </h4>
          <p className="text-sm text-foreground/70">contato@elleve.com.br</p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 Elleve. Todos os direitos reservados.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Termos</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
