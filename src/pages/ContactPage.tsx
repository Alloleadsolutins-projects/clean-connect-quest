import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WashPattern from "@/components/WashPattern";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Globe, Instagram, Facebook } from "lucide-react";
import ServiceRequestForm from "@/components/ServiceRequestForm";
import { COMPANY } from "@/lib/company";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Contactez Peintyhome</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {COMPANY.tagline} — {COMPANY.slogan}
          </p>
        </div>
      </section>

      <section className="py-20 bg-background relative">
        <WashPattern className="text-primary" />
        <div className="container relative grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Demande de service ou devis</h2>
            <ServiceRequestForm />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-2">Nos coordonnées</h2>
            {[
              { icon: Phone, title: "Téléphone", text: COMPANY.phone, href: `tel:${COMPANY.phoneRaw}` },
              { icon: Mail, title: "Email", text: COMPANY.email, href: `mailto:${COMPANY.email}` },
              { icon: Globe, title: "Site web", text: COMPANY.website },
              { icon: Instagram, title: "Instagram", text: `@${COMPANY.instagram}` },
              { icon: Facebook, title: "Facebook", text: COMPANY.facebook },
              { icon: MapPin, title: "Adresse", text: COMPANY.address },
              { icon: Clock, title: "Horaires", text: COMPANY.hours },
            ].map((item, i) => {
              const Inner = (
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </CardContent>
                </Card>
              );
              return item.href ? <a key={i} href={item.href}>{Inner}</a> : <div key={i}>{Inner}</div>;
            })}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ContactPage;
