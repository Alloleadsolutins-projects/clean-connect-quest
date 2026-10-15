import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WashPattern from "@/components/WashPattern";
import { Shield, Award, Users, Heart, Leaf, Star } from "lucide-react";
import teamSection from "@/assets/team-section.jpg";
import happyClients from "@/assets/happy-clients.jpg";

const AboutPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <section className="relative py-20 bg-primary">
      <div className="container text-center">
        <h1 className="text-4xl font-bold text-primary-foreground mb-4">À propos de Peintyhome</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">
          Artisans peintres et décorateurs à Agadir et Marrakech
        </p>
      </div>
    </section>

    <section className="py-20 bg-background relative">
      <WashPattern className="text-primary" />
      <div className="container relative grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Notre histoire</h2>
          <p className="text-muted-foreground mb-4">
            Fondée en 2024, Peintyhome est née d'une vision simple : offrir des travaux de peinture soignés, propres et livrés à l'heure.
          </p>
          <p className="text-muted-foreground mb-4">
            Notre équipe de professionnels formés utilise des peintures certifiées et des techniques d'artisan pour garantir un résultat impeccable à chaque intervention.
          </p>
          <p className="text-muted-foreground">
            Aujourd'hui, Peintyhome est présente dans plusieurs villes du Maroc et compte plus de 5 000 clients satisfaits.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img src={teamSection} alt="Équipe Peintyhome" className="w-full h-auto" loading="lazy" />
        </div>
      </div>
    </section>

    <section className="py-20 bg-secondary">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Star, title: "Excellence", desc: "Nous visons la perfection dans chaque intervention" },
            { icon: Leaf, title: "Éco-responsabilité", desc: "Des produits biodégradables et 90% d'eau économisée" },
            { icon: Heart, title: "Satisfaction client", desc: "Votre satisfaction est notre priorité absolue" },
            { icon: Shield, title: "Confiance", desc: "Personnel vérifié et assuré pour votre tranquillité" },
            { icon: Users, title: "Proximité", desc: "Un service local, humain et accessible à tous" },
            { icon: Award, title: "Professionnalisme", desc: "Formation continue et équipements de pointe" },
          ].map((v, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-card">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <v.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-background">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img src={happyClients} alt="Clients satisfaits" className="w-full h-auto" loading="lazy" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Notre mission</h2>
          <p className="text-muted-foreground mb-4">
            Embellir chaque maison avec des couleurs durables et des finitions irréprochables.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              { value: "5,000+", label: "Clients" },
              { value: "15,000+", label: "Chantiers" },
              { value: "98%", label: "Satisfaction" },
              { value: "50+", label: "Pros" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-accent text-center">
                <div className="text-2xl font-bold text-accent-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <Footer />
    <WhatsAppButton />
  </div>
);

export default AboutPage;
