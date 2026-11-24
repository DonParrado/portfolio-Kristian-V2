// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://donparrado.github.io",
  base: "/portfolio-Kristian-V2",
  integrations: [tailwind()],
  devToolbar: { enabled: false },
});
