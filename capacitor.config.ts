import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Identificador único do app. Troque antes de publicar na Play Store
  // (depois de publicado não dá para mudar).
  appId: "br.com.organiza.app",
  appName: "Organiza",
  webDir: "dist",
  backgroundColor: "#0b0b12",
  plugins: {
    SystemBars: {
      // O app já trata as áreas seguras via env(safe-area-inset-*) no CSS.
      insetsHandling: "native",
      initialViewportFitValueHint: "cover",
      style: "DARK", // ícones claros sobre o fundo escuro
    },
  },
};

export default config;
