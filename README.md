# Proyecto Frontend

Este proyecto es una aplicación frontend desarrollada con React y Vite, diseñada para gestionar perfiles de usuarios (clientes y proveedores) y sus respectivos procesos de registro y autenticación.

## Estructura del Proyecto y Funcionalidades Clave:

### `src/`
Contiene el código fuente principal de la aplicación.

#### `src/components/`
Componentes reutilizables que construyen la interfaz de usuario:
- **`ProtectedRoute.jsx`**: Componente para proteger rutas que requieren autenticación.
- **`common/`**: Componentes genéricos como `ConfirmationModal.jsx`.
- **`layout/`**: Componentes de diseño de la aplicación, incluyendo `Layout.jsx`, `Navbar.jsx`, `RightSidebar.jsx` y `Sidebar.jsx`.
- **`loginForm/`**: Componentes relacionados con el inicio de sesión, como `EmailVerificationForm.jsx`.
- **`profile/`**: Secciones del perfil de usuario, como `AddressSection.jsx`, `LocationSection.jsx`, `PersonalDataSection.jsx`, `ProfessionalInfoSection.jsx`, `ProfileHeader.jsx`, `ProviderServiceArea.jsx` y `ServiceAreaSection.jsx`.
- **`registrationForm/`**: Formularios para el proceso de registro, incluyendo `AddressForm.jsx`, `FormNavigator.jsx`, `PersonalInfoForm.jsx`, `ProviderInfoForm.jsx`, `ServiceAreaForm.jsx` y `StepsTabsNav.jsx`.

#### `src/context/`
- **`AuthContext.jsx`**: Contexto de React para la gestión del estado de autenticación global de la aplicación.

#### `src/hooks/`
- **`useCustomerRegistrationForm.js`**: Hook personalizado para la lógica del formulario de registro de clientes.
- **`useProviderRegistrationForm.js`**: Hook personalizado para la lógica del formulario de registro de proveedores.

#### `src/pages/`
Páginas principales de la aplicación, que combinan varios componentes para formar vistas completas:
- **`CustomerProfile.jsx`**: Página de perfil para clientes.
- **`CustomerRegistrationForm.jsx`**: Página del formulario de registro para clientes.
- **`Dashboard.jsx`**: Panel principal de la aplicación.
- **`EmailVerificationPage.jsx`**: Página para la verificación de correo electrónico.
- **`ProviderProfilePage.jsx`**: Página de perfil para proveedores.
- **`ProviderRegistrationForm.jsx`**: Página del formulario de registro para proveedores.
- **`WelcomeScreen.jsx`**: Pantalla de bienvenida de la aplicación.

#### `src/services/`
Módulos para la interacción con APIs y lógica de negocio específica:
- **`api.js`**: Configuración base para las llamadas a la API.
- **`authService.js`**: Servicios relacionados con la autenticación de usuarios.
- **`customerService.js`**: Servicios para la gestión de datos de clientes.
- **`locationServices.js`**: Servicios para la gestión de información de ubicación.
- **`profileService.js`**: Servicios para la gestión de perfiles de usuario.

## Configuración del Entorno de Desarrollo

Este proyecto utiliza Vite para un entorno de desarrollo rápido y eficiente, con soporte para React y reglas de ESLint para mantener la calidad del código.
