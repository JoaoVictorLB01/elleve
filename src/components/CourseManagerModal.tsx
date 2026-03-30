import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Edit, Trash2, ChevronDown, ChevronUp,
  Play, GripVertical, Image as ImageIcon, Upload, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAllDbData, useCoursesMutations, DbCourse, DbModule, DbLesson } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";

interface Props {
  courseId: string;
  onClose: () => void;
}

const CourseManagerModal = ({ courseId, onClose }: Props) => {
  const { data, isLoading } = useAllDbData();
  const mutations = useCoursesMutations();
  const { toast } = useToast();

  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<DbModule | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<DbLesson | null>(null);
  const [lessonModuleId, setLessonModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null);
  const [videoInputType, setVideoInputType] = useState<"url" | "upload">("url");

  const [deleteTarget, setDeleteTarget] = useState<{ type: "module" | "lesson"; id: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const course = data?.courses.find((c) => c.id === courseId);
  const modules = (data?.modules || []).filter((m) => m.course_id === courseId).sort((a, b) => a.sort_order - b.sort_order);
  const lessons = (data?.lessons || []).filter((l) => l.course_id === courseId).sort((a, b) => a.sort_order - b.sort_order);

  const openAddModule = () => {
    setEditingModule(null);
    setModuleTitle("");
    setModuleDesc("");
    setShowModuleForm(true);
  };

  const openEditModule = (mod: DbModule) => {
    setEditingModule(mod);
    setModuleTitle(mod.title);
    setModuleDesc(mod.description || "");
    setShowModuleForm(true);
  };

  const saveModule = async () => {
    if (!moduleTitle.trim()) return;
    setSaving(true);
    try {
      if (editingModule) {
        await mutations.updateModule.mutateAsync({
          id: editingModule.id,
          title: moduleTitle,
          description: moduleDesc,
          sort_order: editingModule.sort_order,
        });
      } else {
        await mutations.addModule.mutateAsync({
          course_id: courseId,
          title: moduleTitle,
          description: moduleDesc,
          sort_order: modules.length,
        });
      }
      setShowModuleForm(false);
      toast({ title: "Módulo salvo com sucesso!" });
    } catch (err: any) {
      toast({ title: err?.message || "Erro ao salvar módulo", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const openAddLesson = (moduleId: string) => {
    setEditingLesson(null);
    setLessonModuleId(moduleId);
    setLessonTitle("");
    setLessonDesc("");
    setLessonDuration("");
    setLessonVideoUrl("");
    setLessonVideoFile(null);
    setVideoInputType("url");
    setShowLessonForm(true);
  };

  const openEditLesson = (lesson: DbLesson) => {
    setEditingLesson(lesson);
    setLessonModuleId(lesson.module_id);
    setLessonTitle(lesson.title);
    setLessonDesc(lesson.description || "");
    setLessonDuration(lesson.duration);
    setLessonVideoUrl(lesson.video_url);
    setLessonVideoFile(null);
    setVideoInputType(lesson.video_url?.startsWith("http") ? "url" : "upload");
    setShowLessonForm(true);
  };

  const saveLesson = async () => {
    if (!lessonTitle.trim()) return;
    setSaving(true);
    try {
      const moduleLessons = lessons.filter((l) => l.module_id === lessonModuleId);
      if (editingLesson) {
        await mutations.updateLesson.mutateAsync({
          id: editingLesson.id,
          title: lessonTitle,
          description: lessonDesc,
          duration: lessonDuration,
          video_url: lessonVideoUrl,
          sort_order: editingLesson.sort_order,
          videoFile: lessonVideoFile || undefined,
        });
      } else {
        await mutations.addLesson.mutateAsync({
          module_id: lessonModuleId,
          course_id: courseId,
          title: lessonTitle,
          description: lessonDesc,
          duration: lessonDuration,
          video_url: lessonVideoUrl,
          sort_order: moduleLessons.length,
          videoFile: lessonVideoFile || undefined,
        });
      }
      setShowLessonForm(false);
      toast({ title: "Aula salva com sucesso!" });
    } catch (err: any) {
      toast({ title: err?.message || "Erro ao salvar aula", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      if (deleteTarget.type === "module") {
        await mutations.deleteModule.mutateAsync(deleteTarget.id);
      } else {
        await mutations.deleteLesson.mutateAsync(deleteTarget.id);
      }
      setDeleteTarget(null);
      toast({ title: "Item removido com sucesso!" });
    } catch (err: any) {
      toast({ title: err?.message || "Erro ao remover", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full z-10" />
      </div>
    );
  }

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
            <h2 className="text-base sm:text-lg font-bold">Gerenciar Curso</h2>
            {course && <p className="text-xs text-muted-foreground mt-0.5">{course.title}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Módulos & Aulas</h3>
            <Button variant="cosmic" size="sm" onClick={openAddModule} className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Módulo
            </Button>
          </div>

          {modules.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Nenhum módulo criado. Clique em "Módulo" para começar.
            </div>
          )}

          {modules.map((mod, mi) => {
            const modLessons = lessons.filter((l) => l.module_id === mod.id);
            const isExpanded = expandedModule === mod.id;
            return (
              <div key={mod.id} className="border border-border rounded-xl bg-muted/10 overflow-hidden">
                <button
                  onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                  className="w-full flex items-center gap-2 p-3 sm:p-4 text-left hover:bg-muted/20 transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {mi + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{mod.title}</p>
                    <p className="text-[10px] text-muted-foreground">{modLessons.length} aula(s)</p>
                  </div>
                  <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1.5 rounded-lg hover:bg-muted" onClick={() => openEditModule(mod)}>
                      <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted" onClick={() => setDeleteTarget({ type: "module", id: mod.id, name: mod.title })}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border divide-y divide-border/50">
                        {modLessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 hover:bg-muted/10 transition-colors">
                            <Play className="h-3.5 w-3.5 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium truncate">{lesson.title}</p>
                              <p className="text-[10px] text-muted-foreground">{lesson.duration || "—"}</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button className="p-1.5 rounded-lg hover:bg-muted" onClick={() => openEditLesson(lesson)}>
                                <Edit className="h-3 w-3 text-muted-foreground" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-muted" onClick={() => setDeleteTarget({ type: "lesson", id: lesson.id, name: lesson.title })}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="p-2.5 sm:p-3">
                          <Button variant="outline" size="sm" className="w-full text-xs rounded-lg" onClick={() => openAddLesson(mod.id)}>
                            <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Aula
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Module Form */}
      <AnimatePresence>
        {showModuleForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModuleForm(false)} />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl z-10"
            >
              <h3 className="text-base font-bold mb-4">{editingModule ? "Editar Módulo" : "Novo Módulo"}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Título</label>
                  <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} className="rounded-xl" placeholder="Ex: Fundamentos" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Descrição</label>
                  <Textarea value={moduleDesc} onChange={(e) => setModuleDesc(e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Descrição do módulo..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowModuleForm(false)}>Cancelar</Button>
                  <Button variant="cosmic" className="flex-1 rounded-xl" onClick={saveModule} disabled={!moduleTitle.trim() || saving}>
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Form */}
      <AnimatePresence>
        {showLessonForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowLessonForm(false)} />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              <h3 className="text-base font-bold mb-4">{editingLesson ? "Editar Aula" : "Nova Aula"}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Título</label>
                  <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} className="rounded-xl" placeholder="Ex: Introdução à meditação" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Duração</label>
                  <Input value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} className="rounded-xl" placeholder="Ex: 15min" />
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
                    <Input
                      value={lessonVideoUrl}
                      onChange={(e) => setLessonVideoUrl(e.target.value)}
                      className="rounded-xl"
                      placeholder="https://youtube.com/embed/..."
                    />
                  ) : (
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border hover:border-primary/40 transition-colors text-sm text-muted-foreground hover:text-foreground">
                      <Upload className="h-4 w-4" />
                      {lessonVideoFile ? lessonVideoFile.name : "Selecionar vídeo"}
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => setLessonVideoFile(e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Descrição</label>
                  <Textarea value={lessonDesc} onChange={(e) => setLessonDesc(e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Descrição da aula..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowLessonForm(false)}>Cancelar</Button>
                  <Button variant="cosmic" className="flex-1 rounded-xl" onClick={saveLesson} disabled={!lessonTitle.trim() || saving}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Confirmar exclusão</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Tem certeza que deseja remover "{deleteTarget.name}"?
                {deleteTarget.type === "module" && " Todas as aulas deste módulo serão removidas."}
              </p>
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

export default CourseManagerModal;
