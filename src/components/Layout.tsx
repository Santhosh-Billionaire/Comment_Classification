import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './navigation/Sidebar';
import MobileNavbar from './navigation/MobileNavbar';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-background-lighter">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:flex md:w-64 lg:w-72">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 max-w-full md:max-w-[calc(100%-16rem)] lg:max-w-[calc(100%-18rem)] mx-auto">
        <main className="py-4 px-4 md:px-8 max-w-5xl mx-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile navigation - shown only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10">
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Layout;