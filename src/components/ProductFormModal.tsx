import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, Loader2 } from "lucide-react";
import type { Product, ProductInsert } from "@/hooks/useProducts";

const PRODUCT_CATEGORIES = [
  { value: "copos", label: "Copos" },
  { value: "canecas", label: "Canecas" },
  { value: "incensos", label: "Incensos" },
  { value: "decoracao", label: "Decoração" },
  { value: "bem-estar", label: "Bem-estar" },
  { value: "outro", label: "Outro" },
];

const SERVICE_CATEGORIES = [
  { value: "corpo", label: "Corpo" },
  { value: "mente", label: "Mente" },
  { value: "energia", label: "Energia" },
  { value: "outro", label: "Outro" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (data: ProductInsert, imageFile?: File) => Promise<void>;
  activeTab: "product" | "service";
}

const ProductFormModal = ({ open, onOpenChange, product, onSave, activeTab }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
    price: "",
    category: "",
    popular: false,
    rating: 0,
    duration: "",
    sort_order: 0,
  });

  useEffect(() => {
    if (open) {
      if (product) {
        setForm({
          name: product.name,
          description: product.description,
          image_url: product.image_url,
          price: product.price,
          category: product.category,
          popular: product.popular,
          rating: product.rating,
          duration: product.duration,
          sort_order: product.sort_order,
        });
        setImagePreview(product.image_url);
      } else {
        setForm({ name: "", description: "", image_url: "", price: "", category: "", popular: false, rating: 0, duration: "", sort_order: 0 });
        setImagePreview("");
      }
      setImageFile(null);
    }
  }, [open, product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave(
        { ...form, type: activeTab },
        imageFile ?? undefined
      );
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const categories = activeTab === "product" ? PRODUCT_CATEGORIES : SERVICE_CATEGORIES;
  const isEdit = !!product;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-card border-border/60">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEdit ? "Editar" : "Adicionar"} {activeTab === "product" ? "Produto" : "Serviço"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Image upload */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Imagem</Label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-36 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-xs text-muted-foreground">Clique para enviar imagem</span>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Name */}
          <div>
            <Label className="text-sm text-muted-foreground">Nome *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nome do item"
              className="mt-1 bg-muted/30 border-border/60"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm text-muted-foreground">Descrição</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descrição breve"
              className="mt-1 bg-muted/30 border-border/60 min-h-[80px]"
            />
          </div>

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-muted-foreground">Preço</Label>
              <Input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="R$ 0,00"
                className="mt-1 bg-muted/30 border-border/60"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="mt-1 bg-muted/30 border-border/60">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration (services only) */}
          {activeTab === "service" && (
            <div>
              <Label className="text-sm text-muted-foreground">Duração</Label>
              <Input
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="Ex: 60 min"
                className="mt-1 bg-muted/30 border-border/60"
              />
            </div>
          )}

          {/* Popular toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Destaque (popular)</Label>
            <Switch checked={form.popular} onCheckedChange={(v) => setForm((f) => ({ ...f, popular: v }))} />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full rounded-xl h-11" disabled={saving || !form.name.trim()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? "Salvar alterações" : "Adicionar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
