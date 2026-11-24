// Estado del consentimiento: única fuente de verdad en localStorage,
// para que todos los bundles de Astro vean el mismo valor.

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "cookie_consent_v1";

export type ConsentPurpose = "analytics" | "advertising";

export interface ConsentState {
  version: number;
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  timestamp: number;
}

export interface CookieConsentAPI {
  getConsent: () => ConsentState | null;
  hasPurpose: (purpose: ConsentPurpose) => boolean;
  setConsent: (selection: {
    analytics: boolean;
    advertising: boolean;
  }) => ConsentState;
  clearConsent: () => void;
  onChange: (listener: (state: ConsentState | null) => void) => () => void;
  openPreferences: () => void;
}

declare global {
  interface Window {
    CookieConsent: CookieConsentAPI;
  }
}

function isConsentState(value: unknown): value is ConsentState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.version === CONSENT_VERSION &&
    candidate.necessary === true &&
    typeof candidate.analytics === "boolean" &&
    typeof candidate.advertising === "boolean" &&
    typeof candidate.timestamp === "number"
  );
}

export function getConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isConsentState(parsed)) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function hasPurpose(purpose: ConsentPurpose): boolean {
  return getConsent()?.[purpose] === true;
}

export function setConsent(selection: {
  analytics: boolean;
  advertising: boolean;
}): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: Boolean(selection.analytics),
    advertising: Boolean(selection.advertising),
    timestamp: Date.now(),
  };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento bloqueado: la decisión solo dura esta carga.
  }

  window.dispatchEvent(
    new CustomEvent<ConsentState>("cookieconsent:change", { detail: state }),
  );
  return state;
}

export function clearConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Nada que limpiar.
  }
  window.dispatchEvent(
    new CustomEvent<ConsentState | null>("cookieconsent:change", {
      detail: null,
    }),
  );
}

export function onChange(
  listener: (state: ConsentState | null) => void,
): () => void {
  const handler = (event: Event) => {
    listener((event as CustomEvent<ConsentState | null>).detail);
  };
  window.addEventListener("cookieconsent:change", handler);
  return () => window.removeEventListener("cookieconsent:change", handler);
}

export function openPreferences(): void {
  window.dispatchEvent(new Event("cookieconsent:open"));
}

export const CookieConsent: CookieConsentAPI = {
  getConsent,
  hasPurpose,
  setConsent,
  clearConsent,
  onChange,
  openPreferences,
};

if (typeof window !== "undefined") {
  window.CookieConsent = CookieConsent;
}
