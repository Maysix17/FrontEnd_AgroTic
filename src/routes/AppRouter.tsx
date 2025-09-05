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
        <Route path="/map-register" element={<MapRegisterPage />} />

        {/* Menú principal */}
        <Route path="/menu" element={<Menu />} />

        <Route path="/table" element={<TablePage />} />

        <Route path="/date" element={<Calendario />} />
        {/* Boton */}
        <Route path="/fitosanitario" element={<BotonPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
