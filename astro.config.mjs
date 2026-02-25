// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import expressiveCode from "astro-expressive-code";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://aeshus.github.io",
    base: "/ritsec.github.io",
    integrations: [expressiveCode({
      themes: ['github-dark']
    }), mdx(), react(), sitemap()],
});
