import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from '../organisms/Menu';
import Dashboard from '../../pages/Dashboard';
import MapRegisterPage from '../../pages/MapRegisterPage';
import BotonPage from '../../pages/BotonPage';
import TablePage from '../../pages/TablePage';
import CultivosPage from '../../pages/CultivosPage'; 
import TipoCultivoPage from '../../pages/TipoCultivoPage';
import VariedadPage from '../../pages/VariedadPage';

const MainLayout: React.FC = () => {
  return (
    <div className="flex">
      <Menu />
      <main className="ml-56 flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="cultivos" element={<CultivosPage />} />
          <Route path="cultivos/tipo-cultivo" element={<TipoCultivoPage />} />
          <Route path="cultivos/variedad" element={<VariedadPage />} />
          <Route path="iot" element={<MapRegisterPage />} />
          <Route path="fitosanitario" element={<BotonPage />} />
          <Route path="inventario" element={<TablePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainLayout;
