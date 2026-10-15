import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Calendar, Users, Sparkles, Gift, Wrench, UserCircle, Car, Package,
  Building2, ShoppingCart, CreditCard, Wallet, Star, Bell, Map, BarChart3, MessageSquare, Tag,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

export const adminNav = [
  { title: "Tableau de bord", url: "/admin", icon: Home, end: true },
  { title: "Commandes", url: "/admin/orders", icon: Calendar },
  { title: "Clients", url: "/admin/clients", icon: Users },
  { title: "Services", url: "/admin/services", icon: Sparkles },
  { title: "Packs & Promotions", url: "/admin/packs", icon: Gift },
  { title: "Tarifs", url: "/admin/pricing", icon: Tag },
  { title: "Équipes", url: "/admin/teams", icon: Wrench },
  { title: "Employés", url: "/admin/employees", icon: UserCircle },
  { title: "Véhicules", url: "/admin/vehicles", icon: Car },
  { title: "Stock", url: "/admin/stock", icon: Package },
  { title: "Fournisseurs", url: "/admin/suppliers", icon: Building2 },
  { title: "Achats", url: "/admin/purchases", icon: ShoppingCart },
  { title: "Facturation", url: "/admin/billing", icon: CreditCard },
  { title: "Comptabilité", url: "/admin/accounting", icon: Wallet },
  { title: "Avis Clients", url: "/admin/reviews", icon: Star },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Carte interventions", url: "/admin/map", icon: Map },
  { title: "Rapports & Stats", url: "/admin/reports", icon: BarChart3 },
  { title: "Messagerie", url: "/admin/messages", icon: MessageSquare },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration Peintyhome</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => {
                const active = item.end ? pathname === item.url : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
