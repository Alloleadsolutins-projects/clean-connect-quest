import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientsPage = () => {
  const [clients, setClients] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (data) setClients(data);
    })();
  }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Clients</h1><p className="text-muted-foreground">Base de contacts Peintyhome</p></div>
      <Card>
        <CardHeader><CardTitle>Clients ({clients.length})</CardTitle></CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun client enregistré.</p>
          ) : (
            <div className="space-y-2">
              {clients.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{c.full_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{c.phone || c.user_id}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default ClientsPage;
