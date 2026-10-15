import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Prix modifiables depuis /admin/pricing : clé = `${service_slug}::${item_slug}`
export function usePricingOverrides(serviceSlug?: string) {
  const [map, setMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let q = supabase.from("pricing_overrides").select("service_slug, item_slug, price");
    if (serviceSlug) q = q.eq("service_slug", serviceSlug);
    q.then(({ data }) => {
      const m: Record<string, number> = {};
      (data || []).forEach((r: any) => {
        m[`${r.service_slug}::${r.item_slug}`] = Number(r.price);
      });
      setMap(m);
    });
  }, [serviceSlug]);

  return (svc: string, item: string, base: number) => {
    const v = map[`${svc}::${item}`];
    return typeof v === "number" && !isNaN(v) ? v : base;
  };
}
