import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/devtools"],

  runtimeConfig: {
    public: {
      apiBase: "http://localhost:5000/api",
    },
  },

  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    transpile: ["flowbite"],
  },

  compatibilityDate: "2025-04-05",
});
