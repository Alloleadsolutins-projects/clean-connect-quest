import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Printer, Trash2 } from "lucide-react";
import { COMPANY } from "@/lib/company";
import logo from "@/assets/peintyhome-logo.png";

export type DocType = "devis" | "facture";

interface Line {
  label: string;
  qty: number;
  price: number;
}

interface Props {
  order: any | null;
  type: DocType;
  onClose: () => void;
}

const money = (n: number) => `${Number(n || 0).toLocaleString("fr-FR")} DH`;

const OrderDocumentDialog = ({ order, type, onClose }: Props) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [vatRate, setVatRate] = useState(0);

  useEffect(() => {
    if (!order) return;
    setLines([
      {
        label: order.service_label || order.services?.name || "Prestation de peinture",
        qty: 1,
        price: Number(order.total_price || 0),
      },
    ]);
    setClient(order.guest_name || "Client");
    setPhone(order.guest_phone || "");
    setAddress([order.address, order.city].filter(Boolean).join(" — "));
    setNumber(
      `${type === "devis" ? "DEV" : "FAC"}-${new Date().getFullYear()}-${String(order.id).slice(0, 6).toUpperCase()}`
    );
  }, [order, type]);

  const subtotal = lines.reduce((s, l) => s + Number(l.qty || 0) * Number(l.price || 0), 0);
  const vat = Math.round(subtotal * (Number(vatRate) / 100));
  const total = subtotal + vat;

  const patch = (idx: number, p: Partial<Line>) =>
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...p } : l)));

  const print = () => {
    const title = type === "devis" ? "DEVIS" : "FACTURE";
    const rows = lines
      .map(
        (l, i) => `<tr>
          <td>${i + 1}</td>
          <td>${l.label}</td>
          <td class="c">${l.qty}</td>
          <td class="r">${money(l.price)}</td>
          <td class="r">${money(Number(l.qty) * Number(l.price))}</td>
        </tr>`
      )
      .join("");

    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>${title} ${number}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:Helvetica,Arial,sans-serif;color:#1c2b33;margin:0;padding:32px}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0ea5b7;padding-bottom:16px}
  .logo{height:64px}
  .co{font-size:12px;line-height:1.5;text-align:right}
  .co b{font-size:16px}
  h1{font-size:26px;letter-spacing:2px;margin:24px 0 4px}
  .meta{font-size:12px;color:#5b6b76;margin-bottom:24px}
  .client{background:#f3f8fa;border-radius:8px;padding:14px;font-size:13px;line-height:1.6;margin-bottom:24px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{background:#0ea5b7;color:#fff;text-align:left;padding:9px}
  td{padding:9px;border-bottom:1px solid #e2ebef}
  .r{text-align:right}.c{text-align:center}
  .tot{margin-top:16px;margin-left:auto;width:280px;font-size:13px}
  .tot div{display:flex;justify-content:space-between;padding:6px 0}
  .tot .grand{border-top:2px solid #0ea5b7;font-size:16px;font-weight:bold}
  footer{margin-top:40px;font-size:11px;color:#5b6b76;text-align:center;border-top:1px solid #e2ebef;padding-top:12px}
  @media print{body{padding:0}}
</style></head><body>
  <div class="head">
    <img class="logo" src="${window.location.origin}${logo}" alt="${COMPANY.name}">
    <div class="co">
      <b>${COMPANY.name}</b><br>${COMPANY.tagline}<br>
      ${COMPANY.address}<br>${COMPANY.phone}<br>${COMPANY.email} · ${COMPANY.website}
    </div>
  </div>
  <h1>${title}</h1>
  <div class="meta">N° ${number} · Date : ${new Date().toLocaleDateString("fr-FR")}${
      order?.scheduled_at
        ? ` · Intervention prévue : ${new Date(order.scheduled_at).toLocaleDateString("fr-FR")}`
        : ""
    }</div>
  <div class="client"><b>Client</b><br>${client}${phone ? `<br>Tél : ${phone}` : ""}${
      address ? `<br>Adresse : ${address}` : ""
    }</div>
  <table>
    <thead><tr><th>#</th><th>Prestation</th><th class="c">Qté</th><th class="r">Prix unitaire</th><th class="r">Total</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="tot">
    <div><span>Sous-total</span><span>${money(subtotal)}</span></div>
    ${vatRate ? `<div><span>TVA (${vatRate}%)</span><span>${money(vat)}</span></div>` : ""}
    <div class="grand"><span>Total ${type === "devis" ? "estimé" : "à payer"}</span><span>${money(total)}</span></div>
  </div>
  <footer>
    ${type === "devis" ? "Devis valable 30 jours. Le prix final est confirmé après constat de l'état du bien." : "Merci de votre confiance."}<br>
    ${COMPANY.name} — ${COMPANY.address} — ${COMPANY.phone} — ${COMPANY.email}
  </footer>
  <script>window.onload=function(){window.print()}</script>
</body></html>`;

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  return (
    <Dialog open={!!order} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type === "devis" ? "Devis" : "Facture"} — {number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Numéro</Label>
              <Input value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Client</Label>
              <Input value={client} onChange={(e) => setClient(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Téléphone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Adresse</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Prestations & montants</Label>
            {lines.map((l, i) => (
              <div key={i} className="flex flex-wrap gap-2 items-center">
                <Input
                  className="flex-1 min-w-[160px]"
                  value={l.label}
                  onChange={(e) => patch(i, { label: e.target.value })}
                  placeholder="Prestation"
                />
                <Input
                  className="w-20"
                  type="number"
                  min="1"
                  value={l.qty}
                  onChange={(e) => patch(i, { qty: Number(e.target.value) })}
                />
                <Input
                  className="w-28"
                  type="number"
                  min="0"
                  value={l.price}
                  onChange={(e) => patch(i, { price: Number(e.target.value) })}
                  placeholder="DH"
                />
                <Button variant="ghost" size="icon" onClick={() => setLines(lines.filter((_, k) => k !== i))} aria-label="Supprimer la ligne">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setLines([...lines, { label: "", qty: 1, price: 0 }])}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter une ligne
            </Button>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <Label className="text-xs">TVA (%)</Label>
              <Input className="w-24" type="number" min="0" value={vatRate} onChange={(e) => setVatRate(Number(e.target.value))} />
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-muted-foreground">Sous-total : {money(subtotal)}</p>
              {!!vatRate && <p className="text-sm text-muted-foreground">TVA : {money(vat)}</p>}
              <p className="text-lg font-bold">Total : {money(total)}</p>
            </div>
          </div>

          <Button className="w-full" onClick={print}>
            <Printer className="h-4 w-4 mr-2" /> Imprimer / Enregistrer en PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDocumentDialog;
