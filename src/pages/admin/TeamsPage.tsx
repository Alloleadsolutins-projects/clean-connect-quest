import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import { adminNav } from "@/components/admin/AdminSidebar";

const modules = adminNav.map((n) => ({ key: n.url.replace("/admin", "").replace("/", "") || "dashboard", label: n.title }));

const TeamsPage = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [perms, setPerms] = useState<Record<string, string[]>>({});
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [zone, setZone] = useState("");
  const [permTeam, setPermTeam] = useState<any | null>(null);

  const fetchAll = async () => {
    const [{ data: t }, { data: p }] = await Promise.all([
      supabase.from("teams").select("*").order("created_at", { ascending: false }),
      supabase.from("team_module_permissions").select("*"),
    ]);
    setTeams(t || []);
    const map: Record<string, string[]> = {};
    (p || []).forEach((x: any) => { (map[x.team_id] ||= []).push(x.module); });
    setPerms(map);
  };
  useEffect(() => { fetchAll(); }, []);

  const create = async () => {
    if (!name) return toast.error("Nom requis");
    const { error } = await supabase.from("teams").insert({ name, zone: zone || null });
    if (error) return toast.error(error.message);
    toast.success("Équipe créée"); setName(""); setZone(""); setOpen(false); fetchAll();
  };

  const toggle = async (teamId: string, moduleKey: string, checked: boolean) => {
    if (checked) {
      const { error } = await supabase.from("team_module_permissions").insert({ team_id: teamId, module: moduleKey });
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("team_module_permissions").delete().eq("team_id", teamId).eq("module", moduleKey);
      if (error) return toast.error(error.message);
    }
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h1 className="text-2xl font-bold">Équipes</h1><p className="text-muted-foreground">Équipes terrain et permissions par module</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nouvelle équipe</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Créer une équipe</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nom</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Équipe Casablanca 1" /></div>
              <div><Label>Zone</Label><Input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Casablanca" /></div>
              <p className="text-xs text-muted-foreground">La création de comptes utilisateurs pour les membres nécessite une fonction serveur sécurisée — activable dans un prochain lot.</p>
              <Button onClick={create} className="w-full">Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Équipes ({teams.length})</CardTitle></CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune équipe.</p>
          ) : (
            <div className="space-y-2">
              {teams.map((t) => (
                <div key={t.id} className="p-3 rounded-lg border flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.zone || "—"} · {(perms[t.id] || []).length} modules autorisés</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPermTeam(t)}><Shield className="h-4 w-4 mr-1" /> Permissions</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!permTeam} onOpenChange={(v) => !v && setPermTeam(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Permissions — {permTeam?.name}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">Cocher les modules d'administration accessibles à cette équipe.</p>
          <div className="grid grid-cols-2 gap-2">
            {modules.map((m) => {
              const active = permTeam ? (perms[permTeam.id] || []).includes(m.key) : false;
              return (
                <label key={m.key} className="flex items-center gap-2 p-2 rounded hover:bg-muted/40">
                  <Checkbox checked={active} onCheckedChange={(v) => permTeam && toggle(permTeam.id, m.key, !!v)} />
                  <span className="text-sm">{m.label}</span>
                </label>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default TeamsPage;
