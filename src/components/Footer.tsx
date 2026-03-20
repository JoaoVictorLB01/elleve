import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-10">
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-base font-bold text-gradient-gold">Elleve</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:col-span-2 sm:gap-10">
            <div>
              <h4 className="font-semibold mb-3 text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground">
                {t("footer.platform")}
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/cursos" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t("footer.courses")}</Link>
                <Link to="/biblioteca" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t("footer.library")}</Link>
                <Link to="/produtos" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t("nav.products")}</Link>
                <Link to="/dashboard" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t("footer.myArea")}</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground">
                {t("footer.account")}
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/login" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t("footer.login")}</Link>
                <Link to="/cadastro" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t("footer.register")}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            {t("footer.rights")}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</a>
            <a href="#" className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
