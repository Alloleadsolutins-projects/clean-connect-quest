import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Fetch DB services and build a map: normalized name -> image_url
// Allows admins to override homepage/services list images via /admin/services.
export function useServiceImageOverrides() {
  const [map, setMap] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("services").select("name, image_url").eq("is_active", true).then(({ data }) => {
      const m: Record<string, string> = {};
      (data || []).forEach((r: any) => {
        if (r.image_url && r.name) m[r.name.trim().toLowerCase()] = r.image_url;
      });
      setMap(m);
    });
  }, []);

  return (title: string, fallback: string) => map[title.trim().toLowerCase()] || fallback;
}
