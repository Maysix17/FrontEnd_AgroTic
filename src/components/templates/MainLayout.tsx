import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from '../organisms/Menu';
import Dashboard from '../../pages/Dashboard';
import InputSearch from '../atoms/InputSearch';
import MapRegisterPage from '../../pages/MapRegisterPage';
import BotonPage from '../../pages/BotonPage';
import TablePage from '../../pages/TablePage';

const MainLayout: React.FC = () => {
  return (
    <div className="flex">
      <Menu />
      <main className="ml-56 flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="cultivos" element={<InputSearch placeholder="Buscar cultivooos..." value="" onChange={() => {}} />} />
          <Route path="iot" element={<MapRegisterPage />} />
          <Route path="fitosanitario" element={<BotonPage />} />
          <Route path="inventario" element={<TablePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainLayout;