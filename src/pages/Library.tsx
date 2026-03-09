import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Download, BookOpen, TrendingUp, Clock, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { bookCategories } from "@/data/booksData";
import { useBooks, Book } from "@/contexts/BooksContext";

const BookCard = ({ book, index, onOpen }: { book: Book; index: number; onOpen: (b: Book) => void }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => onOpen(book)}
    >
      <div className="h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 sm:hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={book.cover_url || "/placeholder.svg"}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
          {book.popular && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-accent-foreground">
                <TrendingUp className="h-3 w-3" />
                {t("library.popular")}
              </span>
            </div>
          )}
          {book.recent && (
            <div className={`absolute top-3 ${book.popular ? "left-[6.5rem]" : "left-3"}`}>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-primary-foreground">
                <Clock className="h-3 w-3" />
                {t("library.new")}
              </span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5">
            <Download className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{book.downloads.toLocaleString()}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-[14px] sm:text-[15px] font-semibold leading-snug mb-1 transition-colors group-hover:text-primary line-clamp-2">
            {t(book.titleKey)}
          </h3>
          <p className="text-[12px] sm:text-[13px] text-muted-foreground mb-2">
            {t(book.authorKey)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {book.pages} {t("library.pages")}
            </span>
            <span className="text-[11px] text-primary font-medium">
              {t(`library.cat.${book.category}`)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BookDetailModal = ({ book, onClose }: { book: Book; onClose: () => void }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-32 sm:w-40 shrink-0 mx-auto sm:mx-0">
            <img
              src={book.cover}
              alt={t(book.titleKey)}
              className="w-full rounded-lg shadow-xl"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold mb-1">{t(book.titleKey)}</h2>
            <p className="text-sm text-muted-foreground mb-3">{t(book.authorKey)}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
              <span className="text-xs bg-muted px-2.5 py-1 rounded-full">{t(`library.cat.${book.category}`)}</span>
              <span className="text-xs bg-muted px-2.5 py-1 rounded-full">{book.pages} {t("library.pages")}</span>
              <span className="text-xs bg-muted px-2.5 py-1 rounded-full flex items-center gap-1">
                <Download className="h-3 w-3" />
                {book.downloads.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mt-5 mb-6">
          {t(book.descriptionKey)}
        </p>

        <Button variant="gold" size="lg" className="w-full rounded-xl" asChild>
          <a href={book.pdfUrl} download>
            <Download className="mr-2 h-4 w-4" />
            {t("library.download")}
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

const Library = () => {
  const { t } = useLanguage();
  const { books, loading } = useBooks();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || book.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, books]);

  const popularBooks = books.filter((b) => b.popular);
  const recentBooks = books.filter((b) => b.recent);

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-16">
      {/* Header */}
      <section className="container mx-auto px-5 sm:px-6 mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">{t("library.badge")}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-3">{t("library.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t("library.desc")}
          </p>
        </motion.div>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-5 sm:px-6 mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("library.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-card border-border"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {bookCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {t(`library.cat.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Section */}
      {activeCategory === "all" && !search && (
        <section className="container mx-auto px-5 sm:px-6 mb-10">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h2 className="text-base sm:text-lg font-semibold">{t("library.popularSection")}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} onOpen={setSelectedBook} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Section */}
      {activeCategory === "all" && !search && (
        <section className="container mx-auto px-5 sm:px-6 mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold">{t("library.recentSection")}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {recentBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} onOpen={setSelectedBook} />
            ))}
          </div>
        </section>
      )}

      {/* All / Filtered */}
      {(activeCategory !== "all" || search) && (
        <section className="container mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold">
              {filtered.length} {t("library.results")}
            </h2>
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} onOpen={setSelectedBook} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{t("library.noResults")}</p>
            </div>
          )}
        </section>
      )}

      {/* Book Detail Modal */}
      {selectedBook && <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </main>
  );
};

export default Library;
