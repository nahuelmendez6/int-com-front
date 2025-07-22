import React from 'react';
import AppNavbar from './Navbar';
import LeftSidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <AppNavbar />
      <div className="main-content-wrapper">
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div className="col-md-3 col-lg-2 d-none d-md-block left-sidebar-container">
              <LeftSidebar />
            </div>
            <main role="main" className="col-md-9 col-lg-8 central-content-container">
              {children}
            </main>
            <div className="col-lg-2 d-none d-lg-block right-sidebar-container">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;