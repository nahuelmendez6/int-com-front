import React from 'react';
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  NavDropdown,
  Image,
} from 'react-bootstrap';
import { FiMessageSquare, FiBell } from 'react-icons/fi'; 
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const { logout, role } = useAuth(); // Get role from useAuth
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar
      expand="md"
      fixed="top"
      style={{ backgroundColor: '#f5f5f5' }} // Gris claro/cremita
      className="align-items-center gap-3"
    >
      <Container>
        {/* Logo + búsqueda */}
        <Navbar.Brand href="#">
          <img
            // src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            // alt="LinkedIn Logo"
          />
        </Navbar.Brand>

        <Form className="d-none d-md-flex ms-2">
          <FormControl
            type="search"
            placeholder="Buscar"
            className="me-2 bg-light text-dark"
          />
        </Form>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar" className="justify-content-end">
          <Nav className="align-items-center gap-3">
            {/* <Nav.Link href="#" className="text-dark">Inicio</Nav.Link> */}
            {role === 'customer' && (
              <>
                <Nav.Link href="#" className="text-dark">Mis Servicios</Nav.Link>
                
                <Nav.Link href="#" className="text-dark">Buscar Proveedores</Nav.Link>
              </>
            )}
            {role === 'provider' && (
              <>
                <Nav.Link href="#" className="text-dark">Peticiones</Nav.Link>
                <Nav.Link href="#" className="text-dark">Mis Postulaciones</Nav.Link>
                {/* <Nav.Link href="#" className="text-dark">Mis Clientes</Nav.Link> */}
                <Nav.Link href="#" className="text-dark">Mis Servicios Ofrecidos</Nav.Link>
              </>
            )}
            {role === 'admin' && (
              <>
                <Nav.Link href="#" className="text-dark">Gestión de Usuarios</Nav.Link>
                <Nav.Link href="#" className="text-dark">Reportes</Nav.Link>
              </>
            )}
            <Nav.Link href="#" className="text-dark d-flex align-items-center gap-2">
              <FiMessageSquare />
            </Nav.Link>
            <Nav.Link href="#" className="text-dark d-flex align-items-center gap-2">
              <FiBell />
            </Nav.Link>

            <NavDropdown
              title={
                <span className="text-dark">
                  <Image
                    src="https://via.placeholder.com/28"
                    roundedCircle
                    className="me-1"
                    width={28}
                    height={28}
                  />
                  Yo
                </span>
              }
              id="profile-dropdown"
              align="end"
            >
              <NavDropdown.Item href="#">Ver perfil</NavDropdown.Item>
              <NavDropdown.Item href="#">Configuración</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default CustomNavbar;
