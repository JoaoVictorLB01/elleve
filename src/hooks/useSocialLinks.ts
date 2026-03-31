import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
  enabled: boolean;
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social_links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links" as any)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data as any[]) as SocialLink[];
    },
  });
}

export function useSocialLinksMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["social_links"] });

  const upsert = useMutation({
    mutationFn: async (link: { id: string; url: string; enabled: boolean }) => {
      const { error } = await supabase
        .from("social_links" as any)
        .update({ url: link.url, enabled: link.enabled, updated_at: new Date().toISOString() } as any)
        .eq("id", link.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const addLink = useMutation({
    mutationFn: async (link: { platform: string; url: string; sort_order: number }) => {
      const { error } = await supabase
        .from("social_links" as any)
        .insert(link as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("social_links" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { upsert, addLink, deleteLink };
}
