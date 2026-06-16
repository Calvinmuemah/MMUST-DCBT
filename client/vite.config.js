import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      injectRegister: "auto",

      devOptions: {
        enabled: true,
      },

      manifest: {
        name: "MMUST Mental Wellness",
        short_name: "MMUSTCare",
        description: "Digital CBT Mental Wellness Platform",

        theme_color: "#0f172a",
        background_color: "#ffffff",

        display: "standalone",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],
});
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//     VitePWA({
//       registerType: "autoUpdate",
//       manifest: {
//         name: "MMUST Mental Wellness",
//         short_name: "MMUSTCare",
//         description: "Digital CBT Mental Wellness Platform",
//         theme_color: "#0f172a",
//         background_color: "#ffffff",
//         display: "standalone",
//         start_url: "/",
//         icons: [
//           {
//             src: "/icon-192.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "/icon-512.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//         ],
//       },
//     }),
//   ],
// });