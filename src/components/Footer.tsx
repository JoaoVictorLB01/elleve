import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-lg font-display font-bold text-gradient-gold">Elleve</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Eleve sua consciência. Transforme sua energia. Evolua como ser.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Plataforma</h4>
          <div className="flex flex-col gap-2">
            <Link to="/cursos" className="text-sm text-muted-foreground hover:text-primary">Cursos</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Minha Área</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Conta</h4>
          <div className="flex flex-col gap-2">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">Login</Link>
            <Link to="/cadastro" className="text-sm text-muted-foreground hover:text-primary">Cadastro</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Contato</h4>
          <p className="text-sm text-muted-foreground">contato@elleve.com.br</p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 Elleve. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
