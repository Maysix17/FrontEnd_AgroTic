import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Páginas
import LoginPage from "../pages/LoginPage";
import MapRegisterPage from "../pages/MapRegisterPage";
import RecoverPasswordPage from "../pages/RecoverPasswordPage";
import RegisterPage from "../pages/RegisterPage";
import MainLayout from "../components/templates/MainLayout";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProtectedRoute from "../components/ProtectedRoute";
import TipoCultivoPage from "../pages/TipoCultivoPage";
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Redirigir la raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Página de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />

        {/* Página de registro de usuario */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Página de recuperación de contraseña */}
        <Route path="/recover-password" element={<RecoverPasswordPage />} />

        {/* Página de registro de mapas */}
        <Route path="/map-register" element={<ProtectedRoute><MapRegisterPage /></ProtectedRoute>} />

        {/* Aplicación principal */}
        <Route path="/app/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Ruta del formulario */}
        <Route path="/cultivos/tipo-cultivo" element={<TipoCultivoPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
