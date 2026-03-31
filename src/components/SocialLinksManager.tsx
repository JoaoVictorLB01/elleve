import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Plus, Trash2, X, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSocialLinks, useSocialLinksMutations, SocialLink } from "@/hooks/useSocialLinks";
import { useToast } from "@/hooks/use-toast";

const platformIcon: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
};

const platformLabel: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
};

const platformPlaceholder: Record<string, string> = {
  facebook: "https://facebook.com/suapagina",
  instagram: "https://instagram.com/seuperfil",
};

const SocialLinksManager = () => {
  const { data: links, isLoading } = useSocialLinks();
  const { upsert, addLink, deleteLink } = useSocialLinksMutations();
  const { toast } = useToast();
  const [edits, setEdits] = useState<Record<string, { url: string; enabled: boolean }>>({});
  const [newPlatform, setNewPlatform] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (links) {
      const map: Record<string, { url: string; enabled: boolean }> = {};
      links.forEach((l) => {
        map[l.id] = { url: l.url, enabled: l.enabled };
      });
      setEdits(map);
    }
  }, [links]);

  const handleSave = async (link: SocialLink) => {
    const edit = edits[link.id];
    if (!edit) return;

    if (edit.url && !isValidUrl(edit.url)) {
      toast({ title: "URL inválida", description: "Insira uma URL válida (ex: https://...)", variant: "destructive" });
      return;
    }

    try {
      await upsert.mutateAsync({ id: link.id, url: edit.url, enabled: edit.enabled });
      toast({ title: "Link salvo com sucesso!" });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleAdd = async () => {
    if (!newPlatform) return;
    try {
      await addLink.mutateAsync({ platform: newPlatform, url: "", sort_order: (links?.length || 0) });
      setShowAdd(false);
      setNewPlatform("");
      toast({ title: "Rede social adicionada!" });
    } catch {
      toast({ title: "Erro ao adicionar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLink.mutateAsync(id);
      toast({ title: "Rede social removida!" });
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const existingPlatforms = (links || []).map((l) => l.platform);
  const availablePlatforms = Object.keys(platformLabel).filter((p) => !existingPlatforms.includes(p));

  if (isLoading) return <div className="text-center py-8 text-sm text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-4">
      {(links || []).map((link, i) => {
        const Icon = platformIcon[link.platform];
        const edit = edits[link.id] || { url: link.url, enabled: link.enabled };
        const hasChanges = edit.url !== link.url || edit.enabled !== link.enabled;

        return (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-border rounded-xl bg-card p-4 sm:p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              {Icon && <Icon className="h-5 w-5 text-primary shrink-0" />}
              <span className="font-semibold text-sm flex-1">{platformLabel[link.platform] || link.platform}</span>
              <Switch
                checked={edit.enabled}
                onCheckedChange={(v) => setEdits((p) => ({ ...p, [link.id]: { ...edit, enabled: v } }))}
              />
            </div>
            <div className="flex gap-2">
              <Input
                value={edit.url}
                onChange={(e) => setEdits((p) => ({ ...p, [link.id]: { ...edit, url: e.target.value } }))}
                placeholder={platformPlaceholder[link.platform] || "https://..."}
                className="rounded-xl text-sm flex-1"
              />
              {edit.url && isValidUrl(edit.url) && (
                <a href={edit.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border hover:bg-muted transition-colors shrink-0">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              {hasChanges && (
                <Button variant="cosmic" size="sm" className="rounded-xl" onClick={() => handleSave(link)} disabled={upsert.isPending}>
                  <Check className="h-3.5 w-3.5 mr-1" /> Salvar
                </Button>
              )}
              <Button variant="outline" size="sm" className="rounded-xl text-destructive hover:text-destructive ml-auto" onClick={() => handleDelete(link.id)} disabled={deleteLink.isPending}>
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Remover
              </Button>
            </div>
          </motion.div>
        );
      })}

      {showAdd ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-dashed border-border rounded-xl bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Adicionar rede social</span>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          {availablePlatforms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map((p) => {
                const Icon = platformIcon[p];
                return (
                  <Button
                    key={p}
                    variant={newPlatform === p ? "cosmic" : "outline"}
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setNewPlatform(p)}
                  >
                    {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                    {platformLabel[p]}
                  </Button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Todas as redes já foram adicionadas.</p>
          )}
          {newPlatform && (
            <Button variant="cosmic" size="sm" className="rounded-xl mt-3" onClick={handleAdd} disabled={addLink.isPending}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar {platformLabel[newPlatform]}
            </Button>
          )}
        </motion.div>
      ) : (
        availablePlatforms.length > 0 && (
          <Button variant="outline" className="w-full rounded-xl border-dashed" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Adicionar rede social
          </Button>
        )
      )}
    </div>
  );
};

export default SocialLinksManager;
