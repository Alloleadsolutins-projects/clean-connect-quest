import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { Car, Package, Building2, ShoppingCart, CreditCard, Wallet, Star, Bell, Map, BarChart3, MessageSquare } from "lucide-react";
import Index from "./pages/Index";
import Login from "./pages/Login";

import ClientDashboard from "./pages/ClientDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PacksPage from "./pages/PacksPage";
import ServicesListPage from "./pages/ServicesListPage";
import ServicePage from "./pages/ServicePage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import OrdersPage from "./pages/admin/OrdersPage";
import ServicesAdminPage from "./pages/admin/ServicesPage";
import PacksAdminPage from "./pages/admin/PacksPage";
import PricingPage from "./pages/admin/PricingPage";
import ClientsPage from "./pages/admin/ClientsPage";
import TeamsPage from "./pages/admin/TeamsPage";
import EmployeesPage from "./pages/admin/EmployeesPage";
import SupabaseCrudPage from "./components/admin/SupabaseCrudPage";
import ChatbotButton from "./components/ChatbotButton";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/services" element={<ServicesListPage />} />
            <Route path="/services/:slug" element={<ServicePage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardHome />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="services" element={<ServicesAdminPage />} />
              <Route path="packs" element={<PacksAdminPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="employees" element={<SupabaseCrudPage title="Employés" description="Fiches employés terrain" icon={Package} table="employees" primaryField="full_name" fields={[
                { name: "full_name", label: "Nom complet", required: true },
                { name: "role", label: "Poste" },
                { name: "phone", label: "Téléphone" },
                { name: "email", label: "Email" },
                { name: "status", label: "Statut", type: "select", options: ["actif", "conge", "inactif"], badge: true },
                { name: "hire_date", label: "Date d'embauche", type: "date" },
                { name: "notes", label: "Notes", type: "textarea" },
              ]} />} />
              <Route path="vehicles" element={<SupabaseCrudPage title="Véhicules" description="Flotte véhicules Peintyhome" icon={Car} table="vehicles" primaryField="plate" fields={[
                { name: "plate", label: "Immatriculation", required: true },
                { name: "brand", label: "Marque / Modèle" },
                { name: "type", label: "Type", type: "select", options: ["Utilitaire", "Voiture", "Camion", "Moto"], badge: true },
                { name: "driver", label: "Chauffeur assigné" },
                { name: "status", label: "Statut", type: "select", options: ["disponible", "en_mission", "maintenance"], badge: true },
                { name: "mileage", label: "Kilométrage", type: "number", suffix: " km" },
              ]} />} />
              <Route path="stock" element={<SupabaseCrudPage title="Stock" description="Inventaire produits et consommables" icon={Package} table="stock_items" primaryField="product" fields={[
                { name: "product", label: "Produit", required: true },
                { name: "category", label: "Catégorie", type: "select", options: ["Détergent", "Consommable", "Équipement", "Chimique"], badge: true },
                { name: "quantity", label: "Quantité", type: "number", required: true },
                { name: "unit", label: "Unité", type: "select", options: ["L", "kg", "pcs", "boîte"] },
                { name: "threshold", label: "Seuil d'alerte", type: "number" },
                { name: "unit_price", label: "Prix unitaire", type: "number", suffix: " DH" },
              ]} />} />
              <Route path="suppliers" element={<SupabaseCrudPage title="Fournisseurs" description="Annuaire fournisseurs et partenaires" icon={Building2} table="suppliers" primaryField="name" fields={[
                { name: "name", label: "Nom du fournisseur", required: true },
                { name: "contact_name", label: "Personne de contact" },
                { name: "phone", label: "Téléphone" },
                { name: "email", label: "Email" },
                { name: "category", label: "Catégorie", badge: true },
                { name: "address", label: "Adresse" },
              ]} />} />
              <Route path="purchases" element={<SupabaseCrudPage title="Achats" description="Commandes fournisseurs" icon={ShoppingCart} table="purchases" primaryField="reference" fields={[
                { name: "reference", label: "Référence", required: true },
                { name: "supplier", label: "Fournisseur", required: true },
                { name: "purchase_date", label: "Date", type: "date" },
                { name: "amount", label: "Montant", type: "number", suffix: " DH" },
                { name: "status", label: "Statut", type: "select", options: ["en_attente", "commande", "livre", "paye"], badge: true },
                { name: "notes", label: "Notes", type: "textarea" },
              ]} />} />
              <Route path="billing" element={<SupabaseCrudPage title="Facturation & Paiements" description="Factures clients" icon={CreditCard} table="invoices" primaryField="number" fields={[
                { name: "number", label: "N° Facture", required: true },
                { name: "client", label: "Client", required: true },
                { name: "invoice_date", label: "Date", type: "date" },
                { name: "amount", label: "Montant TTC", type: "number", suffix: " DH" },
                { name: "status", label: "Statut", type: "select", options: ["brouillon", "envoyee", "payee", "en_retard"], badge: true },
                { name: "method", label: "Méthode", type: "select", options: ["Espèces", "Virement", "Carte", "Chèque"] },
              ]} />} />
              <Route path="accounting" element={<SupabaseCrudPage title="Comptabilité" description="Recettes et dépenses" icon={Wallet} table="accounting_entries" primaryField="label" fields={[
                { name: "label", label: "Libellé", required: true },
                { name: "entry_type", label: "Type", type: "select", options: ["recette", "depense"], badge: true, required: true },
                { name: "category", label: "Catégorie" },
                { name: "entry_date", label: "Date", type: "date" },
                { name: "amount", label: "Montant", type: "number", suffix: " DH" },
              ]} />} />
              <Route path="reviews" element={<SupabaseCrudPage title="Avis Clients" description="Modération des avis" icon={Star} table="reviews" primaryField="client" fields={[
                { name: "client", label: "Client", required: true },
                { name: "rating", label: "Note /5", type: "number", badge: true },
                { name: "service", label: "Service concerné" },
                { name: "comment", label: "Commentaire", type: "textarea" },
                { name: "review_date", label: "Date", type: "date" },
                { name: "status", label: "Statut", type: "select", options: ["publie", "en_moderation", "masque"], badge: true },
              ]} />} />
              <Route path="notifications" element={<SupabaseCrudPage title="Notifications" description="Notifications automatiques" icon={Bell} table="notifications" primaryField="title" fields={[
                { name: "title", label: "Titre", required: true },
                { name: "channel", label: "Canal", type: "select", options: ["WhatsApp", "SMS", "Email", "Push"], badge: true },
                { name: "recipient", label: "Destinataire" },
                { name: "message", label: "Message", type: "textarea" },
                { name: "send_date", label: "Date d'envoi", type: "date" },
                { name: "status", label: "Statut", type: "select", options: ["programmee", "envoyee", "echec"], badge: true },
              ]} />} />
              <Route path="map" element={<SupabaseCrudPage title="Carte des interventions" description="Points d'intervention" icon={Map} table="interventions" primaryField="address" fields={[
                { name: "address", label: "Adresse", required: true },
                { name: "city", label: "Ville", badge: true },
                { name: "client", label: "Client" },
                { name: "service", label: "Service" },
                { name: "intervention_date", label: "Date", type: "date" },
                { name: "status", label: "Statut", type: "select", options: ["planifiee", "en_cours", "terminee"], badge: true },
              ]} />} />
              <Route path="reports" element={<SupabaseCrudPage title="Rapports & Statistiques" description="Rapports d'activité" icon={BarChart3} table="reports" primaryField="title" fields={[
                { name: "title", label: "Titre du rapport", required: true },
                { name: "period", label: "Période", type: "select", options: ["journalier", "hebdomadaire", "mensuel", "annuel"], badge: true },
                { name: "report_date", label: "Date", type: "date" },
                { name: "revenue", label: "CA", type: "number", suffix: " DH" },
                { name: "interventions_count", label: "Nb interventions", type: "number" },
                { name: "notes", label: "Notes", type: "textarea" },
              ]} />} />
              <Route path="messages" element={<SupabaseCrudPage title="Messagerie" description="Messagerie interne" icon={MessageSquare} table="messages" primaryField="subject" fields={[
                { name: "subject", label: "Sujet", required: true },
                { name: "recipient", label: "Destinataire", required: true },
                { name: "channel", label: "Canal", type: "select", options: ["interne", "client", "equipe"], badge: true },
                { name: "body", label: "Message", type: "textarea" },
                { name: "send_date", label: "Date", type: "date" },
                { name: "status", label: "Statut", type: "select", options: ["brouillon", "envoye", "lu"], badge: true },
              ]} />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatbotButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
