import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export type FieldType = "text" | "number" | "textarea" | "date" | "select";

export interface FieldDef {
  name: string;          // DB column name
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  badge?: boolean;
  prefix?: string;
  suffix?: string;
}

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  table: string;         // Supabase table name
  fields: FieldDef[];
  primaryField: string;
  addLabel?: string;
  orderBy?: string;
}

type Row = Record<string, any> & { id: string };

const SupabaseCrudPage = ({
  title, description, icon: Icon, table, fields, primaryField,
  addLabel = "Ajouter", orderBy = "created_at",
}: Props) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table as any).select("*").order(orderBy, { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { fetchRows(); }, [table]);

  const openNew = () => { setEditing(null); setForm({}); setOpen(true); };
  const openEdit = (r: Row) => { setEditing(r); setForm(r); setOpen(true); };

  const save = async () => {
    for (const f of fields) {
      if (f.required && !form[f.name]) { toast.error(`Le champ "${f.label}" est requis`); return; }
    }
    const payload: Record<string, any> = {};
    for (const f of fields) {
      let v = form[f.name];
      if (v === "" || v === undefined) v = null;
      if (f.type === "number" && v !== null) v = Number(v);
      payload[f.name] = v;
    }
    const { error } = editing
      ? await supabase.from(table as any).update(payload).eq("id", editing.id)
      : await supabase.from(table as any).insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Modifié" : "Ajouté");
    setOpen(false);
    fetchRows();
  };

  const remove = async (id: string) => {
    if (!confirm("Confirmer la suppression ?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Supprimé");
    fetchRows();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> {addLabel}</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Modifier" : addLabel}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.name} className="space-y-1">
                  <Label>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                  {f.type === "textarea" ? (
                    <Textarea value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder} />
                  ) : f.type === "select" ? (
                    <select className="w-full h-10 border rounded-md px-3 bg-background" value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                      <option value="">— Sélectionner —</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <Input type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder} />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={save}>{editing ? "Enregistrer" : "Ajouter"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Liste ({rows.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-10">Chargement…</p>
          ) : rows.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aucun élément pour l'instant.</p>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{r[primaryField] ?? "—"}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                      {fields.filter((f) => f.name !== primaryField).map((f) => {
                        const v = r[f.name];
                        if (v === null || v === undefined || v === "") return null;
                        const display = `${f.prefix || ""}${v}${f.suffix || ""}`;
                        return f.badge ? (
                          <Badge key={f.name} variant="secondary">{display}</Badge>
                        ) : (
                          <span key={f.name}><b className="text-foreground/70">{f.label}:</b> {display}</span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">☁️ Données synchronisées avec la base de données.</p>
    </div>
  );
};

export default SupabaseCrudPage;
