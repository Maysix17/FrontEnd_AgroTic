import React from "react";
import AppRouter from "./routes/AppRouter";
import { PermissionProvider } from "./contexts/PermissionContext";

function App() {
  return (
    <PermissionProvider>
      <AppRouter />
    </PermissionProvider>
  );
}

export default App;
