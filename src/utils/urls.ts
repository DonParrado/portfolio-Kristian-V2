// Rutas internas compatibles con el subdirectorio de GitHub Pages.
const base = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/`;

export const withBase = (path: string): string =>
  `${base}${path.replace(/^\//, "")}`;
