import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { serviceWizards } from "@/data/serviceWizards";
import { allServices } from "@/data/services";

type Row = { service_slug: string; item_slug: string; label: string; base: number };

const PricingPage = () => {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [dbPacks, setDbPacks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: po }, { data: packs }] = await Promise.all([
      supabase.from("pricing_overrides").select("service_slug, item_slug, price"),
      supabase.from("packs").select("*").order("sort_order"),
    ]);
    const m: Record<string, string> = {};
    (po || []).forEach((r: any) => { m[`${r.service_slug}::${r.item_slug}`] = String(Number(r.price)); });
    setOverrides(m);
    setDbPacks(packs || []);
  };
  useEffect(() => { load(); }, []);

  const groups = useMemo(() => {
    return Object.entries(serviceWizards).map(([slug, cfg]) => {
      const svc = allServices.find((s) => s.slug === slug);
      const rows: Row[] = cfg.formules.map((f) => ({ service_slug: slug, item_slug: f.slug, label: f.name, base: f.price }));
      return { slug, title: svc?.title || slug, goodLabel: cfg.goodLabel, types: cfg.step1.options, rows };
    });
  }, []);

  const key = (s: string, i: string) => `${s}::${i}`;
  const set = (k: string, v: string) => setOverrides((o) => ({ ...o, [k]: v }));

  const saveAll = async () => {
    setSaving(true);
    const payload = Object.entries(overrides)
      .filter(([, v]) => v !== "" && !isNaN(parseFloat(v)))
      .map(([k, v]) => {
        const [service_slug, item_slug] = k.split("::");
        return { service_slug, item_slug, price: parseFloat(v) };
      });
    const { error } = await supabase.from("pricing_overrides").upsert(payload, { onConflict: "service_slug,item_slug" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Tarifs enregistrés");
    load();
  };

  const savePack = async (p: any, price: string) => {
    const { error } = await supabase.from("packs").update({ price: parseFloat(price) || 0 }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(`Pack ${p.name} mis à jour`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tarifs</h1>
          <p className="text-muted-foreground">Modifiez les prix des formules de chaque service et des packs</p>
        </div>
        <Button onClick={saveAll} disabled={saving}><Save className="h-4 w-4 mr-1" /> {saving ? "…" : "Enregistrer"}</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Packs ({dbPacks.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {dbPacks.length === 0 && <p className="text-muted-foreground text-sm">Aucun pack en base.</p>}
          {dbPacks.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border">
              <span className="font-medium">{p.name}</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-28"
                  defaultValue={String(Number(p.price))}
                  onBlur={(e) => e.target.value !== String(Number(p.price)) && savePack(p, e.target.value)}
                />
                <span className="text-sm text-muted-foreground">DH</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {groups.map((g) => (
        <Card key={g.slug}>
          <CardHeader>
            <CardTitle className="text-base">{g.title}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {g.goodLabel} : {g.types.map((t) => t.label).join(" · ")}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {g.rows.map((r) => {
              const k = key(r.service_slug, r.item_slug);
              return (
                <div key={k} className="flex items-center justify-between gap-3 p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{r.label}</p>
                    <p className="text-xs text-muted-foreground">Prix d'origine : {r.base} DH</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-28"
                      placeholder={String(r.base)}
                      value={overrides[k] ?? ""}
                      onChange={(e) => set(k, e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">DH</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingPage;
