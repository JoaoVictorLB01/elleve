import { supabase } from "@/integrations/supabase/client";

/**
 * Get a signed URL for a file in a private storage bucket.
 * Calls the get-signed-url edge function which validates auth.
 */
export async function getSignedFileUrl(bucket: string, path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("get-signed-url", {
      body: { bucket, path },
    });
    if (error || !data?.signedUrl) {
      console.error("Failed to get signed URL:", error);
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.error("Error getting signed URL:", err);
    return null;
  }
}

/**
 * Extract the storage path from a full Supabase storage URL.
 * e.g. "https://xxx.supabase.co/storage/v1/object/public/book-pdfs/abc/file.pdf"
 *   → "abc/file.pdf"
 */
export function extractStoragePath(fullUrl: string, bucket: string): string | null {
  try {
    // Match patterns like /storage/v1/object/public/bucket-name/path or /storage/v1/object/sign/bucket-name/path
    const patterns = [
      `/storage/v1/object/public/${bucket}/`,
      `/storage/v1/object/sign/${bucket}/`,
      `/storage/v1/object/${bucket}/`,
    ];
    for (const pattern of patterns) {
      const idx = fullUrl.indexOf(pattern);
      if (idx !== -1) {
        const path = fullUrl.substring(idx + pattern.length);
        // Remove query params
        return path.split("?")[0];
      }
    }
    return null;
  } catch {
    return null;
  }
}
