import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbBook {
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
  created_at: string;
  updated_at: string;
}

export function useBooks() {
  const [books, setBooks] = useState<DbBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBooks(data);
      }
      setLoading(false);
    };

    fetchBooks();

    // Realtime subscription
    const channel = supabase
      .channel("books-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "books" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBooks((prev) => [payload.new as DbBook, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setBooks((prev) =>
              prev.map((b) =>
                b.id === (payload.new as DbBook).id ? (payload.new as DbBook) : b
              )
            );
          } else if (payload.eventType === "DELETE") {
            setBooks((prev) =>
              prev.filter((b) => b.id !== (payload.old as DbBook).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addBook = async (book: Omit<DbBook, "id" | "created_at" | "updated_at" | "downloads">) => {
    const { error } = await supabase.from("books").insert(book);
    return !error;
  };

  const updateBook = async (id: string, updates: Partial<DbBook>) => {
    const { error } = await supabase.from("books").update(updates).eq("id", id);
    return !error;
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    return !error;
  };

  return { books, loading, addBook, updateBook, deleteBook };
}
