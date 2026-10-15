import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Package, Users, Briefcase, DollarSign, Plus, Pencil, Trash2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import logo from "/cleango-logo.png";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}

interface Order {
  id: string;
  status: string;
  address: string;
  scheduled_at: string;
  total_price: number;
  client_id: string;
  team_id: string | null;
  services?: { name: string } | null;
  profiles?: { full_name: string | null } | null;
}

const AdminDashboard = () => {
  const { user, signOut, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Service form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("car");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("60");

  useEffect(() => {
    if (!loading && (!user || !hasRole("admin"))) navigate("/login");
  }, [user, loading, hasRole, navigate]);

  const fetchData = async () => {
    const [sRes, oRes] = await Promise.all([
      supabase.from("services").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*, services(name)").order("created_at", { ascending: false }),
    ]);
    if (sRes.data) setServices(sRes.data);
    if (oRes.data) setOrders(oRes.data as any);
  };

  useEffect(() => {
    if (user && hasRole("admin")) fetchData();
  }, [user, hasRole]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("car");
    setPrice("");
    setDuration("60");
    setEditingService(null);
  };

  const openEdit = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setDescription(s.description || "");
    setCategory(s.category);
    setPrice(s.price.toString());
    setDuration(s.duration_minutes.toString());
    setDialogOpen(true);
  };

  const handleSaveService = async () => {
    if (!name || !price) { toast.error("Nom et prix requis"); return; }
    const payload = {
      name,
      description: description || null,
      category,
      price: parseFloat(price),
      duration_minutes: parseInt(duration),
    };

    if (editingService) {
      const { error } = await supabase.from("services").update(payload).eq("id", editingService.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Service modifié");
    } else {
      const { error } = await supabase.from("services").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Service créé");
    }
    setDialogOpen(false);
    resetForm();
    fetchData();
  };

  const deleteService = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    toast.success("Service supprimé");
    fetchData();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    toast.success("Statut mis à jour");
    fetchData();
  };

  const totalRevenue = orders.filter(o => o.status === "completed").reduce((sum, o) => sum + o.total_price, 0);
  const activeOrders = orders.filter(o => !["completed", "cancelled"].includes(o.status)).length;

  const statusLabels: Record<string, string> = {
    pending: "En attente", confirmed: "Confirmée", assigned: "Assignée",
    en_route: "En route", in_progress: "En cours", completed: "Terminée", cancelled: "Annulée",
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/"><img src={logo} alt="Peintyhome" className="h-14" /></Link>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Admin</span>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRevenue} DH</p>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                <Package className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-muted-foreground">Total commandes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeOrders}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{services.length}</p>
                <p className="text-sm text-muted-foreground">Services actifs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="services">
          <TabsList className="mb-6">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des services</CardTitle>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Ajouter</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingService ? "Modifier le service" : "Nouveau service"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nom</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Lavage extérieur" />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Détails du service..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Catégorie</Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="car">Voiture</SelectItem>
                              <SelectItem value="house">Maison</SelectItem>
                              <SelectItem value="chantier">Chantier</SelectItem>
                              <SelectItem value="marbre">Marbre</SelectItem>
                              <SelectItem value="tapis">Tapis</SelectItem>
                              <SelectItem value="piscine">Piscine</SelectItem>
                              <SelectItem value="bureau">Bureaux</SelectItem>
                              <SelectItem value="facade">Façade</SelectItem>
                              <SelectItem value="clim">Climatisation</SelectItem>
                              <SelectItem value="desinfection">Désinfection</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Prix (DH)</Label>
                          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="29" />
                        </div>
                      </div>
                      <div>
                        <Label>Durée (minutes)</Label>
                        <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" />
                      </div>
                      <Button onClick={handleSaveService} className="w-full">
                        {editingService ? "Enregistrer" : "Créer le service"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Aucun service. Ajoutez-en un !</p>
                ) : (
                  <div className="space-y-3">
                    {services.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {({ car: "Voiture", house: "Maison", chantier: "Chantier", marbre: "Marbre", tapis: "Tapis", piscine: "Piscine", bureau: "Bureaux", facade: "Façade", clim: "Climatisation", desinfection: "Désinfection" } as Record<string, string>)[s.category] || s.category} · {s.duration_minutes} min
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">{s.price} DH</span>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteService(s.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Aucune commande.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{(o as any).services?.name || "Service"}</p>
                          <p className="text-sm text-muted-foreground">{o.address}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(o.scheduled_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v)}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([k, v]) => (
                                <SelectItem key={k} value={k}>{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="font-bold text-sm">{o.total_price} DH</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
