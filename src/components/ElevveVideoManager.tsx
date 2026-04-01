import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Edit, Trash2, Play, Upload, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useElevveVideos, useElevveVideosMutations, ElevveVideo } from "@/hooks/useElevveVideos";
import { useToast } from "@/hooks/use-toast";

interface Props {
  topicId: string;
  topicTitle: string;
  onClose: () => void;
}

const ElevveVideoManager = ({ topicId, topicTitle, onClose }: Props) => {
  const { data: videos = [], isLoading } = useElevveVideos(topicId);
  const mutations = useElevveVideosMutations();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ElevveVideo | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoInputType, setVideoInputType] = useState<"url" | "upload">("url");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setTitle(""); setDesc(""); setDuration(""); setVideoUrl("");
    setVideoFile(null); setVideoInputType("url"); setShowForm(true);
  };

  const openEdit = (v: ElevveVideo) => {
    setEditing(v);
    setTitle(v.title); setDesc(v.description || ""); setDuration(v.duration || "");
    setVideoUrl(v.video_url || ""); setVideoFile(null);
    setVideoInputType(v.video_url?.startsWith("http") ? "url" : "upload");
    setShowForm(true);
  };

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await mutations.updateVideo.mutateAsync({
          id: editing.id, title, description: desc, duration,
          video_url: videoUrl, sort_order: editing.sort_order,
          videoFile: videoFile || undefined,
        });
      } else {
        await mutations.addVideo.mutateAsync({
          topic_id: topicId, title, description: desc, duration,
          video_url: videoUrl, sort_order: videos.length,
          videoFile: videoFile || undefined,
        });
      }
      setShowForm(false);
      toast({ title: "Vídeo salvo com sucesso!" });
    } catch (err: any) {
      toast({ title: err?.message || "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await mutations.deleteVideo.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      toast({ title: "Vídeo removido!" });
    } catch (err: any) {
      toast({ title: err?.message || "Erro ao remover", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl z-10 max-h-[92vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold">Gerenciar Vídeos</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{topicTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Vídeos ({videos.length})</h3>
            <Button variant="cosmic" size="sm" onClick={openAdd} className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Vídeo
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {!isLoading && videos.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Nenhum vídeo cadastrado. Clique em "Vídeo" para adicionar.
            </div>
          )}

          {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-2 px-3 sm:px-4 py-3 border border-border rounded-xl hover:bg-muted/10 transition-colors">
              <Play className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">{video.title}</p>
                <p className="text-[10px] text-muted-foreground">{video.duration || "—"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-muted" onClick={() => openEdit(video)}>
                  <Edit className="h-3 w-3 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-muted" onClick={() => setDeleteTarget({ id: video.id, name: video.title })}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Video Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              <h3 className="text-base font-bold mb-4">{editing ? "Editar Vídeo" : "Novo Vídeo"}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Título</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" placeholder="Ex: Aula 1 - Introdução" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Duração</label>
                  <Input value={duration} onChange={(e) => setDuration(e.target.value)} className="rounded-xl" placeholder="Ex: 15min" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Vídeo</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setVideoInputType("url")}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${videoInputType === "url" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      <LinkIcon className="h-3.5 w-3.5 inline mr-1" /> Link (URL)
                    </button>
                    <button
                      onClick={() => setVideoInputType("upload")}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${videoInputType === "upload" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      <Upload className="h-3.5 w-3.5 inline mr-1" /> Upload
                    </button>
                  </div>
                  {videoInputType === "url" ? (
                    <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="rounded-xl" placeholder="https://youtube.com/embed/..." />
                  ) : (
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border hover:border-primary/40 transition-colors text-sm text-muted-foreground hover:text-foreground">
                      <Upload className="h-4 w-4" />
                      {videoFile ? videoFile.name : "Selecionar vídeo"}
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Descrição</label>
                  <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Descrição do vídeo..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowForm(false)}>Cancelar</Button>
                  <Button variant="cosmic" className="flex-1 rounded-xl" onClick={save} disabled={!title.trim() || saving}>
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Remover vídeo?</h3>
              <p className="text-sm text-muted-foreground mb-5">"{deleteTarget.name}" será removido permanentemente.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
                <Button variant="destructive" className="flex-1 rounded-xl" onClick={handleDelete} disabled={saving}>
                  {saving ? "Removendo..." : "Remover"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElevveVideoManager;
