import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import WelcomeScreen from './pages/WelcomeScreen';
import ProviderRegistrationForm from './pages/ProviderRegistrationForm';
import CustomerRegistrationForm from './pages/CustomerRegistrationForm';
import EmailVerificationPage from './pages/EmailVerificationPage';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProviderProfilePage from './pages/ProviderProfilePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <WelcomeScreen />,
      },
      {
        path: "/register-provider",
        element: <ProviderRegistrationForm />,
      },
      {
        path: "/register-customer",
        element: <CustomerRegistrationForm />,
      },
      {
        path: "/verify-email",
        element: <EmailVerificationPage />,
      },
      {
        element: <ProtectedRoute allowedRoles={['customer', 'provider', 'admin']} />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['customer']} />,
        children: [
          {
            path: "/dashboard-customer",
            element: <Dashboard />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['provider']} />,
        children: [
          {
            path: "/dashboard-provider",
            element: <Dashboard />,
          },
          {
            path: "/profile",
            element: <ProviderProfilePage />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: "/dashboard-admin",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);