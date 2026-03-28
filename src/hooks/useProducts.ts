import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: string;
  category: string;
  type: "product" | "service";
  popular: boolean;
  rating: number;
  duration: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at">;

const normalizeFileName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-\.]/g, "");

export const useProducts = (type?: "product" | "service") => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["products", type],
    queryFn: async () => {
      let q = supabase.from("products").select("*").order("sort_order").order("created_at", { ascending: false });
      if (type) q = q.eq("type", type);
      const { data, error } = await q;
      if (error) throw error;
      return data as Product[];
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${normalizeFileName(file.name)}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const create = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase.from("products").insert({
        name: product.name,
        description: product.description,
        image_url: product.image_url,
        price: product.price,
        category: product.category,
        type: product.type,
        popular: product.popular,
        rating: product.rating,
        duration: product.duration,
        sort_order: product.sort_order,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produto adicionado com sucesso!" });
    },
    onError: (e: Error) => {
      toast({ title: "Erro ao adicionar", description: e.message, variant: "destructive" });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...product }: Partial<ProductInsert> & { id: string }) => {
      const { data, error } = await supabase.from("products").update(product).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Alterações salvas!" });
    },
    onError: (e: Error) => {
      toast({ title: "Erro ao atualizar", description: e.message, variant: "destructive" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Item removido!" });
    },
    onError: (e: Error) => {
      toast({ title: "Erro ao remover", description: e.message, variant: "destructive" });
    },
  });

  return { ...query, products: query.data ?? [], uploadImage, create, update, remove };
};
