import React, { createContext, useContext } from 'react';
import AppNavbar from './Navbar';
import LeftSidebar from './Sidebar';
import './Layout.css';

const LayoutContext = createContext(false);

const Layout = ({ children }) => {
  const hasLayout = useContext(LayoutContext);

  if (hasLayout) {
    return <>{children}</>;
  }

  return (
    <LayoutContext.Provider value={true}>
      <div className="app-container">
        <AppNavbar />
        <div className="main-layout">
          <div className="left-sidebar-wrapper d-none d-md-block">
            <LeftSidebar />
          </div>
          <main className="main-content-area">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default Layout;