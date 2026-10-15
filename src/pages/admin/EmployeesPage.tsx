import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeesPage = () => {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("user_roles").select("*").eq("role", "employee");
      if (data) {
        const ids = data.map((r: any) => r.user_id);
        if (ids.length === 0) return setRows([]);
        const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", ids);
        setRows(profiles || []);
      }
    })();
  }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Employés</h1><p className="text-muted-foreground">Membres du personnel Peintyhome</p></div>
      <Card>
        <CardHeader><CardTitle>Employés ({rows.length})</CardTitle></CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun employé pour l'instant.</p>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <p className="font-medium">{r.full_name || r.user_id}</p>
                  <span className="text-xs text-muted-foreground">{r.phone || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default EmployeesPage;
