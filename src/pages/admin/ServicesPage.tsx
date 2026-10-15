import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const categories = ["auto", "ameublement", "travaux", "sols", "exterieur", "chantier", "maintenance", "bureau", "desinfection"];

const ServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [f, setF] = useState({ name: "", description: "", category: "auto", price: "", duration_minutes: "60", image_url: "" });

  const fetch = async () => {
    const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
    if (data) setServices(data);
  };
  useEffect(() => { fetch(); }, []);

  const reset = () => { setF({ name: "", description: "", category: "auto", price: "", duration_minutes: "60", image_url: "" }); setEditing(null); };
  const openEdit = (s: any) => {
    setEditing(s); setF({ name: s.name, description: s.description || "", category: s.category, price: String(s.price), duration_minutes: String(s.duration_minutes), image_url: s.image_url || "" });
    setOpen(true);
  };
  const save = async () => {
    if (!f.name || !f.price) return toast.error("Nom et prix requis");
    const payload = { name: f.name, description: f.description || null, category: f.category, price: parseFloat(f.price), duration_minutes: parseInt(f.duration_minutes), image_url: f.image_url || null };
    const { error } = editing ? await supabase.from("services").update(payload).eq("id", editing.id) : await supabase.from("services").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Service modifié" : "Service créé");
    setOpen(false); reset(); fetch();
  };
  const del = async (id: string) => { await supabase.from("services").delete().eq("id", id); toast.success("Supprimé"); fetch(); };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">Catalogue des prestations Peintyhome</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Ajouter</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouveau service"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nom</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Catégorie</Label>
                  <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Prix (DH)</Label><Input type="number" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></div>
              </div>
              <div><Label>Durée (min)</Label><Input type="number" value={f.duration_minutes} onChange={(e) => setF({ ...f, duration_minutes: e.target.value })} /></div>
              <div><Label>Image (URL)</Label><Input value={f.image_url} onChange={(e) => setF({ ...f, image_url: e.target.value })} placeholder="https://…" />
                <p className="text-xs text-muted-foreground mt-1">Astuce : renseigner le nom exact d'un service du site pour remplacer son image sur la page d'accueil et /services.</p>
              </div>
              <Button onClick={save} className="w-full">{editing ? "Enregistrer" : "Créer"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>Services ({services.length})</CardTitle></CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun service.</p>
          ) : (
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div><p className="font-medium">{s.name}</p><p className="text-sm text-muted-foreground">{s.category} · {s.duration_minutes} min</p></div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{s.price} DH</span>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => del(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesPage;
