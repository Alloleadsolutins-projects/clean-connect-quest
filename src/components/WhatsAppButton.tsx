import whatsappIcon from "@/assets/whatsapp-icon.png";
import { whatsappLink } from "@/lib/company";

const WhatsAppButton = () => (
  <a
    href={whatsappLink()}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
    aria-label="Contactez-nous sur WhatsApp"
  >
    <img src={whatsappIcon} alt="WhatsApp" className="h-14 w-14" />
  </a>
);

export default WhatsAppButton;
