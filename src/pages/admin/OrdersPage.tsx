import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Phone, MapPin, Trash2, RefreshCw, ChevronDown, ChevronUp, Image as ImageIcon, FileText, ReceiptText } from "lucide-react";
import OrderDocumentDialog, { type DocType } from "@/components/admin/OrderDocumentDialog";

const statusLabels: Record<string, string> = {
  pending: "En attente", confirmed: "Confirmée", assigned: "Assignée",
  en_route: "En route", in_progress: "En cours", completed: "Terminée", cancelled: "Annulée",
};

const statusVariant = (s: string) =>
  s === "completed" ? "default" : s === "cancelled" ? "destructive" : "secondary";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [docOrder, setDocOrder] = useState<any | null>(null);
  const [docType, setDocType] = useState<DocType>("devis");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, services(name)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setOrders(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // Réception temps réel des nouvelles commandes clients
  useEffect(() => {
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Statut mis à jour");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette commande ?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Commande supprimée");
    load();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return [o.guest_name, o.guest_phone, o.address, o.city, o.service_label, o.services?.name]
        .filter(Boolean).some((v: string) => v.toLowerCase().includes(q));
    });
  }, [orders, filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Commandes</h1>
          <p className="text-muted-foreground">Réception et suivi des demandes clients en temps réel</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-1" /> Rafraîchir
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Rechercher (nom, téléphone, adresse, service)…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader><CardTitle>Commandes ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Chargement…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune commande.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((o) => (
                <div key={o.id} className="rounded-lg border">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate">{o.service_label || o.services?.name || "Service"}</p>
                        <Badge variant={statusVariant(o.status) as any}>{statusLabels[o.status] || o.status}</Badge>
                        {o.photo_urls?.length > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />{o.photo_urls.length}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{o.guest_name || "Client"} {o.guest_phone && <a href={`tel:${o.guest_phone}`} className="text-primary"><Phone className="h-3 w-3 inline mx-1" />{o.guest_phone}</a>}</p>
                      <p className="text-sm text-muted-foreground truncate"><MapPin className="h-3 w-3 inline mr-1" />{o.address}{o.city ? ` — ${o.city}` : ""}</p>
                      <p className="text-xs text-muted-foreground">
                        Reçue le {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                        {" · "}Prévue : {new Date(o.scheduled_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <span className="font-bold text-sm whitespace-nowrap">{Number(o.total_price || 0)} DH</span>
                      <Button variant="outline" size="sm" onClick={() => { setDocType("devis"); setDocOrder(o); }}>
                        <FileText className="h-4 w-4 mr-1" /> Devis
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setDocType("facture"); setDocOrder(o); }}>
                        <ReceiptText className="h-4 w-4 mr-1" /> Facture
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setOpenId(openId === o.id ? null : o.id)} aria-label="Détails">
                        {openId === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(o.id)} aria-label="Supprimer">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {openId === o.id && (
                    <div className="border-t p-4 space-y-3 bg-muted/30">
                      <pre className="text-xs whitespace-pre-wrap font-sans text-muted-foreground">{o.notes || "Aucun détail"}</pre>
                      {o.photo_urls?.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {o.photo_urls.map((u: string, i: number) => (
                            <a key={i} href={u} target="_blank" rel="noreferrer" className="rounded-lg overflow-hidden border aspect-square">
                              <img src={u} alt={`Photo commande ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <OrderDocumentDialog order={docOrder} type={docType} onClose={() => setDocOrder(null)} />
    </div>
  );
};

export default OrdersPage;
