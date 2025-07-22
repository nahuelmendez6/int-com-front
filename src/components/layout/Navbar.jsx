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

const CustomNavbar = () => {
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
            <Nav.Link href="#" className="text-dark">Inicio</Nav.Link>
            <Nav.Link href="#" className="text-dark">Mi red</Nav.Link>
            <Nav.Link href="#" className="text-dark">Empleos</Nav.Link>
            <Nav.Link href="#" className="text-dark">Mensajes</Nav.Link>
            <Nav.Link href="#" className="text-dark">Notificaciones</Nav.Link>

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
              <NavDropdown.Item href="#">Cerrar sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
