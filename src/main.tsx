import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setupNative } from "./lib/native";
import "./styles/global.css";

setupNative();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
