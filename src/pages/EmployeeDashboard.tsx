import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, MapPin, Clock, CheckCircle2 } from "lucide-react";
import logo from "/cleango-logo.png";

interface Mission {
  id: string;
  status: string;
  address: string;
  scheduled_at: string;
  total_price: number;
  notes: string | null;
  services?: { name: string } | null;
}

const EmployeeDashboard = () => {
  const { user, signOut, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    if (!loading && (!user || !hasRole("employee"))) navigate("/login");
  }, [user, loading, hasRole, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, services(name)")
      .order("scheduled_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMissions(data as any);
      });
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const statusFlow = ["assigned", "en_route", "in_progress", "completed"];
  const statusLabels: Record<string, string> = {
    assigned: "Assignée",
    en_route: "En route",
    in_progress: "En cours",
    completed: "Terminée",
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/"><img src={logo} alt="Peintyhome" className="h-8" /></Link>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4 mr-1" /> Déconnexion
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Mes missions</h1>

        {missions.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune mission assignée.</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {missions.filter(m => m.status !== "completed" && m.status !== "cancelled" && m.status !== "pending" && m.status !== "confirmed").map((m) => (
              <Card key={m.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{(m as any).services?.name || "Mission"}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" /> {m.address}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" /> {new Date(m.scheduled_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{m.total_price} DH</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {statusFlow.map((s) => {
                      const currentIdx = statusFlow.indexOf(m.status);
                      const sIdx = statusFlow.indexOf(s);
                      const isNext = sIdx === currentIdx + 1;
                      const isCurrent = s === m.status;
                      return (
                        <Button
                          key={s}
                          size="sm"
                          variant={isCurrent ? "default" : isNext ? "outline" : "ghost"}
                          disabled={!isNext}
                          onClick={() => isNext && updateStatus(m.id, s)}
                        >
                          {isCurrent && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {statusLabels[s]}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
