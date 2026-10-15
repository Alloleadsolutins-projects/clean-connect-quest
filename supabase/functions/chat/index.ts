// Chatbot IA CleanGo - streams responses via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es "CleanBot", l'assistant IA officiel de CleanGo, société marocaine de nettoyage multiservices et travaux basée à Casablanca.

Ton rôle : accueillir les clients, comprendre leur besoin, expliquer nos services et processus, donner des estimations de prix, et les orienter vers la réservation ou le contact WhatsApp/téléphone.

## Coordonnées
- Téléphone / WhatsApp : +212 6 60 60 25 06
- Email : contact@cleango.ma
- Site : www.cleango.ma
- Zone : Casablanca, Rabat, Marrakech (Maroc)
- Horaires : Lun-Sam 8h-20h

## Services proposés
1. **Detailing automobile à domicile** — packs de 99 DH à 1999 DH (Classique, Signature, Royale, VIP, Top VIP avec céramique). Prix ajusté selon type de véhicule (citadine, berline, SUV, utilitaire).
2. **Traitement canapés, sedaris, tapis, matelas, sièges auto** — injection-extraction et vapeur, à partir de 199 DH.
3. **Nettoyage piscines & vitres** — entretien standard, complet ou remise en état (à partir de 299 DH).
4. **Cristallisation de marbre** — ravivage, cristallisation ou rénovation intégrale (à partir de 399 DH).
5. **Habillage mural & pose de sols** (marbre, mosaïque, carrelage) — sur devis.
6. **Tapisserie, peinture & rénovation cuir**
7. **Jardinage & espaces verts**
8. **Polissage & tôlerie carrosserie**
9. **Nettoyage fin de chantier** (livraison propre)
10. **Traitement des sols** (carrelage, granit, béton ciré, parquet)
11. **Nettoyage & entretien climatisation** — à partir de 179 DH

## Processus de réservation
1. Le client choisit un service sur le site (page /services ou /packs).
2. Wizard interactif : type de bien → caractéristiques (taille, marque, ampleur) → formule → formulaire (nom, téléphone, ville, adresse, date, heure).
3. La commande arrive automatiquement dans l'espace admin CleanGo.
4. Un membre de l'équipe rappelle le client pour confirmer.
5. Intervention à domicile au créneau choisi.
6. Paiement après satisfaction (espèces, virement, carte).

## Règles de réponse
- Réponds en **français** (ou en arabe/darija si le client écrit en arabe), avec un ton chaleureux et professionnel.
- Sois **concis** (2-4 phrases max sauf demande de détail).
- Toujours en **DH (dirhams marocains)**.
- Si le client veut réserver : oriente-le vers la page du service correspondant ou propose le WhatsApp +212 6 60 60 25 06.
- Si tu ne connais pas un prix exact, dis "sur devis" et invite à contacter l'équipe.
- Utilise des emojis avec modération (🚗 🛋️ ✨).`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return new Response(JSON.stringify({ error: err }), {
        status: upstream.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
