import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage, languages, type Language } from "@/contexts/LanguageContext";

interface LanguageSelectorProps {
  variant?: "desktop" | "mobile";
  onSelect?: () => void;
}

const LanguageSelector = ({ variant = "desktop", onSelect }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === language)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setOpen(false);
    onSelect?.();
  };

  if (variant === "mobile") {
    return (
      <div className="px-4 py-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 px-1">
          <Globe className="inline h-3 w-3 mr-1.5 -mt-0.5" />
          Idioma
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                language === lang.code
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground active:bg-muted/50"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
        aria-label="Select language"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="hidden lg:inline">{current.short}</span>
        <Globe className="h-3.5 w-3.5 lg:hidden" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-border bg-popover/95 backdrop-blur-xl shadow-xl py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-colors ${
                language === lang.code
                  ? "text-foreground bg-muted/50 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              <span className="ml-auto text-[10px] font-semibold text-muted-foreground/60">{lang.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
