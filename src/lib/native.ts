import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

/**
 * Comportamentos só do app Android.
 * Botão "voltar": fecha um painel aberto, senão volta uma tela, senão sai do app.
 */
export function setupNative() {
  if (!Capacitor.isNativePlatform()) return;

  App.addListener("backButton", ({ canGoBack }) => {
    if (document.querySelector('[role="dialog"]')) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    } else if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
}
