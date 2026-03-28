import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, ShoppingBag, Calendar, Sparkles, Flame, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts, type Product, type ProductInsert } from "@/hooks/useProducts";
import ProductFormModal from "@/components/ProductFormModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const productCategories = ["todos", "copos", "canecas", "incensos", "decoracao", "bem-estar", "outro"];
const serviceCategories = ["todos", "corpo", "mente", "energia", "outro"];

const categoryLabels: Record<string, Record<string, string>> = {
  pt: { todos: "Todos", copos: "Copos", canecas: "Canecas", incensos: "Incensos", decoracao: "Decoração", "bem-estar": "Bem-estar", corpo: "Corpo", mente: "Mente", energia: "Energia", outro: "Outro" },
  en: { todos: "All", copos: "Cups", canecas: "Mugs", incensos: "Incense", decoracao: "Decor", "bem-estar": "Wellness", corpo: "Body", mente: "Mind", energia: "Energy", outro: "Other" },
  fr: { todos: "Tous", copos: "Verres", canecas: "Tasses", incensos: "Encens", decoracao: "Décoration", "bem-estar": "Bien-être", corpo: "Corps", mente: "Esprit", energia: "Énergie", outro: "Autre" },
  es: { todos: "Todos", copos: "Vasos", canecas: "Tazas", incensos: "Incienso", decoracao: "Decoración", "bem-estar": "Bienestar", corpo: "Cuerpo", mente: "Mente", energia: "Energía", outro: "Otro" },
};

const ProductsServices = () => {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"product" | "service">("product");
  const [search, setSearch] = useState("");
  const [productCat, setProductCat] = useState("todos");
  const [serviceCat, setServiceCat] = useState("todos");

  const { products, uploadImage, create, update, remove, isLoading } = useProducts(activeTab);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const catLabel = (cat: string) => categoryLabels[language]?.[cat] || categoryLabels.pt[cat] || cat;

  const filtered = useMemo(() => {
    const selectedCat = activeTab === "product" ? productCat : serviceCat;
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "todos" || p.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [products, search, productCat, serviceCat, activeTab]);

  const handleSave = async (data: ProductInsert, imageFile?: File) => {
    let image_url = data.image_url;
    if (imageFile) {
      image_url = await uploadImage(imageFile);
    }
    if (editingProduct) {
      await update.mutateAsync({ id: editingProduct.id, ...data, image_url });
    } else {
      await create.mutateAsync({ ...data, image_url });
    }
  };

  const openAdd = () => { setEditingProduct(null); setFormOpen(true); };
  const openEdit = (product: Product) => { setEditingProduct(product); setFormOpen(true); };
  const confirmDelete = async () => {
    if (deleteTarget) { await remove.mutateAsync(deleteTarget.id); setDeleteTarget(null); }
  };

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  return (
    <div className="min-h-screen bg-background pt-[80px] sm:pt-24 pb-24 md:pb-16">
      {/* Header */}
      <section className="container mx-auto px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <Badge variant="outline" className="mb-3.5 border-primary/25 text-primary bg-primary/5 px-3 py-1.5 text-xs">
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            {t("ps.badge")}
          </Badge>
          <h1 className="text-[1.5rem] sm:text-3xl lg:text-4xl font-bold text-foreground mb-2.5" style={{ lineHeight: 1.15 }}>
            {t("ps.title")}
          </h1>
          <p className="text-muted-foreground/80 text-sm leading-relaxed px-2 sm:px-0">
            {t("ps.desc")}
          </p>
        </motion.div>

        {/* Tab Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mt-6"
        >
          <div className="inline-flex bg-muted rounded-xl p-1 gap-1 w-full max-w-xs sm:w-auto">
            <button
              onClick={() => setActiveTab("product")}
              className={`flex-1 sm:flex-none px-4 sm:px-7 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                activeTab === "product" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
              {t("ps.products")}
            </button>
            <button
              onClick={() => setActiveTab("service")}
              className={`flex-1 sm:flex-none px-4 sm:px-7 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                activeTab === "service" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
              {t("ps.services")}
            </button>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mt-5 max-w-xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("ps.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border/50 h-11 rounded-xl text-sm"
            />
          </div>

          <div className="flex gap-2 mt-3.5 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory">
            {(activeTab === "product" ? productCategories : serviceCategories).map((cat) => (
              <button
                key={cat}
                onClick={() => activeTab === "product" ? setProductCat(cat) : setServiceCat(cat)}
                className={`shrink-0 snap-start px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-[0.93] min-h-[40px] ${
                  (activeTab === "product" ? productCat : serviceCat) === cat
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "bg-muted text-muted-foreground border border-transparent hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Admin: Add button */}
        {isAdmin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-5">
            <Button onClick={openAdd} className="rounded-xl gap-2">
              <Plus className="h-4 w-4" />
              Adicionar {activeTab === "product" ? "Produto" : "Serviço"}
            </Button>
          </motion.div>
        )}
      </section>

      {/* Content */}
      <section className="container mx-auto px-6">
        {isLoading ? (
          <div className="flex justify-center py-14">
            <div className="animate-spin h-7 w-7 border-3 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-14">
            <Search className="h-9 w-9 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground/70 text-sm">{t("ps.noResults")}</p>
          </motion.div>
        ) : activeTab === "product" ? (
          <motion.div key="products" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {filtered.map((product) => (
              <motion.div key={product.id} variants={itemVariants} className="group bg-card/60 border border-border/40 rounded-2xl overflow-hidden hover:border-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] relative">
                {isAdmin && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/30 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/30 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-9 w-9 text-muted-foreground/25" />
                    </div>
                  )}
                  {product.popular && (
                    <Badge className="absolute top-2.5 left-2.5 bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5">
                      <Flame className="h-3 w-3 mr-0.5" />
                      {t("ps.popular")}
                    </Badge>
                  )}
                </div>
                <div className="p-3.5 sm:p-4">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{product.name}</h3>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-0.5 text-accent shrink-0">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-medium tabular-nums">{product.rating}</span>
                      </div>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-muted-foreground/70 text-xs leading-relaxed mb-3 line-clamp-2">{product.description}</p>
                  )}
                  {product.price && (
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm sm:text-base font-bold text-foreground tabular-nums">{product.price}</span>
                      <Button size="sm" className="rounded-xl text-xs h-9 px-3.5 active:scale-[0.93]">
                        {t("ps.buyNow")}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="services" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {filtered.map((service) => (
              <motion.div key={service.id} variants={itemVariants} className="group bg-card/60 border border-border/40 rounded-2xl p-4.5 sm:p-5 hover:border-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] relative">
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-10 flex gap-1">
                    <button onClick={() => openEdit(service)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/30 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(service)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/30 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-start gap-3.5 sm:block">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 sm:mb-3.5 group-hover:bg-primary/15 transition-colors">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-base mb-1">{service.name}</h3>
                    {service.description && (
                      <p className="text-muted-foreground/70 text-sm leading-relaxed mb-3.5 line-clamp-2">{service.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mb-3.5 mt-3.5 sm:mt-0">
                  {service.price && <span className="bg-muted px-2.5 py-1 rounded-lg font-medium">{service.price}</span>}
                  {service.duration && <span className="bg-muted px-2.5 py-1 rounded-lg font-medium">{service.duration}</span>}
                </div>
                <Button variant="outline" className="w-full rounded-xl h-10 text-sm active:scale-[0.97]">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {t("ps.schedule")}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <ProductFormModal open={formOpen} onOpenChange={setFormOpen} product={editingProduct} onSave={handleSave} activeTab={activeTab} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja remover este item?</AlertDialogTitle>
            <AlertDialogDescription>"{deleteTarget?.name}" será removido permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsServices;
