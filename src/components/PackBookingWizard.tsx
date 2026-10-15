import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, Car, Search } from "lucide-react";
import ServiceRequestForm from "./ServiceRequestForm";
import { OptionIcon } from "./icons/CustomIcons";

interface Pack {
  slug?: string;
  name: string;
  badge?: string;
  price: number;
  popular?: boolean;
  features?: string[];
}

interface Props {
  packs: Pack[];
  initialPack?: Pack | null;
  onClose?: () => void;
}

const vehicleTypes = [
  { id: "citadine", label: "Citadine", emoji: "🚗", multiplier: 1, brands: true },
  { id: "berline", label: "Berline", emoji: "🚘", multiplier: 1.15, brands: true },
  { id: "suv-mini", label: "SUV Mini", emoji: "🚙", multiplier: 1.25, brands: true },
  { id: "grand-suv", label: "Grand SUV / 4x4", iconKey: "bigSuv" as const, multiplier: 1.4, brands: true },
  { id: "moto", label: "Moto", emoji: "🏍️", multiplier: 0.6, brands: false },
  { id: "utilitaire", label: "Utilitaire", emoji: "🚚", multiplier: 1.5, brands: false },
  { id: "camion", label: "Camion", emoji: "🚛", multiplier: 1.8, brands: false },
];

const brands = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Hyundai", "Kia",
  "Mercedes", "Nissan", "Peugeot", "Renault", "Seat", "Škoda", "Toyota",
  "Volkswagen", "Volvo", "Opel", "Land Rover", "Porsche", "Autre",
];

const PackBookingWizard = ({ packs, initialPack = null, onClose }: Props) => {
  const [step, setStep] = useState(initialPack ? 1 : 1);
  const [vehicle, setVehicle] = useState<typeof vehicleTypes[0] | null>(null);
  const [brand, setBrand] = useState<string>("");
  const [brandSearch, setBrandSearch] = useState("");
  const [pack, setPack] = useState<Pack | null>(initialPack);

  const filteredBrands = useMemo(
    () => brands.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase())),
    [brandSearch]
  );

  const adjustedPrice = pack && vehicle ? Math.round(pack.price * vehicle.multiplier) : 0;

  const goto = (n: number) => setStep(n);

  return (
    <div className="space-y-6">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition ${
                step > n ? "bg-primary text-primary-foreground" : step === n ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > n ? <Check className="h-4 w-4" /> : n}
            </div>
            {n < 4 && <div className={`h-0.5 w-8 ${step > n ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 : vehicle type */}
      {step === 1 && (
        <div>
          <h3 className="text-2xl font-bold text-center mb-6">Quel est votre type de véhicule ?</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {vehicleTypes.map((v) => (
              <button
                key={v.id}
                onClick={() => { setVehicle(v); setBrand(""); goto(v.brands ? 2 : 3); }}
                className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition hover:border-primary hover:shadow-lg ${
                  vehicle?.id === v.id ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <OptionIcon iconKey={(v as any).iconKey} emoji={v.emoji} size="text-4xl" svgClass="h-10 w-10" />
                <div className="font-semibold text-sm">{v.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 : brand */}
      {step === 2 && (
        <div>
          <button onClick={() => goto(1)} className="text-sm text-primary flex items-center gap-1 mb-3 hover:underline">
            <ChevronLeft className="h-4 w-4" /> Changer de véhicule
          </button>
          <h3 className="text-2xl font-bold mb-1">Sélectionnez la marque</h3>
          <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2"><Car className="h-4 w-4" /> {vehicle?.label}</p>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher une marque…" className="pl-9" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto">
            {filteredBrands.map((b) => (
              <button
                key={b}
                onClick={() => { setBrand(b); goto(3); }}
                className={`rounded-lg border-2 p-3 text-sm font-medium transition hover:border-primary hover:bg-primary/5 ${
                  brand === b ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 : pack (formule) */}
      {step === 3 && (
        <div>
          <button onClick={() => goto(vehicle?.brands ? 2 : 1)} className="text-sm text-primary flex items-center gap-1 mb-3 hover:underline">
            <ChevronLeft className="h-4 w-4" /> {vehicle?.brands ? "Changer de marque" : "Changer de véhicule"}
          </button>
          <h3 className="text-2xl font-bold mb-1">Choisissez votre formule</h3>
          <p className="text-sm text-muted-foreground mb-4">{[vehicle?.label, brand].filter(Boolean).join(" · ")}</p>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {packs.map((p) => {
              const price = Math.round(p.price * (vehicle?.multiplier || 1));
              const selected = pack?.name === p.name;
              return (
                <button
                  key={p.slug || p.name}
                  onClick={() => { setPack(p); goto(4); }}
                  className={`w-full text-left rounded-xl border-2 p-4 transition hover:border-primary hover:shadow-lg ${
                    selected ? "border-primary bg-primary/5" : "border-border"
                  } ${p.popular ? "relative" : ""}`}
                >
                  {p.popular && (
                    <span className="absolute -top-2 right-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      Populaire
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-lg">{p.name}</div>
                      {p.badge && <div className="text-xs text-muted-foreground">{p.badge}</div>}
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <div className="text-xs text-muted-foreground font-normal">À partir de</div>
                      <div className="text-2xl font-bold text-primary">{price} <span className="text-sm text-muted-foreground font-normal">DH</span></div>
                    </div>
                  </div>
                  {p.features && (
                    <ul className="space-y-1 mt-2">
                      {p.features.slice(0, 5).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4 : reservation form */}
      {step === 4 && pack && (
        <div>
          <button onClick={() => goto(3)} className="text-sm text-primary flex items-center gap-1 mb-3 hover:underline">
            <ChevronLeft className="h-4 w-4" /> Changer de formule
          </button>
          <h3 className="text-2xl font-bold mb-1">Détails de votre réservation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {[vehicle?.label, brand].filter(Boolean).join(" · ")} · <span className="font-semibold text-primary">{pack.name} — à partir de {adjustedPrice} DH</span>
          </p>
          <ServiceRequestForm
            defaultService={`${pack.name} — ${vehicle?.label}${brand ? " " + brand : ""}`}
            compact
            extraContext={`• Véhicule : ${vehicle?.label}\n${brand ? `• Marque : ${brand}\n` : ""}• Formule : ${pack.name}\n• Prix estimé : ${adjustedPrice} DH`}
            onSuccess={onClose}
          />
        </div>
      )}
    </div>
  );
};

export default PackBookingWizard;
