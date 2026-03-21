import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useBookFavorites(userId: string | undefined) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }
    const fetch = async () => {
      const { data } = await supabase
        .from("book_favorites")
        .select("book_id")
        .eq("user_id", userId);
      setFavoriteIds(new Set((data || []).map((d) => d.book_id)));
      setLoading(false);
    };
    fetch();
  }, [userId]);

  const toggle = useCallback(
    async (bookId: string) => {
      if (!userId) return false;
      const isFav = favoriteIds.has(bookId);
      if (isFav) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(bookId);
          return next;
        });
        await supabase
          .from("book_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("book_id", bookId);
      } else {
        setFavoriteIds((prev) => new Set(prev).add(bookId));
        await supabase
          .from("book_favorites")
          .insert({ user_id: userId, book_id: bookId });
      }
      return !isFav;
    },
    [userId, favoriteIds]
  );

  return { favoriteIds, toggle, loading };
}
