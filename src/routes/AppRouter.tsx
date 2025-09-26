import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Páginas
import LoginPage from "../pages/LoginPage";
import MapRegisterPage from "../pages/MapRegisterPage";
import RecoverPasswordPage from "../pages/RecoverPasswordPage";
import RegisterPage from "../pages/RegisterPage";
import MainLayout from "../components/templates/MainLayout";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UserProfilePage from "../pages/UserProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";
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

        {/* Página de perfil de usuario */}
        <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

        {/* Aplicación principal */}
        <Route path="/app/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
