import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
}

const AuthGateModal = ({ open, onClose, redirectTo }: AuthGateModalProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleNavigate = (path: string) => {
    if (redirectTo) {
      sessionStorage.setItem("auth-redirect", redirectTo);
    }
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/85 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-2xl z-10 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
              <Lock className="h-6 w-6 text-primary" />
            </div>

            <h3 className="text-lg font-bold mb-2">{t("authGate.title")}</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {t("authGate.desc")}
            </p>

            <div className="flex flex-col gap-3">
              <Button
                variant="cosmic"
                size="lg"
                className="w-full h-[52px] text-base active:scale-[0.97]"
                onClick={() => handleNavigate("/cadastro")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t("authGate.register")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-[52px] text-base active:scale-[0.97]"
                onClick={() => handleNavigate("/login")}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {t("authGate.login")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthGateModal;
