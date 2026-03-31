import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Users, FileVideo, Plus, Edit, Trash2, BarChart3, Search,
  Library, X, Upload, FileText, Download, Image as ImageIcon, Settings, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookCategories } from "@/data/booksData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useBooks, Book } from "@/contexts/BooksContext";
import { useCourses, useAllDbData, useCoursesMutations, DbCourse } from "@/hooks/useCourses";
import CourseFormModal from "@/components/CourseFormModal";
import CourseManagerModal from "@/components/CourseManagerModal";
import SocialLinksManager from "@/components/SocialLinksManager";

type Tab = "cursos" | "alunos" | "estatisticas" | "biblioteca" | "social";

interface BookFormData {
  title: string;
  author: string;
  description: string;
  category: string;
  pages: number;
  popular: boolean;
  recent: boolean;
}

const emptyForm: BookFormData = {
  title: "",
  author: "",
  description: "",
  category: "",
  pages: 0,
  popular: false,
  recent: true,
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("cursos");
  const { t } = useLanguage();
  const { toast } = useToast();

  // Books state
  const { books: libraryBooks, addBook, updateBook, deleteBook: deleteBookFromDB, loading } = useBooks();
  const [bookSearch, setBookSearch] = useState("");
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookFormData>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Courses state
  const { data: dbData } = useAllDbData();
  const { data: appCourses } = useCourses();
  const courseMutations = useCoursesMutations();
  const [courseSearch, setCourseSearch] = useState("");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<DbCourse | null>(null);
  const [managingCourseId, setManagingCourseId] = useState<string | null>(null);
  const [deleteCourseConfirm, setDeleteCourseConfirm] = useState<string | null>(null);

  const dbCourses = dbData?.courses || [];
  const displayCourses = useMemo(() => {
    const list = dbCourses.length > 0 ? dbCourses : [];
    if (!courseSearch) return list;
    const q = courseSearch.toLowerCase();
    return list.filter((c) => c.title.toLowerCase().includes(q));
  }, [dbCourses, courseSearch]);

  // Use app courses (with mock fallback) for display when no DB courses
  const appCoursesList = appCourses || [];

  const filteredBooks = useMemo(() => {
    if (!bookSearch) return libraryBooks;
    const q = bookSearch.toLowerCase();
    return libraryBooks.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }, [bookSearch, libraryBooks]);

  // Book handlers
  const openAddForm = () => {
    setEditingBook(null);
    setFormData(emptyForm);
    setCoverFile(null);
    setCoverPreview("");
    setPdfFile(null);
    setShowBookForm(true);
  };

  const openEditForm = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title, author: book.author, description: book.description || "",
      category: book.category, pages: book.pages, popular: book.popular, recent: book.recent,
    });
    setCoverFile(null);
    setCoverPreview(book.cover_url || "");
    setPdfFile(null);
    setShowBookForm(true);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  };

  const handleSaveBook = async () => {
    if (!formData.title || !formData.author || !formData.category) return;
    setSaving(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, {
          title: formData.title, author: formData.author, description: formData.description,
          category: formData.category, pages: formData.pages, popular: formData.popular, recent: formData.recent,
        }, coverFile || undefined, pdfFile || undefined);
      } else {
        await addBook({
          title: formData.title, author: formData.author, description: formData.description,
          cover_url: "", category: formData.category, popular: formData.popular,
          recent: formData.recent, pdf_url: "#", pages: formData.pages,
        }, coverFile || undefined, pdfFile || undefined);
      }
      setShowBookForm(false);
      setEditingBook(null);
      toast({ title: t("admin.bookSaved") });
    } catch (err: any) {
      toast({ title: err?.message || "Erro ao salvar livro", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBookFromDB(id);
      setDeleteConfirm(null);
      toast({ title: t("admin.bookDeleted") });
    } catch {
      toast({ title: "Erro ao excluir livro", variant: "destructive" });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await courseMutations.deleteCourse.mutateAsync(id);
      setDeleteCourseConfirm(null);
      toast({ title: "Curso removido com sucesso!" });
    } catch {
      toast({ title: "Erro ao excluir curso", variant: "destructive" });
    }
  };

  const tabs = [
    { id: "cursos" as Tab, label: t("admin.courses"), icon: BookOpen },
    { id: "biblioteca" as Tab, label: t("admin.library"), icon: Library },
    { id: "alunos" as Tab, label: t("admin.students"), icon: Users },
    { id: "estatisticas" as Tab, label: t("admin.stats"), icon: BarChart3 },
    { id: "social" as Tab, label: "Redes Sociais", icon: Share2 },
  ];

  const categoryOptions = bookCategories.filter((c) => c !== "all");

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-1.5 sm:mb-2 block">
            {t("admin.label")}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">{t("admin.title")}</h1>
        </motion.div>

        <div className="flex gap-1 mb-6 sm:mb-8 p-1 rounded-xl bg-muted/50 border border-border w-full sm:w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-initial whitespace-nowrap ${
                activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CURSOS TAB */}
        {activeTab === "cursos" && (
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.searchCourses")}
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="pl-10 h-10 sm:h-11 rounded-xl text-sm"
                />
              </div>
              <Button variant="cosmic" size="sm" className="w-full sm:w-auto" onClick={() => { setEditingCourse(null); setShowCourseForm(true); }}>
                <Plus className="mr-1.5 h-4 w-4" />
                {t("admin.newCourse")}
              </Button>
            </div>

            {dbCourses.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">Nenhum curso no banco de dados.</p>
                <p className="text-xs text-muted-foreground/70 mb-4">Clique em "Novo Curso" para criar seu primeiro curso.</p>
                <Button variant="cosmic" size="sm" onClick={() => { setEditingCourse(null); setShowCourseForm(true); }}>
                  <Plus className="mr-1.5 h-4 w-4" /> Criar Primeiro Curso
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {displayCourses.map((course, i) => {
                const courseModules = (dbData?.modules || []).filter((m) => m.course_id === course.id);
                const courseLessons = (dbData?.lessons || []).filter((l) => l.course_id === course.id);
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-border rounded-xl sm:rounded-2xl bg-card p-3.5 sm:p-5 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <img
                        src={course.image_url || "/placeholder.svg"}
                        alt={course.title}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-xs sm:text-sm truncate">{course.title}</h3>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                              {course.instructor} • {course.duration}
                            </p>
                          </div>
                          <div className="flex gap-1.5 sm:gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl"
                              onClick={() => setManagingCourseId(course.id)}
                              title="Gerenciar módulos e aulas"
                            >
                              <Settings className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl"
                              onClick={() => { setEditingCourse(course); setShowCourseForm(true); }}
                            >
                              <Edit className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl text-destructive hover:text-destructive"
                              onClick={() => setDeleteCourseConfirm(course.id)}
                            >
                              <Trash2 className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
                          <span>{courseModules.length} {t("admin.modules")}</span>
                          <span>•</span>
                          <span>{courseLessons.length} {t("admin.lessons")}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* BIBLIOTECA TAB */}
        {activeTab === "biblioteca" && (
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t("admin.searchBooks")} value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} className="pl-10 h-10 sm:h-11 rounded-xl text-sm" />
              </div>
              <Button variant="cosmic" size="sm" className="w-full sm:w-auto" onClick={openAddForm}>
                <Plus className="mr-1.5 h-4 w-4" /> {t("admin.newBook")}
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-16"><p className="text-muted-foreground">Carregando...</p></div>
            ) : (
              <>
                <div className="sm:hidden space-y-3">
                  {filteredBooks.map((book, i) => (
                    <motion.div key={book.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="border border-border rounded-xl bg-card p-3.5">
                      <div className="flex gap-3">
                        <img src={book.cover_url || "/placeholder.svg"} alt={book.title} className="w-14 h-20 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{book.author}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                            <span>{t(`library.cat.${book.category}`)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><Download className="h-2.5 w-2.5" />{book.downloads}</span>
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5 rounded-lg" onClick={() => openEditForm(book)}>
                              <Edit className="h-3 w-3 mr-1" />{t("admin.editBook").split(" ")[0]}
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5 rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(book.id)}>
                              <Trash2 className="h-3 w-3 mr-1" />{t("admin.delete")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="hidden sm:block border border-border rounded-2xl bg-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">{t("admin.bookCover")}</th>
                        <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">{t("admin.bookTitle")}</th>
                        <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">{t("admin.author")}</th>
                        <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">{t("admin.category")}</th>
                        <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">{t("admin.downloads")}</th>
                        <th className="text-right p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">{t("admin.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book, i) => (
                        <motion.tr key={book.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="p-4"><img src={book.cover_url || "/placeholder.svg"} alt={book.title} className="w-10 h-14 rounded-md object-cover" /></td>
                          <td className="p-4 font-medium">{book.title}</td>
                          <td className="p-4 text-muted-foreground hidden md:table-cell">{book.author}</td>
                          <td className="p-4 hidden lg:table-cell"><span className="text-xs bg-muted px-2.5 py-1 rounded-full">{t(`library.cat.${book.category}`)}</span></td>
                          <td className="p-4 text-muted-foreground hidden lg:table-cell"><span className="flex items-center gap-1"><Download className="h-3 w-3" />{book.downloads.toLocaleString()}</span></td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl" onClick={() => openEditForm(book)}><Edit className="h-3.5 w-3.5" /></Button>
                              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(book.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredBooks.length === 0 && (
                  <div className="text-center py-16">
                    <Library className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">{t("library.noResults")}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ALUNOS TAB */}
        {activeTab === "alunos" && (
          <div>
            <div className="relative w-full sm:max-w-sm mb-5 sm:mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("admin.searchStudents")} className="pl-10 h-10 sm:h-11 rounded-xl text-sm" />
            </div>
            <div className="sm:hidden space-y-3">
              {["Ana Silva", "Carlos Santos", "Maria Luz", "Pedro Estrela"].map((name, i) => (
                <div key={name} className="border border-border rounded-xl bg-card p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{name}</span>
                    <span className="text-xs text-muted-foreground">{i + 1} {t("admin.courseCount")}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">{name.toLowerCase().replace(" ", ".")}@email.com</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-cosmic" style={{ width: `${[45, 78, 20, 92][i]}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">{[45, 78, 20, 92][i]}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block border border-border rounded-2xl bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">{t("admin.student")}</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">{t("admin.email")}</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">{t("admin.courses")}</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">{t("dashboard.progress")}</th>
                  </tr>
                </thead>
                <tbody>
                  {["Ana Silva", "Carlos Santos", "Maria Luz", "Pedro Estrela"].map((name, i) => (
                    <tr key={name} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium">{name}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{name.toLowerCase().replace(" ", ".")}@email.com</td>
                      <td className="p-4">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-cosmic" style={{ width: `${[45, 78, 20, 92][i]}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{[45, 78, 20, 92][i]}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ESTATÍSTICAS TAB */}
        {activeTab === "estatisticas" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: t("admin.totalStudents"), value: "1.216", icon: Users, change: "+12%" },
              { label: t("admin.activeCourses"), value: String(dbCourses.length || 3), icon: BookOpen, change: "+1" },
              { label: t("admin.completedLessons"), value: "4.523", icon: FileVideo, change: "+340" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="border border-border rounded-xl sm:rounded-2xl bg-card p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <stat.icon className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                  <span className="text-[10px] sm:text-xs font-medium text-accent">{stat.change}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-display mb-0.5 sm:mb-1">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseFormModal
          course={editingCourse}
          onClose={() => { setShowCourseForm(false); setEditingCourse(null); }}
        />
      )}

      {/* Course Manager Modal */}
      {managingCourseId && (
        <CourseManagerModal
          courseId={managingCourseId}
          onClose={() => setManagingCourseId(null)}
        />
      )}

      {/* Book Form Modal */}
      {showBookForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowBookForm(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowBookForm(false)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-5">{editingBook ? t("admin.editBook") : t("admin.addBook")}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("admin.bookTitle")}</label>
                <Input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("admin.bookAuthor")}</label>
                <Input value={formData.author} onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))} className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("admin.bookCategory")}</label>
                <select value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">{t("admin.selectCategory")}</option>
                  {categoryOptions.map((cat) => (<option key={cat} value={cat}>{t(`library.cat.${cat}`)}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("admin.bookPages")}</label>
                <Input type="number" value={formData.pages || ""} onChange={(e) => setFormData((p) => ({ ...p, pages: parseInt(e.target.value) || 0 }))} className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("admin.bookDescription")}</label>
                <Textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="rounded-xl min-h-[100px]" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("admin.bookCover")}</label>
                <div className="flex items-center gap-3">
                  {coverPreview && <img src={coverPreview} alt="Cover" className="w-12 h-16 rounded-lg object-cover border border-border" />}
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border hover:border-primary/40 transition-colors text-sm text-muted-foreground hover:text-foreground">
                    <ImageIcon className="h-4 w-4" />
                    {coverPreview ? t("admin.changeCover") : t("admin.uploadCover")}
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("admin.bookPdf")}</label>
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border hover:border-primary/40 transition-colors text-sm text-muted-foreground hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  {pdfFile ? pdfFile.name : t("admin.uploadPdf")}
                  <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowBookForm(false)}>{t("admin.cancel")}</Button>
                <Button variant="cosmic" className="flex-1 rounded-xl" onClick={handleSaveBook} disabled={!formData.title || !formData.author || !formData.category || saving}>
                  {saving ? "Salvando..." : t("admin.save")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Book Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{t("admin.deleteConfirm")}</h3>
            <p className="text-sm text-muted-foreground mb-5">{t("admin.deleteConfirmDesc")}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteConfirm(null)}>{t("admin.cancel")}</Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => handleDeleteBook(deleteConfirm)}>{t("admin.delete")}</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Course Confirmation */}
      {deleteCourseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDeleteCourseConfirm(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Confirmar exclusão</h3>
            <p className="text-sm text-muted-foreground mb-5">Tem certeza que deseja remover este curso? Todos os módulos e aulas serão excluídos.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteCourseConfirm(null)}>Cancelar</Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => handleDeleteCourse(deleteCourseConfirm)}>Remover</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
