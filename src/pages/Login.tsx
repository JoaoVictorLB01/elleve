import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-14 sm:pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 mb-3 sm:mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">{t("login.title")}</h1>
          <p className="text-[13px] sm:text-sm text-muted-foreground">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-border rounded-xl sm:rounded-2xl bg-card p-5 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <Label htmlFor="email" className="text-xs font-medium">{t("login.email")}</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl text-[15px] sm:text-sm" required />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="text-xs font-medium">{t("login.password")}</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl text-[15px] sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button variant="cosmic" className="w-full h-12 sm:h-11 text-[15px] sm:text-sm" size="lg" type="submit" disabled={loading}>
            {loading ? "Entrando..." : t("login.button")}
          </Button>

          <p className="text-center text-[13px] sm:text-sm text-muted-foreground pt-1 sm:pt-2">
            {t("login.noAccount")}{" "}
            <Link to="/cadastro" className="text-primary hover:underline font-medium">
              {t("login.register")}
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
