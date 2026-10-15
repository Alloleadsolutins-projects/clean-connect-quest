import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Phone, Send, Calendar, Clock, Camera, X } from "lucide-react";
import { COMPANY, CITIES, whatsappLink } from "@/lib/company";
import { supabase } from "@/integrations/supabase/client";
import LocationPicker, { type LocationValue } from "./LocationPicker";

interface Props {
  defaultService?: string;
  compact?: boolean;
  extraContext?: string;
  onSuccess?: () => void;
}

const ServiceRequestForm = ({ defaultService = "", compact = false, extraContext = "", onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [location, setLocation] = useState<LocationValue>({ address: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    service: defaultService,
    category: "Particulier",
    date: "",
    time: "",
    remarque: "",
  });

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    if (list.length !== files.length) toast.error("Images de plus de 10 Mo ignorées");
    setPhotos((prev) => [...prev, ...list].slice(0, 6));
  };

  const uploadPhotos = async () => {
    const urls: string[] = [];
    for (const file of photos) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^\w.\-]/g, "_")}`;
      const { error } = await supabase.storage.from("order-photos").upload(path, file);
      if (error) continue;
      const { data } = await supabase.storage.from("order-photos").createSignedUrl(path, 60 * 60 * 24 * 30);
      if (data?.signedUrl) urls.push(data.signedUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Nom et téléphone sont obligatoires");
      return;
    }
    setLoading(true);
    try {
      const { data: services } = await supabase
        .from("services")
        .select("id, name")
        .eq("is_active", true)
        .limit(1);
      const serviceId = services?.[0]?.id ?? null;

      const scheduledAt = form.date
        ? new Date(`${form.date}T${form.time || "10:00"}:00`).toISOString()
        : new Date().toISOString();

      const mapsLink =
        location.latitude && location.longitude
          ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
          : "";
      const fullAddress = [location.address, form.city].filter(Boolean).join(", ") || "Non renseignée";

      const photoUrls = photos.length ? await uploadPhotos() : [];
      const photosBlock = photoUrls.length
        ? `\nPhotos client :\n${photoUrls.map((u, i) => `${i + 1}. ${u}`).join("\n")}`
        : "";

      const priceMatch = extraContext.match(/Prix estim\u00e9\s*:\s*([\d.,]+)/);
      const estimatedPrice = priceMatch ? Number(priceMatch[1].replace(",", ".")) : 0;

      const { error: orderError } = await supabase.from("orders").insert({
        service_id: serviceId,
        service_label: form.service || defaultService || "Demande générale",
        city: form.city || null,
        address: fullAddress,
        scheduled_at: scheduledAt,
        total_price: estimatedPrice,
        status: "pending",
        guest_name: form.name,
        guest_phone: form.phone,
        photo_urls: photoUrls,
        notes: `Service: ${form.service || defaultService || "—"}\nCatégorie: ${form.category}\n${extraContext}${
          mapsLink ? `\nGPS: ${location.latitude}, ${location.longitude}\nCarte: ${mapsLink}` : ""
        }\nRemarque: ${form.remarque || "—"}`,
      });
      if (orderError) console.error("order insert", orderError.message);

      const msg = `Bonjour Peintyhome,\n\nNouvelle réservation :\n• Nom : ${form.name}\n• Téléphone : ${form.phone}\n• Ville : ${form.city || "—"}\n• Adresse : ${location.address || "—"}${mapsLink ? `\n• Position GPS : ${mapsLink}` : ""}\n• Service : ${form.service || "—"}\n• Catégorie : ${form.category}\n• Date : ${form.date || "à convenir"}${form.time ? ` à ${form.time}` : ""}\n${extraContext ? extraContext + "\n" : ""}• Remarque : ${form.remarque || "—"}${photosBlock}`;
      const link = whatsappLink(msg);
      const win = window.open(link, "_blank");
      if (!win) {
        toast.success("Réservation enregistrée", {
          description: "Cliquez pour envoyer les détails sur WhatsApp",
          action: { label: "Envoyer", onClick: () => window.open(link, "_blank") },
          duration: 15000,
        });
      } else {
        toast.success("Réservation envoyée ! Nous vous contactons rapidement.");
      }
      onSuccess?.();
    } catch (err: any) {
      toast.error("Erreur d'envoi, réessayez.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        <div>
          <Label htmlFor="rf-name">Nom complet *</Label>
          <Input id="rf-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex. Ahmed Bennani" />
        </div>
        <div>
          <Label htmlFor="rf-phone"><Phone className="h-3 w-3 inline mr-1" />Téléphone *</Label>
          <Input id="rf-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 6..." />
        </div>
      </div>
      <div>
        <Label>Ville (optionnel)</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm({ ...form, city: form.city === c ? "" : c })}
              className={`rounded-lg border-2 py-2 text-sm font-semibold transition ${
                form.city === c ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <LocationPicker value={location} onChange={setLocation} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="rf-date"><Calendar className="h-3 w-3 inline mr-1" />Date (optionnel)</Label>
          <Input id="rf-date" type="date" min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="rf-time"><Clock className="h-3 w-3 inline mr-1" />Heure (optionnel)</Label>
          <Input id="rf-time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
      </div>

      <div className={compact ? "" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {!defaultService && (
          <div>
            <Label htmlFor="rf-service">Service voulu</Label>
            <Input id="rf-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="Ex. Lavage complet" />
          </div>
        )}
        <div>
          <Label>Catégorie</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Particulier">Particulier</SelectItem>
              <SelectItem value="Professionnel">Professionnel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="rf-photos"><Camera className="h-3 w-3 inline mr-1" />Photos de l'état du bien (caméra — 6 max)</Label>
        <Input id="rf-photos" type="file" accept="image/*" capture="environment" multiple onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
        <p className="text-xs text-muted-foreground mt-1">Prenez les photos directement avec votre caméra : le prix final est confirmé après réception des photos.</p>
        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
            {photos.map((f, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden border aspect-square">
                <img src={URL.createObjectURL(f)} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, k) => k !== i))}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/90 border flex items-center justify-center"
                  aria-label="Retirer la photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="rf-remarque">Remarque</Label>
        <Textarea id="rf-remarque" value={form.remarque} onChange={(e) => setForm({ ...form, remarque: e.target.value })} placeholder="Précisions…" rows={2} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          <Send className="h-4 w-4 mr-2" /> {loading ? "Envoi..." : "Passer la commande"}
        </Button>
        <a href={`tel:${COMPANY.phoneRaw}`} className="flex-1">
          <Button type="button" variant="outline" className="w-full">
            <Phone className="h-4 w-4 mr-2" /> Appeler
          </Button>
        </a>
      </div>
    </form>
  );
};

export default ServiceRequestForm;
