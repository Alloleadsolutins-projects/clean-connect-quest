import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import logo from "/cleango-logo.png";

const AdminLayout = () => {
  const { user, hasRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !hasRole("admin"))) navigate("/login");
  }, [user, loading, hasRole, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b bg-card px-4 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Link to="/"><img src={logo} alt="Peintyhome" className="h-10" /></Link>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Admin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-1" /> Déconnexion
            </Button>
          </header>
          <main className="flex-1 p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
