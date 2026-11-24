// Único punto de verdad para todos los botones que envían a WhatsApp.
// Un clic = un fetch a ClinicMate + una conversión + una pestaña de WhatsApp.
// El GCLID y el envío dependen del consentimiento de publicidad.

import { hasPurpose } from "./cookie-consent";
import { generateRef, getGclid, postEvent } from "./gclid-collector";

const WHATSAPP_NUMBER = "+34676466092";
const CONVERSION_LABEL = "AW-16915885750/4elzCMWn76caELbdj4I_";
const DOUBLE_CLICK_GUARD_MS = 300;

export interface WhatsAppTracking {
  currentRef: string | null;
  track: (source: string) => { ref: string; gclid: string | null };
}

declare global {
  interface Window {
    WhatsAppTracking: WhatsAppTracking;
    dataLayer: any[];
    gtag?: (...args: unknown[]) => void;
  }
}

function trackWhatsAppEvent(
  source: string,
): { ref: string; gclid: string | null } {
  const ref = generateRef();
  const gclid = getGclid();
  const now = new Date();

  window.WhatsAppTracking.currentRef = ref;

  // Doble garantía: Consent Mode ya bloquea el tag, y aquí solo se dispara
  // con consentimiento explícito de publicidad.
  if (hasPurpose("advertising") && typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: CONVERSION_LABEL });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "whatsapp_click",
    gclid,
    ref,
    button_location: source,
    click_date: now.toLocaleDateString("es-ES"),
    click_time: now.toLocaleTimeString("es-ES"),
  });

  postEvent(gclid, ref);

  return { ref, gclid };
}

function openGenericWhatsApp(ref: string): void {
  const text = `(ref: ${ref}) Hola Kristian, me gustaría tener una primera conversación sin coste. ¿Cómo funciona?`;
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

let lastTarget: Element | null = null;
let lastClickAt = 0;

function handleClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const btn = target.closest<HTMLElement>("[data-whatsapp-button]");
  if (!btn) return;

  const now = Date.now();
  if (btn === lastTarget && now - lastClickAt < DOUBLE_CLICK_GUARD_MS) return;
  lastTarget = btn;
  lastClickAt = now;

  const source = btn.dataset.whatsappSource || "desconocido";
  const { ref } = trackWhatsAppEvent(source);

  // El formulario abre su propia URL con nombre/email/mensaje.
  if (source === "formulario") return;

  event.preventDefault();
  openGenericWhatsApp(ref);
}

window.WhatsAppTracking = {
  currentRef: null,
  track: trackWhatsAppEvent,
};

// Listener único en captura (corre antes que el resto de handlers).
if (!document.documentElement.dataset.whatsappTrackingReady) {
  document.documentElement.dataset.whatsappTrackingReady = "true";
  document.addEventListener("click", handleClick, true);
}
