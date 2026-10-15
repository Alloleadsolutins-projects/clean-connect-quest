import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star, Gift, Link2 } from "lucide-react";
import { toast } from "sonner";

type Pack = any;

const PacksAdminPage = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [links, setLinks] = useState<Record<string, string[]>>({}); // pack_id -> service_ids
  const [open, setOpen] = useState(false);
  const [linkPack, setLinkPack] = useState<Pack | null>(null);
  const [editing, setEditing] = useState<Pack | null>(null);
  const [f, setF] = useState<any>({ name: "", badge: "", price: "", description: "", featuresText: "", image_url: "", popular: false, is_active: true, sort_order: "0" });

  const fetchAll = async () => {
    const [{ data: p }, { data: s }, { data: ps }] = await Promise.all([
      supabase.from("packs").select("*").order("sort_order"),
      supabase.from("services").select("id, name").order("name"),
      supabase.from("pack_services").select("*"),
    ]);
    setPacks(p || []);
    setServices(s || []);
    const map: Record<string, string[]> = {};
    (ps || []).forEach((x: any) => { (map[x.pack_id] ||= []).push(x.service_id); });
    setLinks(map);
  };
  useEffect(() => { fetchAll(); }, []);

  const reset = () => { setEditing(null); setF({ name: "", badge: "", price: "", description: "", featuresText: "", image_url: "", popular: false, is_active: true, sort_order: "0" }); };
  const openEdit = (p: Pack) => {
    setEditing(p);
    setF({
      name: p.name, badge: p.badge || "", price: String(p.price), description: p.description || "",
      featuresText: (p.features || []).join("\n"), image_url: p.image_url || "",
      popular: !!p.popular, is_active: p.is_active !== false, sort_order: String(p.sort_order ?? 0),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!f.name || !f.price) return toast.error("Nom et prix requis");
    const payload = {
      name: f.name, badge: f.badge || null, price: parseFloat(f.price),
      description: f.description || null,
      features: f.featuresText.split("\n").map((x: string) => x.trim()).filter(Boolean),
      image_url: f.image_url || null, popular: f.popular, is_active: f.is_active,
      sort_order: parseInt(f.sort_order) || 0,
    };
    const { error } = editing
      ? await supabase.from("packs").update(payload).eq("id", editing.id)
      : await supabase.from("packs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Pack modifié" : "Pack créé");
    setOpen(false); reset(); fetchAll();
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ce pack ?")) return;
    const { error } = await supabase.from("packs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Supprimé"); fetchAll();
  };

  const toggleLink = async (packId: string, serviceId: string, checked: boolean) => {
    if (checked) {
      const { error } = await supabase.from("pack_services").insert({ pack_id: packId, service_id: serviceId });
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("pack_services").delete().eq("pack_id", packId).eq("service_id", serviceId);
      if (error) return toast.error(error.message);
    }
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center"><Gift className="h-5 w-5 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-bold">Packs & Promotions</h1>
            <p className="text-muted-foreground text-sm">Gestion des packs Detailing et leur assignation aux services</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button onClick={reset}><Plus className="h-4 w-4 mr-1" /> Nouveau pack</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Modifier le pack" : "Nouveau pack"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nom *</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Badge</Label><Input value={f.badge} onChange={(e) => setF({ ...f, badge: e.target.value })} placeholder="Recommandé" /></div>
                <div><Label>Prix (DH) *</Label><Input type="number" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></div>
              </div>
              <div><Label>Description courte</Label><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
              <div><Label>Caractéristiques (une par ligne)</Label><Textarea rows={5} value={f.featuresText} onChange={(e) => setF({ ...f, featuresText: e.target.value })} /></div>
              <div><Label>Image (URL)</Label><Input value={f.image_url} onChange={(e) => setF({ ...f, image_url: e.target.value })} placeholder="https://…" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Ordre</Label><Input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: e.target.value })} /></div>
                <div className="flex items-end gap-4 pb-2">
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={f.popular} onCheckedChange={(v) => setF({ ...f, popular: !!v })} /> Populaire</label>
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={f.is_active} onCheckedChange={(v) => setF({ ...f, is_active: !!v })} /> Actif</label>
                </div>
              </div>
              <Button onClick={save} className="w-full">{editing ? "Enregistrer" : "Créer"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Packs ({packs.length})</CardTitle></CardHeader>
        <CardContent>
          {packs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun pack.</p>
          ) : (
            <div className="space-y-3">
              {packs.map((p) => (
                <div key={p.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold">{p.name}</p>
                        {p.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{p.badge}</span>}
                        {p.popular && <Star className="h-4 w-4 fill-warning text-warning" />}
                        {!p.is_active && <span className="text-xs text-muted-foreground">(inactif)</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{(p.features || []).length} caractéristiques · Services liés : {(links[p.id] || []).length}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{p.price} DH</span>
                      <Button size="icon" variant="ghost" onClick={() => setLinkPack(p)}><Link2 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!linkPack} onOpenChange={(v) => !v && setLinkPack(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Assigner « {linkPack?.name} » à des services</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">Ces liens font apparaître le pack sous le formulaire de demande de chaque service coché.</p>
          <div className="space-y-2">
            {services.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Aucun service en base. Créez d'abord des services.</p>
            ) : services.map((s) => {
              const checked = linkPack ? (links[linkPack.id] || []).includes(s.id) : false;
              return (
                <label key={s.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/40">
                  <Checkbox checked={checked} onCheckedChange={(v) => linkPack && toggleLink(linkPack.id, s.id, !!v)} />
                  <span className="text-sm">{s.name}</span>
                </label>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PacksAdminPage;
