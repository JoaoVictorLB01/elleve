import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ElevveVideo {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  sort_order: number;
  created_at: string;
}

export function useElevveVideos(topicId?: string) {
  return useQuery({
    queryKey: ["elevve-videos", topicId],
    queryFn: async () => {
      let query = supabase.from("elevve_videos").select("*").order("sort_order");
      if (topicId) query = query.eq("topic_id", topicId);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as ElevveVideo[];
    },
    staleTime: 30_000,
  });
}

export function useElevveVideosMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["elevve-videos"] });

  const uploadFile = async (file: File, prefix: string): Promise<string> => {
    const name = `${prefix}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("course-media").upload(name, file);
    if (error) throw error;
    return supabase.storage.from("course-media").getPublicUrl(name).data.publicUrl;
  };

  const addVideo = useMutation({
    mutationFn: async (data: {
      topic_id: string; title: string; description: string;
      video_url: string; duration: string; sort_order: number;
      videoFile?: File; thumbnailFile?: File;
    }) => {
      let video_url = data.video_url || "";
      let thumbnail_url = "";
      if (data.videoFile) video_url = await uploadFile(data.videoFile, "elevve-videos");
      if (data.thumbnailFile) thumbnail_url = await uploadFile(data.thumbnailFile, "elevve-thumbs");
      const { error } = await supabase.from("elevve_videos").insert({
        topic_id: data.topic_id,
        title: data.title,
        description: data.description,
        video_url,
        thumbnail_url,
        duration: data.duration,
        sort_order: data.sort_order,
      } as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateVideo = useMutation({
    mutationFn: async (data: {
      id: string; title: string; description: string;
      video_url: string; duration: string; sort_order: number;
      videoFile?: File; thumbnailFile?: File; thumbnail_url?: string;
    }) => {
      let video_url = data.video_url || "";
      let thumbnail_url = data.thumbnail_url || "";
      if (data.videoFile) video_url = await uploadFile(data.videoFile, "elevve-videos");
      if (data.thumbnailFile) thumbnail_url = await uploadFile(data.thumbnailFile, "elevve-thumbs");
      const { error } = await supabase.from("elevve_videos").update({
        title: data.title,
        description: data.description,
        video_url,
        thumbnail_url,
        duration: data.duration,
        sort_order: data.sort_order,
      } as any).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteVideo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("elevve_videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { addVideo, updateVideo, deleteVideo, uploadFile };
}
