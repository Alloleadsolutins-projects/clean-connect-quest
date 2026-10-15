
Refonte complète en 3 volets. La portée est vaste — je propose de livrer un socle fonctionnel maintenant, et de raffiner ensuite par lots.

## 1. Espace Admin — Sidebar + 18 pages

Architecture unifiée avec `SidebarProvider` shadcn et un layout partagé.

Nouveau `src/pages/admin/AdminLayout.tsx` (sidebar collapsible + header avec `SidebarTrigger`, protection route `admin`), et `src/components/admin/AdminSidebar.tsx` avec les entrées :

```text
🏠 Tableau de bord         /admin
📅 Commandes               /admin/orders
👥 Clients                 /admin/clients
🧹 Services                /admin/services
🎁 Packs & Promotions      /admin/packs
👨‍🔧 Équipes                /admin/teams
👤 Employés                /admin/employees
🚗 Véhicules               /admin/vehicles
📦 Stock                   /admin/stock
🏢 Fournisseurs            /admin/suppliers
🛒 Achats                  /admin/purchases
💳 Facturation & Paiements /admin/billing
💰 Comptabilité            /admin/accounting
⭐ Avis Clients            /admin/reviews
🔔 Notifications           /admin/notifications
📍 Carte interventions     /admin/map
📊 Rapports & Stats        /admin/reports
💬 Messagerie              /admin/messages
```

Réutilisation :
- Tableau de bord, Commandes, Services : logique existante déplacée depuis `AdminDashboard.tsx`.
- Clients, Équipes, Employés : lecture `profiles` + `user_roles` + `teams` + `team_members` (tables déjà présentes).
- Packs, Véhicules, Stock, Fournisseurs, Achats, Facturation, Comptabilité, Avis, Notifications, Carte, Rapports, Messagerie : **écrans placeholder fonctionnels** (UI + état vide + CTA "Bientôt disponible") sans nouvelles tables cette itération, pour éviter une explosion de schéma non validée. Les migrations DB seront proposées ensuite par groupe (ex. véhicules+stock, achats+fournisseurs) après votre validation métier.

Routes ajoutées dans `App.tsx` sous `/admin/*`.

## 2. Contenu site — Carte de visite + PDF packs

### Coordonnées CleanGo (extraites des cartes de visite)
Injectées partout (Footer, ContactPage, Navbar CTA, Hero) :
- Tél : **+212 6 60 60 25 06**
- Email : **contact@cleango.ma**
- Web : **www.cleango.ma**
- Instagram : `@cleango.ma`
- Facebook : `cleango.ma`
- Slogan : *Qualité · Rapidité · Confiance*
- Baseline : *Société de nettoyage multiservices et travaux*

### Catalogue services (verso carte de visite)
Remplace `allServices` dans `src/pages/ServicePage.tsx` par ces 11 services :
1. Traitement de canapés, sedaris, tapis, chaises, matelas et sièges auto
2. Lavage complet et esthétique automobile à domicile (detailing)
3. Habillage mural et pose de sols (marbre, mosaïque, carrelage)
4. Tapisserie, peinture et rénovation de cuir
5. Jardinage et entretien d'espaces verts
6. Polissage et tôlerie de carrosserie
7. Nettoyage piscines et vitres
8. Nettoyage fin de chantier
9. Cristallisation de marbre
10. Traitement des sols
11. (garde "Lavage extérieur voiture" comme entrée d'appel)

Chaque service : slug, titre, description, catégorie (Particulier/Professionnel), prix "Sur devis" par défaut, icône Lucide.

### Section Packs CleanGo (depuis le PDF) sur `/packs` et Home
Cartes avec badge, prix DH, liste de prestations, 2 CTA par carte : **Appeler** (`tel:+212660602506`) et **Demander** (ouvre formulaire) :
- Pack Classique — Essentiel — **99 DH**
- Pack Signature — Recommandé — **249 DH**
- Pack Royale — Premium — **499 DH**
- Pack VIP — Luxe — **999 DH**
- Pack Top VIP — Prestige Absolu — **1999 DH**

### Page service détaillée `/services/:slug`
Refonte : hero image + description longue + inclusions + prix + **formulaire de demande** (Nom, Téléphone, Adresse, Service voulu prérempli, Catégorie Particulier/Pro, Remarque, Submit). Le submit crée un `order` en base (statut `pending`, client_id null si invité — colonne déjà existante d'après le schéma actuel).

Composant partagé `ServiceRequestForm.tsx` réutilisé sur page pack et page service.

## 3. Ce qui est explicitement hors-scope de cette itération

Pour rester livrable et testable, **je ne crée pas** dans cette PR :
- Nouvelles tables (véhicules, stock, fournisseurs, achats, factures, compta, avis, notifications, messages) — les pages sont des placeholders.
- Création réelle de comptes employés depuis Équipes (auth admin nécessite Edge Function) — placeholder UI.
- Carte Leaflet/Mapbox live — placeholder.

Je propose ces lots pour la suite, un par tour, après votre validation du socle.

## Aspects techniques

- Sidebar : shadcn `Sidebar` `collapsible="icon"`, `NavLink` actif, groupe unique "Administration".
- Routing : ajout de 18 routes enfants sous `/admin` via `<Outlet />`.
- Formulaire : `zod` + `react-hook-form` (déjà installés), toast Sonner.
- Insert commande invité : requête directe sur `orders` (RLS déjà en place — vérifier policy `INSERT` avec `client_id IS NULL`; si absente, migration mineure à proposer).
- Aucune modification du client Supabase auto-généré.
