import { useState } from "react";
import { motion } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCoursesMutations, DbCourse } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";

interface Props {
  course?: DbCourse | null;
  onClose: () => void;
}

const courseCategories = ["Energia", "Cristais", "Consciência", "Meditação", "Desenvolvimento Pessoal"];

const CourseFormModal = ({ course, onClose }: Props) => {
  const mutations = useCoursesMutations();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [instructor, setInstructor] = useState(course?.instructor || "");
  const [duration, setDuration] = useState(course?.duration || "");
  const [category, setCategory] = useState(course?.category || "");
  const [featured, setFeatured] = useState(course?.featured || false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(course?.image_url || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!title || !instructor || !category) return;
    setSaving(true);
    try {
      if (course) {
        await mutations.updateCourse.mutateAsync({
          id: course.id,
          title, description, instructor, duration, category, featured,
          imageFile: imageFile || undefined,
          image_url: course.image_url,
        });
      } else {
        await mutations.addCourse.mutateAsync({
          title, description, instructor, duration, category, featured,
          imageFile: imageFile || undefined,
        });
      }
      toast({ title: "Curso salvo com sucesso!" });
      onClose();
    } catch (err: any) {
      toast({ title: err?.message || "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <h2 className="text-lg font-bold mb-5">{course ? "Editar Curso" : "Novo Curso"}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" placeholder="Nome do curso" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Instrutor</label>
            <Input value={instructor} onChange={(e) => setInstructor(e.target.value)} className="rounded-xl" placeholder="Nome do instrutor" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Duração</label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} className="rounded-xl" placeholder="Ex: 12h" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Selecionar</option>
                {courseCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Descrição</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl min-h-[100px]" placeholder="Descrição do curso..." />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Imagem de capa</label>
            <div className="flex items-center gap-3">
              {imagePreview && <img src={imagePreview} alt="Capa" className="w-16 h-12 rounded-lg object-cover border border-border" />}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border hover:border-primary/40 transition-colors text-sm text-muted-foreground hover:text-foreground">
                <ImageIcon className="h-4 w-4" />
                {imagePreview ? "Trocar imagem" : "Upload de imagem"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" />
            <span className="text-sm">Curso em destaque</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancelar</Button>
            <Button variant="cosmic" className="flex-1 rounded-xl" onClick={handleSave} disabled={!title || !instructor || !category || saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseFormModal;
