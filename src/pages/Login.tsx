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
import { supabase } from "@/integrations/supabase/client";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
      const redirect = sessionStorage.getItem("auth-redirect");
      if (redirect) {
        sessionStorage.removeItem("auth-redirect");
        navigate(redirect);
      } else {
        navigate("/");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result?.error) {
      setGoogleLoading(false);
      toast({ title: "Erro ao entrar com Google", description: String(result.error), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-6 pt-20 sm:pt-16 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 mb-4 sm:mb-4">
            <Sparkles className="h-6 w-6 sm:h-5 sm:w-5 text-accent" />
          </div>
          <h1 className="text-[1.5rem] sm:text-2xl font-bold mb-2 sm:mb-2">{t("login.title")}</h1>
          <p className="text-sm sm:text-sm text-muted-foreground">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-border rounded-2xl bg-card p-6 sm:p-6 space-y-5 sm:space-y-5">
          <Button
            type="button"
            variant="outline"
            className="w-full h-[52px] sm:h-11 text-base sm:text-sm gap-3 font-medium active:scale-[0.97]"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <GoogleIcon />
            {googleLoading ? "Conectando..." : "Continuar com Google"}
          </Button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">{t("login.email")}</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 rounded-xl text-base sm:text-sm" required />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium">{t("login.password")}</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-11 h-12 rounded-xl text-base sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/esqueci-senha" className="text-xs text-primary hover:underline font-medium">
              {t("login.forgot")}
            </Link>
          </div>

          <Button variant="cosmic" className="w-full h-[52px] sm:h-11 text-base sm:text-sm active:scale-[0.97]" size="lg" type="submit" disabled={loading}>
            {loading ? "Entrando..." : t("login.button")}
          </Button>

          <p className="text-center text-sm sm:text-sm text-muted-foreground pt-2 sm:pt-2">
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
