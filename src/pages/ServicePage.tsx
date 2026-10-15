import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WashPattern from "@/components/WashPattern";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Phone, Star } from "lucide-react";
import ServiceRequestForm from "@/components/ServiceRequestForm";
import PackBookingWizard from "@/components/PackBookingWizard";
import PropertyBookingWizard from "@/components/PropertyBookingWizard";
import { serviceWizards, hasWizard } from "@/data/serviceWizards";
import { packs as fallbackPacks } from "@/data/packs";
import { allServices, findService } from "@/data/services";
import { COMPANY } from "@/lib/company";
import { useServiceImageOverrides } from "@/hooks/useServiceImageOverrides";

export { allServices } from "@/data/services";

const ServicePage = () => {
  const { slug } = useParams();
  const service = findService(slug);
  const getImage = useServiceImageOverrides();
  const [linkedPacks, setLinkedPacks] = useState<any[]>([]);
  const isAuto = slug === "detailing-automobile";
  const wizardConfig = slug ? serviceWizards[slug] : undefined;

  useEffect(() => {
    if (!service) return;
    (async () => {
      const { data: dbSvc } = await supabase.from("services").select("id").ilike("name", service.title).maybeSingle();
      if (dbSvc) {
        const { data: ps } = await supabase.from("pack_services").select("packs(*)").eq("service_id", dbSvc.id);
        const packs = (ps || []).map((x: any) => x.packs).filter(Boolean).filter((p: any) => p.is_active !== false);
        if (packs.length) { setLinkedPacks(packs); return; }
      }
      if (service.category === "auto") {
        const { data } = await supabase.from("packs").select("*").eq("is_active", true).order("sort_order");
        setLinkedPacks(data || []);
      }
    })();
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
            <Link to="/services"><Button>Voir tous les services</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative">
        <div className="absolute inset-0">
          <img src={getImage(service.title, service.image)} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="container relative py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-primary-foreground text-sm font-medium mb-3">{service.clientType}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 max-w-3xl mx-auto">{service.title}</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">{service.description}</p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
            <span className="text-2xl font-bold text-primary-foreground">{service.price}</span>
            <span className="flex items-center gap-2 text-primary-foreground/70">
              <Clock className="h-5 w-5" /> {service.duration}
            </span>
            <a href={`tel:${COMPANY.phoneRaw}`}>
              <Button variant="secondary"><Phone className="h-4 w-4 mr-2" /> {COMPANY.phone}</Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Tarifs À partir de 99 DH — le prix final sera communiqué après l'insertion des photos de l'état du bien.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background relative">
        <WashPattern className="text-primary" />
        <div className="container relative grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Ce qui est inclus</h2>
            <ul className="space-y-3 mb-10">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

          </div>


          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">
                  {isAuto || wizardConfig ? "Wizard de réservation" : "Demande de service"}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {isAuto
                    ? "Choisissez votre véhicule, votre marque et votre formule en quelques clics."
                    : wizardConfig
                      ? `Sélectionnez votre ${wizardConfig.goodLabel.toLowerCase()}, ses caractéristiques et votre formule.`
                      : "Remplissez le formulaire — nous vous rappelons pour confirmer et planifier l'intervention."}
                </p>
                {isAuto ? (
                  <PackBookingWizard packs={(linkedPacks.length ? linkedPacks : fallbackPacks) as any} />
                ) : wizardConfig ? (
                  <PropertyBookingWizard serviceTitle={service.title} serviceSlug={slug} config={wizardConfig} />
                ) : (
                  <ServiceRequestForm defaultService={service.title} />
                )}
              </CardContent>
            </Card>

            {!isAuto && !wizardConfig && linkedPacks.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-1">Packs disponibles pour ce service</h2>
                <p className="text-sm text-muted-foreground mb-4">Ajoutez un pack à votre demande.</p>
                <div className="space-y-3">
                  {linkedPacks.map((p) => (
                    <Card key={p.id} className={p.popular ? "ring-2 ring-primary" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold">{p.name}</h3>
                              {p.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{p.badge}</span>}
                              {p.popular && <Star className="h-4 w-4 fill-warning text-warning" />}
                            </div>
                          </div>
                          <span className="text-right whitespace-nowrap">
                            <span className="block text-[10px] text-muted-foreground">À partir de</span>
                            <span className="text-lg font-bold">{p.price} <span className="text-xs font-normal text-muted-foreground">DH</span></span>
                          </span>
                        </div>
                        {(p.features || []).length > 0 && (
                          <ul className="space-y-1.5 mt-2">
                            {(p.features as string[]).slice(0, 3).map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-2">Autres services Peintyhome</h2>
          <p className="text-muted-foreground mb-6">Suggestions complémentaires — ajoutez-les à votre demande.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allServices.filter((s) => s.slug !== slug).map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4">
                    <s.icon className="h-5 w-5 text-primary mb-2" />
                    <h3 className="text-sm font-semibold leading-snug">{s.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{s.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>



      <section className="py-8 bg-background">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto rounded-xl border border-dashed p-4">
            Tarifs <span className="font-semibold text-foreground">{service.price}</span> — le prix final sera
            communiqué après l'insertion des photos de l'état du bien.
          </p>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ServicePage;
