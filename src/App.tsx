import React from "react";
import AppRouter from "./routes/AppRouter";
import Boton from "./components/atoms/Boton";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Boton />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
