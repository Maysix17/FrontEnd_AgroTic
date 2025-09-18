import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Páginas
import LoginPage from "../pages/LoginPage";
import MapRegisterPage from "../pages/MapRegisterPage";
import RecoverPasswordPage from "../pages/RecoverPasswordPage";
import RegisterPage from "../pages/RegisterPage";
import Menu from "../components/organisms/Menu";
import TablePage from "../pages/TablePage"
import Calendario from "../pages/Calendario"
import BotonPage from "../pages/BotonPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
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

        {/* Página de registro de mapas */}
        <Route path="/map-register" element={<ProtectedRoute><MapRegisterPage /></ProtectedRoute>} />

        {/* Menú principal */}
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />

        <Route path="/table" element={<ProtectedRoute><TablePage /></ProtectedRoute>} />

        <Route path="/date" element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
        {/* Boton */}
        <Route path="/fitosanitario" element={<ProtectedRoute><BotonPage /></ProtectedRoute>} />
        
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
