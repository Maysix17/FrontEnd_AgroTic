import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../organisms/Menu';

=======
import Dashboard from '../../pages/Dashboard';
import MapRegisterPage from '../../pages/MapRegisterPage';
import BotonPage from '../../pages/BotonPage';
import TablePage from '../../pages/TablePage';
import CultivosPage from '../../pages/CultivosPage'; 
import TipoCultivoRegisterPage from '../../pages/TipoCultivoPage'; 

const MainLayout: React.FC = () => {
  return (
    <div className="flex">
      <Menu />
      <main className="ml-56 flex-1 p-6">
        <Outlet />
=======
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="cultivos" element={<CultivosPage />} /> {/* Ahora va a CultivosPage */}
          <Route path="cultivos/tipo-cultivo" element={<TipoCultivoRegisterPage />} /> {/* Nueva ruta */}
          <Route path="iot" element={<MapRegisterPage />} />
          <Route path="fitosanitario" element={<BotonPage />} />
          <Route path="inventario" element={<TablePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainLayout;
