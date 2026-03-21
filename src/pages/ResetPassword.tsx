import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: t("reset.tooShort"), variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: t("reset.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("reset.success") });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-[1.5rem] font-bold mb-2">{t("reset.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("reset.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-border rounded-2xl bg-card p-6 space-y-5">
          <div>
            <Label htmlFor="password" className="text-sm font-medium">{t("reset.newPassword")}</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-11 h-12 rounded-xl text-base"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="text-xs text-destructive mt-1.5">{t("reset.tooShort")}</p>
            )}
          </div>
          <Button variant="cosmic" className="w-full h-[52px] text-base active:scale-[0.97]" size="lg" type="submit" disabled={loading}>
            {loading ? t("reset.saving") : t("reset.button")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
