import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  category: string;
  downloads: number;
  popular: boolean;
  recent: boolean;
  pdf_url: string | null;
  pages: number;
}

interface BooksContextType {
  books: Book[];
  loading: boolean;
  refetch: () => Promise<void>;
  addBook: (book: Omit<Book, "id" | "downloads">, coverFile?: File, pdfFile?: File) => Promise<void>;
  updateBook: (id: string, data: Partial<Book>, coverFile?: File, pdfFile?: File) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setBooks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const normalizeFileName = (fileName: string): string => {
    let normalized = fileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    normalized = normalized.replace(/\s+/g, "-").toLowerCase();
    normalized = normalized.replace(/[^a-z0-9.\-]/g, "");
    normalized = normalized.replace(/-+/g, "-").replace(/^-|-$/g, "");
    return normalized;
  };

  const uploadFile = async (bucket: string, file: File, path: string) => {
    const dir = path.substring(0, path.lastIndexOf("/") + 1);
    const normalizedName = normalizeFileName(file.name);
    const normalizedPath = `${dir}${normalizedName}`;
    console.log(`Uploading to bucket "${bucket}", path "${normalizedPath}", file size: ${file.size}`);
    const { data, error } = await supabase.storage.from(bucket).upload(normalizedPath, file, { upsert: true });
    if (error) {
      console.error(`Storage upload error for bucket "${bucket}":`, JSON.stringify(error));
      throw error;
    }
    // Store the storage path (not public URL) since buckets are private
    console.log(`Upload success, path: ${data.path}`);
    return data.path;
  };

  const addBook = async (book: Omit<Book, "id" | "downloads">, coverFile?: File, pdfFile?: File) => {
    const id = crypto.randomUUID();
    let cover_url = book.cover_url || "";
    let pdf_url = book.pdf_url || "#";

    if (coverFile) {
      cover_url = await uploadFile("book-covers", coverFile, `${id}/${coverFile.name}`);
    }
    if (pdfFile) {
      pdf_url = await uploadFile("book-pdfs", pdfFile, `${id}/${pdfFile.name}`);
    }

    const insertPayload = {
      id,
      title: book.title,
      author: book.author,
      description: book.description || "",
      cover_url,
      category: book.category,
      popular: book.popular ?? false,
      recent: book.recent ?? true,
      pdf_url,
      pages: book.pages || 0,
      downloads: 0,
    };
    console.log("Inserting book payload:", JSON.stringify(insertPayload));
    const { error } = await supabase.from("books").insert(insertPayload);
    if (error) {
      console.error("Error saving book:", JSON.stringify(error));
      throw new Error(error.message || error.code || "Erro desconhecido ao salvar livro");
    }
    await fetchBooks();
  };

  const updateBook = async (id: string, data: Partial<Book>, coverFile?: File, pdfFile?: File) => {
    if (coverFile) {
      data.cover_url = await uploadFile("book-covers", coverFile, `${id}/${coverFile.name}`);
    }
    if (pdfFile) {
      data.pdf_url = await uploadFile("book-pdfs", pdfFile, `${id}/${pdfFile.name}`);
    }

    const { error } = await supabase.from("books").update(data).eq("id", id);
    if (error) {
      console.error("Error updating book:", error);
      throw error;
    }
    await fetchBooks();
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) throw error;
    await fetchBooks();
  };

  return (
    <BooksContext.Provider value={{ books, loading, refetch: fetchBooks, addBook, updateBook, deleteBook }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
};
