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

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const catLabel = (cat: string) => categoryLabels[language]?.[cat] || categoryLabels.pt[cat] || cat;

  const filtered = useMemo(() => {
    const selectedCat = activeTab === "product" ? productCat : serviceCat;
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
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

  const openAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await remove.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <div className="min-h-screen bg-background pt-[80px] sm:pt-24">
      {/* Header */}
      <section className="container mx-auto px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 px-3.5 py-1.5 text-xs">
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            {t("ps.badge")}
          </Badge>
          <h1 className="text-[1.625rem] sm:text-4xl lg:text-5xl font-bold text-foreground mb-3" style={{ lineHeight: 1.15 }}>
            {t("ps.title")}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed px-2 sm:px-0">
            {t("ps.desc")}
          </p>
        </motion.div>

        {/* Tab Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mt-8"
        >
          <div className="inline-flex bg-muted rounded-xl p-1 gap-1 w-full max-w-xs sm:w-auto">
            <button
              onClick={() => setActiveTab("product")}
              className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                activeTab === "product" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
              {t("ps.products")}
            </button>
            <button
              onClick={() => setActiveTab("service")}
              className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 max-w-xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("ps.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border/60 h-12 sm:h-11 rounded-xl text-base sm:text-sm"
            />
          </div>

          <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory">
            {(activeTab === "product" ? productCategories : serviceCategories).map((cat) => (
              <button
                key={cat}
                onClick={() => activeTab === "product" ? setProductCat(cat) : setServiceCat(cat)}
                className={`shrink-0 snap-start px-5 py-3 sm:py-2 rounded-full text-sm sm:text-xs font-medium transition-all duration-200 active:scale-[0.93] min-h-[44px] ${
                  (activeTab === "product" ? productCat : serviceCat) === cat
                    ? "bg-primary/15 text-primary border border-primary/30"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <Button onClick={openAdd} className="rounded-xl gap-2">
              <Plus className="h-4 w-4" />
              Adicionar {activeTab === "product" ? "Produto" : "Serviço"}
            </Button>
          </motion.div>
        )}
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">{t("ps.noResults")}</p>
          </motion.div>
        ) : activeTab === "product" ? (
          <motion.div key="products" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filtered.map((product) => (
              <motion.div key={product.id} variants={itemVariants} className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] relative">
                {/* Admin controls */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/40 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/40 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {product.popular && (
                    <Badge className="absolute top-2.5 left-2.5 bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5">
                      <Flame className="h-3 w-3 mr-0.5" />
                      {t("ps.popular")}
                    </Badge>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug line-clamp-2">{product.name}</h3>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-0.5 text-accent shrink-0">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-medium tabular-nums">{product.rating}</span>
                      </div>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                  )}
                  {product.price && (
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm sm:text-lg font-bold text-foreground tabular-nums">{product.price}</span>
                      <Button size="sm" className="rounded-xl text-xs h-11 sm:h-9 px-4 active:scale-[0.93]">
                        {t("ps.buyNow")}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="services" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filtered.map((service) => (
              <motion.div key={service.id} variants={itemVariants} className="group bg-card border border-border/50 rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] relative">
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-10 flex gap-1">
                    <button onClick={() => openEdit(service)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/40 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(service)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/40 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-start gap-4 sm:block">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 sm:mb-4 group-hover:bg-primary/15 transition-colors">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1.5">{service.name}</h3>
                    {service.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{service.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground mb-4 mt-4 sm:mt-0">
                  {service.price && <span className="bg-muted px-3 py-1.5 rounded-lg font-medium">{service.price}</span>}
                  {service.duration && <span className="bg-muted px-3 py-1.5 rounded-lg font-medium">{service.duration}</span>}
                </div>
                <Button variant="outline" className="w-full rounded-xl h-11 sm:h-10 text-sm active:scale-[0.97]">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {t("ps.schedule")}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Form Modal */}
      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSave={handleSave}
        activeTab={activeTab}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card border-border/60">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja remover este item?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.name}" será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsServices;
