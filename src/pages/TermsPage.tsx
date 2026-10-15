import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const TermsPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <section className="py-20 bg-primary">
      <div className="container text-center">
        <h1 className="text-4xl font-bold text-primary-foreground mb-4">Conditions Générales</h1>
        <p className="text-primary-foreground/80">Dernière mise à jour : Avril 2026</p>
      </div>
    </section>

    <section className="py-16 bg-background">
      <div className="container max-w-3xl prose prose-sm">
        <h2 className="text-2xl font-bold mb-4">1. Objet</h2>
        <p className="text-muted-foreground mb-6">
          Les présentes conditions générales régissent l'utilisation de la plateforme Peintyhome et les services de peinture, décoration et rénovation proposés. En utilisant nos services, vous acceptez l'intégralité de ces conditions.
        </p>

        <h2 className="text-2xl font-bold mb-4">2. Services proposés</h2>
        <p className="text-muted-foreground mb-6">
          Peintyhome propose des services de peinture intérieure et extérieure, décoration murale, tadelakt et rénovation. Les détails, prix et durées de chaque service sont indiqués sur notre plateforme. Les prix sont exprimés en Dirhams (DH) et incluent toutes les taxes applicables.
        </p>

        <h2 className="text-2xl font-bold mb-4">3. Réservation</h2>
        <p className="text-muted-foreground mb-6">
          Les réservations peuvent être effectuées via notre plateforme ou par téléphone. Chaque réservation est confirmée par email ou SMS. L'annulation est gratuite jusqu'à 2 heures avant le créneau prévu.
        </p>

        <h2 className="text-2xl font-bold mb-4">4. Paiement</h2>
        <p className="text-muted-foreground mb-6">
          Le paiement s'effectue après la réalisation du service. Nous acceptons le paiement en espèces et par virement bancaire. Un reçu est fourni après chaque prestation.
        </p>

        <h2 className="text-2xl font-bold mb-4">5. Garantie de satisfaction</h2>
        <p className="text-muted-foreground mb-6">
          Si le résultat ne vous satisfait pas, nous nous engageons à corriger les finitions gratuitement ou à vous rembourser intégralement.
        </p>

        <h2 className="text-2xl font-bold mb-4">6. Responsabilité</h2>
        <p className="text-muted-foreground mb-6">
          Peintyhome s'engage à fournir un service de qualité. Notre personnel est assuré et formé. En cas de dommage constaté, une procédure d'indemnisation sera engagée.
        </p>

        <h2 className="text-2xl font-bold mb-4">7. Protection des données</h2>
        <p className="text-muted-foreground mb-6">
          Vos données personnelles sont traitées conformément à la loi 09-08 relative à la protection des données à caractère personnel. Elles ne sont jamais partagées avec des tiers.
        </p>

        <h2 className="text-2xl font-bold mb-4">8. Contact</h2>
        <p className="text-muted-foreground mb-6">
          Pour toute question relative à ces conditions, contactez-nous à contact@peintyhome.ma ou au +212 6 00 00 00 00.
        </p>
      </div>
    </section>

    <Footer />
    <WhatsAppButton />
  </div>
);

export default TermsPage;
