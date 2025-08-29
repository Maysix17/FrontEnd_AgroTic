import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import { HeroUIProvider } from "@heroui/react";

// ⬅️ Importa los estilos globales de HeroUI
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <AppRouter />
    </HeroUIProvider>
  </React.StrictMode>
);
