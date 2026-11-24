// Recogida de GCLID y envío a ClinicMate.
// Nada se ejecuta hasta que el usuario acepta la finalidad "publicidad".

import { hasPurpose, onChange } from "./cookie-consent";

const SITE_KEY = "10.s2vs9zah5ises7v1dvro";
const CLINICMATE_ENDPOINT = "https://pro.clinicmate.es/api/v1/whatsapp-refs/events";
const GCLID_STORAGE_KEY = "gclid";

const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const GCLID_MIN_LENGTH = 10;
const GCLID_MAX_LENGTH = 256;
const GCLID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function isValidGclid(value: string): boolean {
  return (
    value.length >= GCLID_MIN_LENGTH &&
    value.length <= GCLID_MAX_LENGTH &&
    GCLID_PATTERN.test(value)
  );
}

function readGclidFromUrl(): string | null {
  try {
    return new URLSearchParams(window.location.search).get("gclid");
  } catch {
    return null;
  }
}

function cleanGclid(value: string | null): string | null {
  if (!value) return null;
  const gclid = value.trim();
  return isValidGclid(gclid) ? gclid : null;
}

export function getGclid(): string | null {
  if (!hasPurpose("advertising")) return null;

  const fromUrl = cleanGclid(readGclidFromUrl());
  if (fromUrl) return fromUrl;

  try {
    return cleanGclid(window.localStorage.getItem(GCLID_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function persistGclid(gclid: string): void {
  if (!hasPurpose("advertising")) return;
  if (!isValidGclid(gclid)) return;
  try {
    window.localStorage.setItem(GCLID_STORAGE_KEY, gclid);
  } catch {
    // Almacenamiento no disponible.
  }
}

export function clearGclid(): void {
  try {
    window.localStorage.removeItem(GCLID_STORAGE_KEY);
  } catch {
    // Nada que limpiar.
  }
}

export function generateRef(): string {
  let referencia = "";
  for (let i = 0; i < 3; i++) {
    referencia += CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
  }
  return referencia;
}

// Payload idéntico al que ya usaba whatsapp.ts: solo { gclid, ref, site_key },
// porque el endpoint de ClinicMate solo admite POST y sin documentación pública.
export function postEvent(gclid: string | null, ref: string): void {
  fetch(CLINICMATE_ENDPOINT, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    keepalive: true,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ gclid, ref, site_key: SITE_KEY }),
  }).catch((error) => console.error("ClinicMate error:", error));
}

let consentEventSent = false;

// El menú navega a `/#hash`: cambiar la query recarga la página y borraría el
// gclid. Se reancla al href justo antes de la navegación interna (sigue siendo
// la propia URL, así que es válido también antes del consentimiento).
function preserveGclidOnInternalNavigation(): void {
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const gclid = cleanGclid(readGclidFromUrl());
    if (!gclid) return;

    const anchor = target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor) return;
    const anchorTarget = anchor.getAttribute("target");
    if (anchorTarget && anchorTarget !== "_self") return;
    if (anchor.hasAttribute("download")) return;

    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    // Solo enlaces del propio sitio: nunca se arrastra el gclid a terceros.
    if (url.origin !== window.location.origin) return;
    if (url.searchParams.has("gclid")) return;

    url.searchParams.set("gclid", gclid);
    anchor.href = url.href;
  });
}

let linksGuardInstalled = false;

export function initGclidCollector(): void {
  const initialGclid = cleanGclid(readGclidFromUrl());
  if (initialGclid) persistGclid(initialGclid);

  if (!linksGuardInstalled) {
    linksGuardInstalled = true;
    preserveGclidOnInternalNavigation();
  }

  const sendOnAccept = () => {
    const gclid = cleanGclid(readGclidFromUrl());
    if (!gclid) return;
    persistGclid(gclid);

    if (!consentEventSent) {
      consentEventSent = true;
      postEvent(gclid, generateRef());
    }
  };

  onChange((state) => {
    if (state?.advertising) {
      sendOnAccept();
    } else {
      clearGclid();
      consentEventSent = false;
    }
  });
}
