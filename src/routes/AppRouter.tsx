import { Routes, Route, Navigate } from "react-router-dom";

// Páginas públicas
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RecoverPasswordPage from "../pages/RecoverPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// Páginas protegidas
import UserProfilePage from "../pages/UserProfilePage";
import Dashboard from "../pages/Dashboard";
import CultivosPage from "../pages/CultivosPage";
import TipoCultivoPage from "../pages/TipoCultivoPage";
import VariedadPage from "../pages/VariedadPage";
import InventoryPage from "../pages/InventoryPage";
import MapRegisterPage from "../pages/MapRegisterPage";

// Componentes
import MainLayout from "../components/templates/MainLayout";
import PanelControl from "../components/organisms/PanelControl";
import ProtectedRoute from "../components/ProtectedRoute";

// 👉 Calendario con modal de actividades
import CalendarioPage from "../pages/GestionActividadesPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* 🔹 Redirección raíz al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 🔹 Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recover-password" element={<RecoverPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 🔹 Rutas protegidas */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 🔹 Aplicación principal (usa MainLayout) */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirección a dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Panel principal */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Panel de control */}
        <Route path="panel-control" element={<PanelControl />} />

        {/* Cultivos */}
        <Route path="cultivos" element={<CultivosPage />} />
        <Route path="cultivos/tipo" element={<TipoCultivoPage />} />
        <Route path="cultivos/variedad" element={<VariedadPage />} />

        <Route path="cultivos/gestion-actividades" element={<CalendarioPage />} />

        {/* IoT */}
        <Route path="iot" element={<MapRegisterPage />} />

        {/* Inventario */}
        <Route path="inventario" element={<InventoryPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
