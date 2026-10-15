import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocateFixed, MapPin, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface LocationValue {
  address: string;
  latitude?: number;
  longitude?: number;
}

interface Props {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
}

const DEFAULT_CENTER: [number, number] = [30.4278, -9.5981]; // Agadir

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="width:22px;height:22px;border-radius:50%;background:hsl(var(--primary));border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const LocationPicker = ({ value, onChange }: Props) => {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [busy, setBusy] = useState<"gps" | "search" | null>(null);
  const [query, setQuery] = useState("");

  const setPoint = (lat: number, lng: number, address?: string) => {
    onChange({ address: address ?? value.address, latitude: lat, longitude: lng });
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16);
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else markerRef.current = L.marker([lat, lng], { icon: markerIcon, draggable: true })
        .addTo(mapRef.current)
        .on("dragend", (e) => {
          const p = (e.target as L.Marker).getLatLng();
          reverse(p.lat, p.lng);
        });
    }
  };

  const reverse = async (lat: number, lng: number) => {
    setPoint(lat, lng);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
      );
      const data = await res.json();
      if (data?.display_name) setPoint(lat, lng, data.display_name);
    } catch {
      /* adresse manuelle possible */
    }
  };

  useEffect(() => {
    if (!showMap || !mapEl.current || mapRef.current) return;
    const start: [number, number] =
      value.latitude && value.longitude ? [value.latitude, value.longitude] : DEFAULT_CENTER;
    const map = L.map(mapEl.current).setView(start, value.latitude ? 16 : 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    map.on("click", (e: L.LeafletMouseEvent) => reverse(e.latlng.lat, e.latlng.lng));
    mapRef.current = map;
    if (value.latitude && value.longitude) setPoint(value.latitude, value.longitude, value.address);
    setTimeout(() => map.invalidateSize(), 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const useGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée par votre navigateur");
      return;
    }
    setBusy("gps");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setShowMap(true);
        await reverse(pos.coords.latitude, pos.coords.longitude);
        setBusy(null);
        toast.success("Position détectée");
      },
      () => {
        setBusy(null);
        toast.error("Impossible d'obtenir votre position. Saisissez l'adresse ou utilisez la carte.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const search = async () => {
    const q = query.trim() || value.address.trim();
    if (!q) return;
    setBusy("search");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=fr&q=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      if (data?.[0]) {
        setShowMap(true);
        setTimeout(() => setPoint(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name), 250);
        toast.success("Adresse localisée");
      } else {
        toast.error("Adresse introuvable — vous pouvez la saisir librement.");
      }
    } catch {
      toast.error("Recherche indisponible");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="lp-address">Adresse / localisation (optionnel)</Label>
      <div className="flex gap-2">
        <Input
          id="lp-address"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
          placeholder="Rue, quartier, ville…"
        />
        <Button type="button" variant="outline" size="icon" onClick={() => { setQuery(value.address); search(); }} title="Localiser cette adresse">
          {busy === "search" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={useGPS} disabled={busy === "gps"}>
          {busy === "gps" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LocateFixed className="h-4 w-4 mr-2" />}
          Ma position actuelle
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={() => setShowMap((s) => !s)}>
          <MapPin className="h-4 w-4 mr-2" /> {showMap ? "Masquer la carte" : "Choisir sur la carte"}
        </Button>
      </div>

      {showMap && (
        <div className="space-y-2">
          <div ref={mapEl} className="h-64 w-full rounded-xl overflow-hidden border border-border z-0" />
          <p className="text-xs text-muted-foreground">
            Cliquez sur la carte ou déplacez le repère pour préciser votre emplacement.
          </p>
        </div>
      )}

      {value.latitude && value.longitude && (
        <p className="text-xs text-primary font-medium">
          📍 Position enregistrée : {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
