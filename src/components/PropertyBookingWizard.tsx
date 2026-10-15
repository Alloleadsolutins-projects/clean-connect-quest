import { useState } from "react";
import { Check, ChevronLeft, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ServiceRequestForm from "./ServiceRequestForm";
import { OptionIcon } from "./icons/CustomIcons";
import type { ServiceWizardConfig, WizardOption, WizardFormule } from "@/data/serviceWizards";
import { usePricingOverrides } from "@/hooks/usePricingOverrides";

interface Props {
  serviceTitle: string;
  serviceSlug?: string;
  config: ServiceWizardConfig;
  onClose?: () => void;
}

interface SelectedItem {
  uid: string;
  option: WizardOption;
  shape?: "droit" | "L" | "U";
  surface?: string;
  bedType?: "1 place" | "2 places";
  faces?: "1 face" | "2 faces";
  places?: number;
}

// Biens pour lesquels forme / dimensions / type sont pertinents
const SHAPE_IDS = ["canape", "sedari"];
const PLACES_IDS = ["canape", "sedari", "chaises"];
const SURFACE_IDS = ["mur","plafond","chambre","salon","cuisine-sdb","facade","cloture","terrasse","immeuble","tadelakt","stuc","beton-cire","chaux","papier-peint","intisse","toile-verre","panneaux","mur-humide","sdb","piscine"];
const BED_IDS = ["matelas"];

let counter = 0;
const uid = () => `it-${++counter}`;

const PropertyBookingWizard = ({ serviceTitle, serviceSlug = "", config, onClose }: Props) => {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [formule, setFormule] = useState<WizardFormule | null>(null);
  const getPrice = usePricingOverrides(serviceSlug);

  // Empêche la page de sauter lors d'une sélection / ajout
  const keepScroll = (fn: () => void) => {
    const y = window.scrollY;
    fn();
    requestAnimationFrame(() => window.scrollTo({ top: y }));
  };

  const makeItem = (o: WizardOption): SelectedItem => ({
    uid: uid(),
    option: o,
    shape: SHAPE_IDS.includes(o.id) ? "droit" : undefined,
    bedType: BED_IDS.includes(o.id) ? "1 place" : undefined,
    faces: BED_IDS.includes(o.id) ? "1 face" : undefined,
    places: PLACES_IDS.includes(o.id) ? 2 : undefined,
  });

  const toggle = (o: WizardOption) =>
    keepScroll(() =>
      setItems((prev) =>
        prev.some((i) => i.option.id === o.id)
          ? prev.filter((i) => i.option.id !== o.id)
          : [...prev, makeItem(o)]
      )
    );

  const addAnother = (o: WizardOption) => keepScroll(() => setItems((prev) => [...prev, makeItem(o)]));
  const remove = (u: string) => keepScroll(() => setItems((prev) => prev.filter((i) => i.uid !== u)));

  const patch = (u: string, p: Partial<SelectedItem>) =>
    keepScroll(() => setItems((prev) => prev.map((i) => (i.uid === u ? { ...i, ...p } : i))));

  const multiplier =
    items.reduce(
      (sum, i) =>
        sum +
        (i.option.multiplier || 1) *
          (i.shape === "L" ? 1.2 : i.shape === "U" ? 1.4 : 1) *
          (i.places ? i.places / 2 : 1) *
          (i.faces === "2 faces" ? 1.5 : 1),
      0
    ) || 1;
  const basePrice = formule ? getPrice(serviceSlug, formule.slug, formule.price) : 0;
  const adjustedPrice = formule ? Math.round(basePrice * multiplier) : 0;
  const itemsLabel = items
    .map((i) => {
      const surface = i.surface ? ` ${i.surface} m²` : "";
      const bed = i.bedType ? ` (${i.bedType})` : "";
      const faces = i.faces ? ` — ${i.faces}` : "";
      const places = i.places ? ` — ${i.places} places` : "";
      return `${i.option.label}${i.shape && i.shape !== "droit" ? ` (forme ${i.shape})` : ""}${bed}${faces}${places}${surface}`;
    })
    .join(" | ");


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 pt-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition ${
                step > n ? "bg-primary text-primary-foreground" : step === n ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > n ? <Check className="h-4 w-4" /> : n}
            </div>
            {n < 3 && <div className={`h-0.5 w-8 ${step > n ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-2xl font-bold text-center mb-1">{config.step1.title}</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">Choix multiples possibles</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {config.step1.options.map((v) => {
              const selected = items.some((i) => i.option.id === v.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => toggle(v)}
                  className={`relative rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition hover:border-primary hover:shadow-lg ${
                    selected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <OptionIcon iconKey={v.iconKey} emoji={v.emoji} size="text-4xl" svgClass="h-10 w-10" />
                  <div className="font-semibold text-sm text-center">{v.label}</div>
                </button>
              );
            })}
          </div>

          {items.length > 0 && (
            <div className="mt-6 space-y-4">
              {items.map((i, idx) => {
                const sameCount = items.filter((x) => x.option.id === i.option.id).length;
                const rank = items.filter((x, k) => x.option.id === i.option.id && k <= idx).length;
                const isLastOfKind =
                  items.filter((x) => x.option.id === i.option.id).slice(-1)[0]?.uid === i.uid;
                return (
                  <div key={i.uid} className="rounded-xl border p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-sm">
                        <OptionIcon iconKey={i.option.iconKey} emoji={i.option.emoji} size="text-base inline" svgClass="h-5 w-5 inline-block mr-1 align-middle" />{" "}
                        {i.option.label}
                        {sameCount > 1 ? ` #${rank}` : ""}
                      </span>
                      <div className="flex items-center gap-2">
                        {sameCount > 1 && (
                          <button type="button" className="h-8 w-8 rounded-lg border flex items-center justify-center text-destructive" onClick={() => remove(i.uid)} aria-label="Supprimer">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {BED_IDS.includes(i.option.id) && (
                      <>
                        <div>
                          <Label className="text-xs">Type de matelas</Label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {(["1 place", "2 places"] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => patch(i.uid, { bedType: t })}
                                className={`rounded-lg border-2 py-2 text-sm font-semibold transition ${
                                  i.bedType === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Faces à nettoyer</Label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {(["1 face", "2 faces"] as const).map((f) => (
                              <button
                                key={f}
                                type="button"
                                onClick={() => patch(i.uid, { faces: f })}
                                className={`rounded-lg border-2 py-2 text-sm font-semibold transition ${
                                  i.faces === f ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                                }`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {SHAPE_IDS.includes(i.option.id) && (
                      <div>
                        <Label className="text-xs">Forme</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          {(["droit", "L", "U"] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => patch(i.uid, { shape: s })}
                              className={`rounded-lg border-2 py-2 text-sm font-semibold transition ${
                                i.shape === s ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                              }`}
                            >
                              {s === "droit" ? "Droit" : `Forme ${s}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {PLACES_IDS.includes(i.option.id) && (
                      <div>
                        <Label className="text-xs">Nombre de places</Label>
                        <div className="flex items-center gap-3 mt-1">
                          <button
                            type="button"
                            onClick={() => patch(i.uid, { places: Math.max(1, (i.places || 2) - 1) })}
                            className="h-9 w-9 rounded-lg border-2 border-border font-bold text-lg flex items-center justify-center hover:border-primary transition"
                            aria-label="Retirer une place"
                          >
                            −
                          </button>
                          <span className="min-w-10 text-center font-bold">{i.places || 2}</span>
                          <button
                            type="button"
                            onClick={() => patch(i.uid, { places: Math.min(12, (i.places || 2) + 1) })}
                            className="h-9 w-9 rounded-lg border-2 border-border font-bold text-lg flex items-center justify-center hover:border-primary transition"
                            aria-label="Ajouter une place"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {SURFACE_IDS.includes(i.option.id) && (
                      <div>
                        <Label className="text-xs">Surface (m²) — optionnel</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={i.surface || ""}
                          onChange={(e) => patch(i.uid, { surface: e.target.value })}
                          placeholder="Ex. 6"
                        />
                      </div>
                    )}

                    {isLastOfKind && (
                      <button
                        type="button"
                        onClick={() => addAnother(i.option)}
                        className="w-full rounded-lg border-2 border-dashed border-success bg-success/10 py-2 text-sm font-semibold text-success hover:bg-success/20 transition flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Ajouter un autre {i.option.label.toLowerCase()}
                      </button>
                    )}

                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90 transition"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-sm text-primary flex items-center gap-1 mb-3 hover:underline">
            <ChevronLeft className="h-4 w-4" /> Retour
          </button>
          <h3 className="text-2xl font-bold mb-1">Choisissez votre formule</h3>
          <p className="text-sm text-muted-foreground mb-4">{itemsLabel}</p>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {config.formules.map((p) => {
              const price = Math.round(getPrice(serviceSlug, p.slug, p.price) * multiplier);
              const selected = formule?.slug === p.slug;
              return (
                <button
                  key={p.slug}
                  onClick={() => { setFormule(p); setStep(3); }}
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
                  <ul className="space-y-1 mt-2">
                    {p.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && formule && (
        <div>
          <button onClick={() => setStep(2)} className="text-sm text-primary flex items-center gap-1 mb-3 hover:underline">
            <ChevronLeft className="h-4 w-4" /> Changer de formule
          </button>
          <h3 className="text-2xl font-bold mb-1">Détails de votre réservation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {itemsLabel} · <span className="font-semibold text-primary">{formule.name} — à partir de {adjustedPrice} DH</span>
          </p>
          <ServiceRequestForm
            defaultService={`${serviceTitle} — ${formule.name}`}
            compact
            extraContext={`• ${config.goodLabel} : ${itemsLabel}\n• Formule : ${formule.name}\n• Prix estimé : ${adjustedPrice} DH`}
            onSuccess={onClose}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyBookingWizard;
