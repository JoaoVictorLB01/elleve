import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, ShoppingBag, Calendar, Sparkles, Flame, Coffee, Heart, Sun, Moon, Wind, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  rating: number;
  popular: boolean;
  category: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  duration: string;
  category: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Copo Energético Cristal",
    description: "Copo artesanal com cristais incrustados para energizar suas bebidas.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    price: "R$ 89,90",
    rating: 4.8,
    popular: true,
    category: "copos",
  },
  {
    id: "2",
    name: "Porta-Copos Mandala",
    description: "Conjunto de 4 porta-copos com mandalas sagradas em madeira natural.",
    image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=400&fit=crop",
    price: "R$ 59,90",
    rating: 4.6,
    popular: false,
    category: "decoracao",
  },
  {
    id: "3",
    name: "Kit Incensos Purificadores",
    description: "12 varetas de incenso natural com aromas de sândalo, lavanda e alecrim.",
    image: "https://images.unsplash.com/photo-1602178506542-3c0bc0be9a51?w=400&h=400&fit=crop",
    price: "R$ 34,90",
    rating: 4.9,
    popular: true,
    category: "incensos",
  },
  {
    id: "4",
    name: "Caneca Lunar",
    description: "Caneca de cerâmica com fases da lua pintadas à mão. Peça única.",
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=400&h=400&fit=crop",
    price: "R$ 72,90",
    rating: 4.7,
    popular: false,
    category: "canecas",
  },
  {
    id: "5",
    name: "Difusor de Óleos Essenciais",
    description: "Difusor ultrassônico com LED em formato de lótus. Ideal para meditação.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
    price: "R$ 149,90",
    rating: 4.9,
    popular: true,
    category: "bem-estar",
  },
  {
    id: "6",
    name: "Kit Pedras dos Chakras",
    description: "7 pedras naturais polidas, uma para cada chakra. Inclui bolsa de veludo.",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    price: "R$ 119,90",
    rating: 4.8,
    popular: true,
    category: "bem-estar",
  },
];

const services: Service[] = [
  {
    id: "1",
    name: "Yoga Restaurativa",
    description: "Prática suave focada em relaxamento profundo e restauração do equilíbrio corporal.",
    icon: <Sun className="h-6 w-6" />,
    price: "R$ 80/aula",
    duration: "60 min",
    category: "corpo",
  },
  {
    id: "2",
    name: "Alongamento Consciente",
    description: "Sessão guiada de alongamento com respiração e atenção plena ao corpo.",
    icon: <Wind className="h-6 w-6" />,
    price: "R$ 60/aula",
    duration: "45 min",
    category: "corpo",
  },
  {
    id: "3",
    name: "Meditação Guiada",
    description: "Sessões de meditação com visualização criativa e técnicas de respiração profunda.",
    icon: <Moon className="h-6 w-6" />,
    price: "R$ 70/sessão",
    duration: "40 min",
    category: "mente",
  },
  {
    id: "4",
    name: "Terapia com Cristais",
    description: "Sessão de cura energética usando cristais nos pontos dos chakras.",
    icon: <Sparkles className="h-6 w-6" />,
    price: "R$ 150/sessão",
    duration: "90 min",
    category: "energia",
  },
  {
    id: "5",
    name: "Reiki Usui",
    description: "Técnica japonesa de canalização de energia vital para harmonização e cura.",
    icon: <Heart className="h-6 w-6" />,
    price: "R$ 120/sessão",
    duration: "60 min",
    category: "energia",
  },
  {
    id: "6",
    name: "Aromaterapia",
    description: "Tratamento terapêutico com óleos essenciais para equilíbrio emocional e bem-estar.",
    icon: <Leaf className="h-6 w-6" />,
    price: "R$ 95/sessão",
    duration: "50 min",
    category: "energia",
  },
];

const productCategories = ["todos", "copos", "canecas", "incensos", "decoracao", "bem-estar"];
const serviceCategories = ["todos", "corpo", "mente", "energia"];

const categoryLabels: Record<string, Record<string, string>> = {
  pt: { todos: "Todos", copos: "Copos", canecas: "Canecas", incensos: "Incensos", decoracao: "Decoração", "bem-estar": "Bem-estar", corpo: "Corpo", mente: "Mente", energia: "Energia" },
  en: { todos: "All", copos: "Cups", canecas: "Mugs", incensos: "Incense", decoracao: "Decor", "bem-estar": "Wellness", corpo: "Body", mente: "Mind", energia: "Energy" },
  fr: { todos: "Tous", copos: "Verres", canecas: "Tasses", incensos: "Encens", decoracao: "Décoration", "bem-estar": "Bien-être", corpo: "Corps", mente: "Esprit", energia: "Énergie" },
  es: { todos: "Todos", copos: "Vasos", canecas: "Tazas", incensos: "Incienso", decoracao: "Decoración", "bem-estar": "Bienestar", corpo: "Cuerpo", mente: "Mente", energia: "Energía" },
};

const ProductsServices = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"products" | "services">("products");
  const [search, setSearch] = useState("");
  const [productCat, setProductCat] = useState("todos");
  const [serviceCat, setServiceCat] = useState("todos");

  const catLabel = (cat: string) => categoryLabels[language]?.[cat] || categoryLabels.pt[cat] || cat;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = productCat === "todos" || p.category === productCat;
      return matchSearch && matchCat;
    });
  }, [search, productCat]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = serviceCat === "todos" || s.category === serviceCat;
      return matchSearch && matchCat;
    });
  }, [search, serviceCat]);

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
      <section className="container mx-auto px-6 sm:px-6 pb-8 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <Badge variant="outline" className="mb-4 sm:mb-4 border-primary/30 text-primary bg-primary/5 px-3.5 py-1.5 text-xs sm:text-xs">
            <ShoppingBag className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 mr-1.5" />
            {t("ps.badge")}
          </Badge>
          <h1 className="text-[1.625rem] sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-3" style={{ lineHeight: 1.15 }}>
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
          className="flex justify-center mt-8 sm:mt-8"
        >
          <div className="inline-flex bg-muted rounded-xl p-1 gap-1 w-full max-w-xs sm:w-auto">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-2.5 rounded-lg text-sm sm:text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                activeTab === "products"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
              {t("ps.products")}
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-2.5 rounded-lg text-sm sm:text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                activeTab === "services"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
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
          className="mt-6 sm:mt-6 max-w-xl mx-auto"
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

          {/* Category Pills */}
          <div className="flex gap-2.5 mt-4 sm:mt-4 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory">
            {(activeTab === "products" ? productCategories : serviceCategories).map((cat) => (
              <button
                key={cat}
                onClick={() => activeTab === "products" ? setProductCat(cat) : setServiceCat(cat)}
                className={`shrink-0 snap-start px-4 py-2.5 sm:py-1.5 rounded-full text-xs sm:text-xs font-medium transition-all duration-200 active:scale-[0.95] ${
                  (activeTab === "products" ? productCat : serviceCat) === cat
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground border border-transparent hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
        {activeTab === "products" ? (
          <motion.div
            key="products"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
              >
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {product.popular && (
                    <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-accent text-accent-foreground text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5">
                      <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      {t("ps.popular")}
                    </Badge>
                  )}
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-[12px] sm:text-base leading-snug line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-0.5 text-accent shrink-0">
                      <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                      <span className="text-[10px] sm:text-xs font-medium tabular-nums">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-[11px] sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 hidden xs:block sm:block">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[13px] sm:text-lg font-bold text-foreground tabular-nums">{product.price}</span>
                    <Button size="sm" className="rounded-lg sm:rounded-xl text-[11px] sm:text-xs h-8 sm:h-9 px-2.5 sm:px-4 active:scale-[0.95]">
                      {t("ps.buyNow")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="services"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6"
          >
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group bg-card border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
              >
                <div className="flex items-start gap-3 sm:block">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 sm:mb-4 group-hover:bg-primary/15 transition-colors">
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-[14px] sm:text-lg mb-1">{service.name}</h3>
                    <p className="text-muted-foreground text-[12px] sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-5 mt-3 sm:mt-0">
                  <span className="bg-muted px-2 sm:px-2.5 py-1 rounded-lg font-medium">{service.price}</span>
                  <span className="bg-muted px-2 sm:px-2.5 py-1 rounded-lg font-medium">{service.duration}</span>
                </div>
                <Button variant="outline" className="w-full rounded-lg sm:rounded-xl h-10 text-[13px] sm:text-sm active:scale-[0.97]">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {t("ps.schedule")}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {((activeTab === "products" && filteredProducts.length === 0) ||
          (activeTab === "services" && filteredServices.length === 0)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <Search className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-[13px] sm:text-sm">{t("ps.noResults")}</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default ProductsServices;
