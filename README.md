# Goclean Home Services

developper moi cette plateforme avec les fonctionnalites necessaire avec un logo professionnel , le nom c est Goclean, activer lovable cloud et builder les espace et les comptes de tous types des utilisateur ( client , admin , employe) ,  les services qui s affiche dans la page d acceuil peuvent etre ajouter de puis le compte admin avec leur details et prix , utiliser un design moderne UI professionnel sans couleurs gradiants, voila le PRD PRD COMPLET — Plateforme de Lavage à Domicile (B2C + Admin Business Core)

1. 🎯 Objectif produit

Créer une plateforme permettant :

 aux particuliers de réserver des services de lavage à domicile

 aux équipes d’exécuter efficacement les missions

 à l’admin de piloter toute l’activité (opérations + finances + croissance)

2. 🧩 Architecture produit

2.1 Front Office

 Site web (vitrine + conversion)

 PWA client

2.2 Backoffice Admin (CORE)

👉 Gestion complète du business

2.3 Espace Équipe (PWA)

 Gestion missions terrain

3. 🌐 Site Web (B2C)

Fonction :

 Acquisition + conversion

Contenu :

 Services (voiture, maison)

 Packs abonnement

 Réservation rapide

 Avis clients

Design :

 🎨 Bleu ciel / blanc / gris clair

 🖋 Font : Inter

 UX rapide (≤ 3 étapes)

4. 📱 PWA Client

Fonctionnalités :

 Commande en 1 clic

 Planification récurrente

 Multi-voitures / multi-adresses

 Historique commandes

 Notifications push

 Paiement (optionnel MVP)

5. 👷 Espace Équipe (PWA)

Fonctionnalités :

 Voir missions assignées

 Statuts :

 Assignée

 En route

 En cours

 Terminée

 Navigation vers client

 Upload photos (avant/après)

 Signature client (optionnel)

6. 🛠 BACKOFFICE ADMIN — (CŒUR DU BUSINESS)

6.1 📊 Dashboard global

KPIs en temps réel :

 Chiffre d’affaires (jour / mois)

 Nombre de commandes

 Commandes en cours

 Taux de complétion

 Panier moyen

 Clients actifs

 Revenus abonnements

👉 Graphiques :

 CA dans le temps

 Commandes par zone

 Performance équipes

6.2 📦 Gestion des commandes

Fonctionnalités :

 Liste complète des commandes

 Filtres :

 Date

 Zone

 Statut

 Type (voiture / maison)

 Détails commande :

 Client

 Adresse

 Services

 Équipe assignée

Actions :

 Assigner équipe

 Modifier créneau

 Annuler / rembourser

 Changer statut

6.3 👥 Gestion des clients (CRM)

Données client :

 Profil

 Historique commandes

 Fréquence d’achat

 Valeur totale (LTV)

Actions :

 Tagging (VIP, actif, dormant)

 Envoi promotions ciblées

 Support client

6.4 👷 Gestion des équipes

Gestion :

 Création équipes

 Affectation membres

 Planning

Performance :

 Nombre missions / jour

 Temps moyen intervention

 Taux satisfaction

 Revenus générés

6.5 🗺 Gestion des zones & tournées (ULTRA IMPORTANT)

Fonctionnalités :

 Découpage par zones

 Regroupement commandes

 Optimisation tournée

👉 Objectif :

 Réduire coûts déplacement

 Augmenter productivité

6.6 🧾 Gestion des services

Fonctionnalités :

 Créer / modifier services

 Définir prix

 Définir durée

 Ajouter options

6.7 📦 Gestion des packs / abonnements

Fonctionnalités :

 Création packs :

 Hebdo

 Mensuel

 Gestion abonnés

 Suivi utilisation

6.8 💰 Gestion financière (CRITIQUE)

Revenus :

 Commandes

 Abonnements

Dépenses :

 Salaires équipes

 Produits nettoyage

 Transport / carburant

 Marketing

Reporting :

 Profit brut

 Profit net

 Coût par commande

 Marge par service

6.9 📊 Analytics avancés

 Top services vendus

 Zones rentables

 Clients les plus actifs

 Taux rétention

6.10 📣 Marketing & notifications

Outils :

 Push notifications

 SMS / Email

Cas d’usage :

 Promotions

 Relance clients dormants

 Rappels automatiques

6.11 ⚙️ Gestion utilisateurs & rôles

Rôles :

 Admin

 Manager

 Support

 Opérations

Permissions :

 Accès par module

 Actions limitées

6.12 📂 Logs & historique

 Actions admin

 Modifications commandes

 Activité équipes

6.13 📤 Export & intégrations

 Export CSV / Excel

 API externe (comptabilité)

7. 🔄 Flux global

Client :

Réservation → Confirmation → Intervention → Feedback

Admin :

Commande → Assignation → Suivi → Analyse → Optimisation

Équipe :

Mission → Exécution → Validation → Upload preuve

8. 🗄 Base de données (simplifiée)

Tables :

 Users

 Clients

 Teams

 Orders

 Services

 Packages

 Subscriptions

 Expenses

 Revenues

 Notifications

9. 🔔 Notifications intelligentes

 Confirmation commande

 Équipe en route

 Fin mission

 Rappel automatique

 Upsell abonnement

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://go-clean-home.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9736002a-58a2-478a-bdae-14890402ba4e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
