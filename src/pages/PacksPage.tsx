import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WashPattern from "@/components/WashPattern";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Star, Phone } from "lucide-react";
import PackBookingWizard from "@/components/PackBookingWizard";
import { packs as fallbackPacks } from "@/data/packs";
import { COMPANY } from "@/lib/company";

const PacksPage = () => {
  const [openPack, setOpenPack] = useState<any | null>(null);
  const [packs, setPacks] = useState<any[]>(fallbackPacks);

  useEffect(() => {
    supabase.from("packs").select("*").eq("is_active", true).order("sort_order").then(({ data }) => {
      if (data && data.length) setPacks(data);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Packs Detailing Peintyhome</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Des packs peinture tout compris : préparation, peinture, protection et nettoyage du chantier.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background relative">
        <WashPattern className="text-primary" />
        <div className="container relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <Card key={pack.id || pack.slug} className={`relative overflow-hidden ${pack.popular ? "ring-2 ring-primary" : ""}`}>
                {pack.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <Star className="h-3 w-3" /> Populaire
                  </div>
                )}
                <CardContent className="p-6">
                  {pack.badge && (
                    <div className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-accent text-accent-foreground mb-2">
                      {pack.badge}
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-3">{pack.name}</h3>
                  <div className="mb-4">
                    <span className="block text-xs text-muted-foreground">À partir de</span>
                    <span className="text-3xl font-bold">{pack.price} <span className="text-base font-normal text-muted-foreground">DH</span></span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {(pack.features || []).map((f: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setOpenPack(pack)}>Demander</Button>
                    <a href={`tel:${COMPANY.phoneRaw}`}>
                      <Button variant="outline" size="icon"><Phone className="h-4 w-4" /></Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!openPack} onOpenChange={(v) => !v && setOpenPack(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Réserver un pack peinture</DialogTitle>
          </DialogHeader>
          {openPack && (
            <PackBookingWizard
              packs={packs}
              initialPack={openPack}
              onClose={() => setOpenPack(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PacksPage;
