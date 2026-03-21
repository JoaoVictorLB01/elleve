import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setLoading(false);
    if (error) {
      toast({ title: t("forgot.error"), description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-[1.5rem] font-bold mb-2">{t("forgot.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("forgot.subtitle")}</p>
        </div>

        {sent ? (
          <div className="border border-border rounded-2xl bg-card p-6 text-center space-y-4">
            <Mail className="h-10 w-10 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground leading-relaxed">{t("forgot.sent")}</p>
            <Link to="/login" className="text-primary hover:underline font-medium text-sm">
              {t("forgot.backToLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-border rounded-2xl bg-card p-6 space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">{t("login.email")}</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 rounded-xl text-base" required />
              </div>
            </div>
            <Button variant="cosmic" className="w-full h-[52px] text-base active:scale-[0.97]" size="lg" type="submit" disabled={loading}>
              {loading ? t("forgot.sending") : t("forgot.button")}
            </Button>
            <p className="text-center text-sm text-muted-foreground pt-1">
              <Link to="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("forgot.backToLogin")}
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
