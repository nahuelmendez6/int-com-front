import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import WelcomeScreen from './pages/WelcomeScreen';
import ProviderRegistrationForm from './pages/ProviderRegistrationForm';
import EmailVerificationPage from './pages/EmailVerificationPage';
import Dashboard from './pages/Dashboard';

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
        path: "/verify-email",
        element: <EmailVerificationPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);