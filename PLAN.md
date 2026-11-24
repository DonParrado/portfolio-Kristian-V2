# Plan — Portfolio V2 (proyecto aparte)

> Proyecto nuevo en `C:\Users\JAVIERPF\Documents\portfolio-V2`
> Basado en el portfolio actual (`portfolio-astro`) con la estética de unobravo.com
> Ejecutado el 24 de noviembre de 2026

---

## 1. Objetivo

Crear un proyecto nuevo, mejor estructurado y con el código más limpio posible
(sin comentarios estructurales ni código muerto), aplicando los colores del
portfolio de Kristian sobre el diseño de [unobravo.com](https://www.unobravo.com/),
conservando las imágenes, los vídeos, el logo y todos los textos de las secciones
y páginas actuales, con un menú currado y un footer muy parecido al de unobravo.

---

## 2. Stack y estructura

- **Astro 5 + Tailwind CSS 3 únicamente** (sin Vue, Alpine.js ni AOS).
- Carrusel de testimonios en CSS/JS nativo, animaciones con IntersectionObserver.
- Contenido nuevo en carpeta hermana `Documents/portfolio-V2` (sin commit, sin git por ahora).

```
portfolio-V2/
├── public/                    (images, videos, documentos, favicon, formulario.php)
├── src/
│   ├── components/
│   │   ├── layout/            (Header.astro, Footer.astro, WhatsAppFloat.astro)
│   │   ├── sections/          (Hero, TestimonioVideo, TerapiaIndividual,
│   │   │                      TerapiaPareja, Help, QuienSoy, Testimonios, Contact)
│   │   ├── ui/                (Phone, Mail, Location, Instagram)
│   │   └── cookies/           (CookieBanner.astro)
│   ├── layouts/Layout.astro
│   ├── pages/                 (index, biografia, politica-cookies,
│   │                           terapia-individual-palma, terapia-pareja-palma, 404)
│   ├── scripts/               (cookie-consent, gclid-collector, whatsapp)
│   ├── styles/global.css      (tokens de color, .btn pill, utilidades)
│   ├── imgs/  videos/
├── astro.config.mjs / tailwind.config.mjs / tsconfig.json / package.json
```

---

## 3. Estética: colores de Kristian + diseño unobravo

### Paleta (tokens en `tailwind.config.mjs`)

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#00ffa2` | verde neón, acentos |
| `primarydark` | `#00d98a` | hover |
| `primaryhover` | `#544838` | texto principal, botones oscuros |
| `background` | `#F5E8D9` | beige, fondos de sección |

### Aplicación del estilo unobravo

- Mucho aire; secciones alternando fondo beige/blanco.
- Titulares display a dos líneas (`section-title` + `section-eyebrow`).
- **Botones pill** (`rounded-full`): `btn-primary`, `btn-outline`, `btn-light`.
- **Tarjetas redondeadas** con borde suave (`.card`, `rounded-3xl`).
- Imágenes con `aspect-ratio` y `rounded-3xl` (sin saltos de layout).
- Tipografía: Inter (texto) + Playfair Display (display), heredadas del actual.

---

## 4. Páginas (6)

| Página | Ruta | Notas |
|---|---|---|
| Home | `/` | 8 secciones |
| Biografía | `/biografia/` | texto íntegro |
| Política de cookies | `/politica-cookies/` | texto íntegro |
| Terapia individual | `/terapia-individual-palma/` | título corregido (antes decía "Biografia") |
| Terapia de pareja | `/terapia-pareja-palma/` | título corregido |
| 404 | `/404.html` | página nueva con estilo propio |

**Sin precios ni planes en ningún sitio.**

---

## 5. Menú (7 entradas)

1. Inicio → `/#inicio`
2. Testimonio → `/#testimonio` (vídeo)
3. **Terapias ▾** → Terapia Individual `/#terapia-individual-palma` · Terapia de Pareja `/#terapia-pareja-palma`
4. ¿En qué te ayudo? → `/#features`
5. ¿Quién soy? → `/#whois`
6. Testimonios → `/#reviews` (carrusel)
7. Contacto → `/#formulario`

- Desktop: dropdown «Terapias» con hover/focus (CSS), scrollspy con IntersectionObserver.
- Móvil: overlay a pantalla completa con hamburguesa animada (JS nativo), submenú «Terapias» plegable, CTA de WhatsApp. Se cierra al hacer scroll, con Escape o al pulsar un enlace.

---

## 6. Footer estilo unobravo (sin newsletter)

4 columnas: **logo + slogan** · **Terapias** (anchors + landings) · **Secciones** · **Legal**
(aviso legal PDF, política de cookies) + botón «Preferencias de cookies».

Fila final conservada literal:
- *Desarrollado por **Javier Parrado Figuerola** y **Adrián Colom Palacios** (LinkedIn)*
- *© Copyright 2026. Todos los derechos reservados.*

Responsive: 1 columna (móvil) → 2 (sm) → 4 (lg).

---

## 7. Secciones del home (textos conservados)

| # | Sección | Estilo nuevo |
|---|---|---|
| 1 | Portada vídeo | vídeo a pantalla completa, overlay oscuro, texto + CTA pill WhatsApp |
| 2 | Hero `#inicio` | beige, titular display + foto de Kristian (grid 2 cols) |
| 3 | Testimonio `#testimonio` | vídeo con autoplay por IntersectionObserver |
| 4 | Terapia Individual `#terapia-individual-palma` | tarjeta foto + texto + «Ver más» |
| 5 | Terapia de Pareja `#terapia-pareja-palma` | tarjeta foto + texto + «Ver más» (fondo beige) |
| 6 | ¿En qué te ayudo? `#features` | 4 tarjetas con imagen, título y texto |
| 7 | ¿Quién soy? `#whois` | bio + CTA «Ver historia completa» (fondo beige) |
| 8 | Testimonios `#reviews` | marquee CSS con 6 reseñas reales (avatar, estrellas, Google, fecha); pausa al tocar/hover; scroll-snap en móvil |
| 9 | Contacto `#formulario` | formulario → WhatsApp (JS nativo), mapa, datos e Instagram |

---

## 8. Assets (todos conservados)

- **Fotos**: 56 en `src/imgs` + 15 en `public/images` (Kristian, avatares de testimonios, escenas terapéuticas).
- **Vídeos**: `src/videos/terapia.mp4` (portada), `public/videos/testimonio.mov` (testimonio), `public/videos/reiki.mov` (reserva).
- **Logo**: `mentora_redondo1.svg` (header/footer) + variantes `logo.*`, `logo_sinletras.svg`, etc.
- **Documentos**: `public/documentos/avisoLegal.pdf`, `favicon.ico/svg`.

---

## 9. Limpieza aplicada

- **Fuera**: código muerto (`Whois copy`, `Precios/Pricing/Planes/Stats`, `Carrousel*`), bloques comentados, ~169 comentarios estructurales, enlace roto a `/global.css`, paleta rosa comentada, plugin `tailwindcss-highlights`.
- **Comentarios conservados**: solo lógica de negocio (cookies, Consent Mode v2, GCLID/ClinicMate, WhatsApp), 1–3 líneas por bloque.
- **Corregido**: `title` de las landings de terapia.

---

## 10. Funcionalidad conservada

- Google Consent Mode v2 (inline en Layout, tags bloqueados hasta consentir).
- Banner de cookies con dos capas + «Preferencias de cookies» en el footer.
- Colector de GCLID + envío a ClinicMate (solo con consentimiento de publicidad).
- Tracking de conversiones WhatsApp (AW-16915885750) + GTM.
- Botón flotante de WhatsApp con popup de chat.
- Meta tags OG, canonical y verificaciones de Search Console.

---

## 11. Responsive (mobile-first)

- Base 1 columna, tipografía fluida, targets táctiles ≥44px.
- Menú overlay en móvil; grids apilados (1 → 2 → 4 columnas).
- Vídeos `playsinline/muted/loop`; testimonios con swipe/snap en móvil.
- Puntos de ruptura: 640 / 768 / 1024 / 1280 px.
- Respeta `prefers-reduced-motion` (desactiva animaciones).

---

## 12. Resultado de la verificación

- `npm run build` → **astro check: 0 errores, 0 warnings** · 6 páginas.
- Imágenes optimizadas a WebP (ej. `cruzadas1`: 846kB → 213kB).
- Smoke test en preview: home, biografía, landings, cookies y 404 OK.

### Ejecutar

```bash
cd Documents\portfolio-V2
npm install
npm run dev      # desarrollo
npm run build    # build de producción
npm run preview  # previsualizar build
```
