import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../organisms/Menu';



const MainLayout: React.FC = () => {
  return (
    <div className="flex">
      <Menu />
      <main className="ml-56 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;