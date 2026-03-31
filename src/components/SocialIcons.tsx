import { Facebook, Instagram } from "lucide-react";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const platformIcon: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
};

const platformLabel: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
};

interface SocialIconsProps {
  className?: string;
  iconSize?: string;
}

const SocialIcons = ({ className = "", iconSize = "h-5 w-5" }: SocialIconsProps) => {
  const { data: links } = useSocialLinks();

  const activeLinks = (links || []).filter((l) => l.enabled && l.url);

  if (activeLinks.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {activeLinks.map((link) => {
        const Icon = platformIcon[link.platform];
        if (!Icon) return null;
        return (
          <Tooltip key={link.id}>
            <TooltipTrigger asChild>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 active:scale-[0.93]"
                aria-label={platformLabel[link.platform]}
              >
                <Icon className={iconSize} />
              </a>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Siga-nos no {platformLabel[link.platform]}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default SocialIcons;
