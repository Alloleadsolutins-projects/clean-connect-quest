import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, BarChart3, Briefcase, Users, Star, TrendingUp, Clock } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const statusLabels: Record<string, string> = {
  pending: "En attente", confirmed: "Confirmée", assigned: "Assignée",
  en_route: "En route", in_progress: "En cours", completed: "Terminée", cancelled: "Annulée",
};

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))", "hsl(var(--accent-foreground))", "hsl(var(--secondary-foreground))"];

const monthKey = (d: Date) => d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

const AdminDashboardHome = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [counts, setCounts] = useState({ services: 0, clients: 0, reviews: 0, rating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [oRes, sRes, pRes, rRes] = await Promise.all([
        supabase.from("orders").select("status,total_price,created_at,scheduled_at,service_label,city,services(name)"),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("rating"),
      ]);
      setOrders(oRes.data || []);
      const ratings = (rRes.data || []).map((r: any) => Number(r.rating || 0)).filter(Boolean);
      setCounts({
        services: sRes.count || 0,
        clients: pRes.count || 0,
        reviews: ratings.length,
        rating: ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0,
      });
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "completed");
    const revenue = completed.reduce((s, o) => s + Number(o.total_price || 0), 0);
    const active = orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length;
    const pipeline = orders.filter((o) => !["completed", "cancelled"].includes(o.status)).reduce((s, o) => s + Number(o.total_price || 0), 0);
    const avg = completed.length ? Math.round(revenue / completed.length) : 0;
    const rate = orders.length ? Math.round((completed.length / orders.length) * 100) : 0;
    return { revenue, active, avg, rate, pipeline, total: orders.length };
  }, [orders]);

  const monthly = useMemo(() => {
    const buckets: Record<string, { month: string; commandes: number; revenus: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets[monthKey(d)] = { month: monthKey(d), commandes: 0, revenus: 0 };
    }
    orders.forEach((o) => {
      const k = monthKey(new Date(o.created_at));
      if (!buckets[k]) return;
      buckets[k].commandes += 1;
      if (o.status === "completed") buckets[k].revenus += Number(o.total_price || 0);
    });
    return Object.values(buckets);
  }, [orders]);

  const byStatus = useMemo(() => {
    const m: Record<string, number> = {};
    orders.forEach((o) => { m[o.status] = (m[o.status] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: statusLabels[k] || k, value: v }));
  }, [orders]);

  const topServices = useMemo(() => {
    const m: Record<string, { name: string; commandes: number; revenus: number }> = {};
    orders.forEach((o) => {
      const name = o.service_label || o.services?.name || "Autre";
      m[name] = m[name] || { name, commandes: 0, revenus: 0 };
      m[name].commandes += 1;
      m[name].revenus += Number(o.total_price || 0);
    });
    return Object.values(m).sort((a, b) => b.commandes - a.commandes).slice(0, 6);
  }, [orders]);

  const byCity = useMemo(() => {
    const m: Record<string, number> = {};
    orders.forEach((o) => { const c = o.city || "Non renseignée"; m[c] = (m[c] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [orders]);

  const cards = [
    { icon: DollarSign, val: `${stats.revenue} DH`, label: "Chiffre d'affaires réalisé", bg: "bg-primary/10", fg: "text-primary" },
    { icon: Package, val: stats.total, label: "Total commandes", bg: "bg-accent", fg: "text-accent-foreground" },
    { icon: Clock, val: stats.active, label: "En cours", bg: "bg-warning/10", fg: "text-warning" },
    { icon: TrendingUp, val: `${stats.pipeline} DH`, label: "Potentiel en cours", bg: "bg-success/10", fg: "text-success" },
    { icon: BarChart3, val: `${stats.avg} DH`, label: "Panier moyen", bg: "bg-primary/10", fg: "text-primary" },
    { icon: Briefcase, val: `${stats.rate} %`, label: "Taux de réalisation", bg: "bg-accent", fg: "text-accent-foreground" },
    { icon: Users, val: counts.clients, label: "Clients inscrits", bg: "bg-warning/10", fg: "text-warning" },
    { icon: Star, val: counts.rating ? `${counts.rating}/5` : "—", label: `Note moyenne (${counts.reviews} avis)`, bg: "bg-success/10", fg: "text-success" },
  ];

  const hasData = orders.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de l'activité Peintyhome</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-11 w-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                <c.icon className={`h-5 w-5 ${c.fg}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold truncate">{loading ? "…" : c.val}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasData && !loading && (
        <Card><CardContent className="p-8 text-center text-muted-foreground">
          Les graphiques s'afficheront dès la réception des premières commandes clients.
        </CardContent></Card>
      )}

      {hasData && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Évolution de l'activité (6 mois)</CardTitle></CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Legend />
                    <Area type="monotone" dataKey="commandes" name="Commandes" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="revenus" name="Revenus (DH)" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Répartition par statut</CardTitle></CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                      {byStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Meilleurs services</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topServices} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis type="category" dataKey="name" width={130} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey="commandes" name="Commandes" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Commandes par ville</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byCity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="value" name="Commandes" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardHome;
