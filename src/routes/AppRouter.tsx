import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import LoginPage from "../pages/LoginPage";
import MapRegisterPage from "../pages/MapRegisterPage";
import RecoverPasswordPage from "../pages/RecoverPasswordPage";
import RegisterPage from "../pages/RegisterPage"; 
import Menu from "../components/organisms/Menu";

// Layout
import MainLayout from "../components/templates/MainLayout";
import CustomSelect from "../components/atoms/CustomSelect";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Redirigir la raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas SIN layout (auth) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />

        {/* Rutas CON layout */}
        <Route
          path="/map-register"
          element={
            <MainLayout>
              <MapRegisterPage />
            </MainLayout>
          }
        />

        <Route
          path="/menu"
          element={
            <MainLayout>
              <Menu />
              {/* ejemplo de uso del select aquí mismo */}
              <div className="mt-6 flex justify-start ml-52">
                <CustomSelect />
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
