import React from 'react';
// import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const Dashboard = () => {
  return (
    // <Layout>
    <>
  <Navbar />
  <Sidebar />
  <main className="pt-20 px-4">
    <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
    <p>Welcome to your dashboard!</p>
  </main>
</>

  );
};

export default Dashboard;
