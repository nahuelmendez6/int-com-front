import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { getProvinces, getDepartmentsByProvince, getCitiesByDepartment } from '../services/locationServices';

const ProviderRegistrationForm = () => {
  const [provincesAddress, setProvincesAddress] = useState([]);
  const [provincesServices, setProvincesServices] = useState([]);

  const [addressDepartments, setAddressDepartments] = useState([]);
  const [addressCities, setAddressCities] = useState([]);

  const [servicesDepartments, setServicesDepartments] = useState([]);
  const [servicesCities, setServicesCities] = useState([]);

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    typeProvider: '',
    profession: '',
    address: {
      street: '',
      number: '',
      floor: '',
      apartment: '',
      postal_code: '',
      province: '',
      department: '',
      city: '',
    },
    serviceArea: {
      province: '',
      departments: [],
      cities: [],
    },
    categories: [],
  });


  useEffect(() => {
    getProvinces()
      .then(data => {
        console.log('Provinces fetched:', data); // Log provinces data
        setProvincesAddress(data);
        setProvincesServices(data);
      })
      .catch(err => console.error('Error fetching provinces:', err));
  }, []);

  const handleProvinceForAddress = async (e) => {
    const selectedId = e.target.value;

    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        province: selectedId,
        department: '',
        city: '',
      }
    }));

    if (selectedId) {
      try {
        const data = await getDepartmentsByProvince(selectedId);
        setAddressDepartments(data);
        setAddressCities([]);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    } else {
      setAddressDepartments([]);
      setAddressCities([]);
    }
  };

  const handleProvinceForServices = async (e) => {
    const selectedId = e.target.value;

    setFormData(prev => ({
      ...prev,
      serviceArea: {
        ...prev.serviceArea,
        province: selectedId,
        departments: [],
        cities: [],
      }
    }));

    if (selectedId) {
      try {
        const deptos = await getDepartmentsByProvince(selectedId);
        setServicesDepartments(deptos);
        setServicesCities([]);
      } catch (err) {
        console.error('Error cargando departamentos:', err);
      }
    } else {
      setServicesDepartments([]);
      setServicesCities([]);
    }
  };

  const handleDepartmentCheckboxChange = async (e) => {
    const deptId = e.target.value;
    const isChecked = e.target.checked;

    const updatedDepartments = isChecked
      ? [...formData.serviceArea.departments, deptId]
      : formData.serviceArea.departments.filter((id) => id !== deptId);

    let updatedCities = [...formData.serviceArea.cities];
    if (!isChecked) {
        try {
            const citiesOfDept = await getCitiesByDepartment(deptId);
            const cityIdsOfDept = citiesOfDept.map(c => c.id_city.toString());
            updatedCities = updatedCities.filter(cityId => !cityIdsOfDept.includes(cityId));
        } catch(err) {
            console.error('Error fetching cities for department', err);
        }
    }

    setFormData(prev => ({
      ...prev,
      serviceArea: {
        ...prev.serviceArea,
        departments: updatedDepartments,
        cities: updatedCities,
      }
    }));

    if (updatedDepartments.length > 0) {
      try {
        const allCitiesPromises = updatedDepartments.map(dId => getCitiesByDepartment(dId));
        const citiesArrays = await Promise.all(allCitiesPromises);
        const allCities = citiesArrays.flat();
        
        const uniqueCities = allCities.filter((city, index, self) =>
          index === self.findIndex((c) => c.id_city === city.id_city)
        );
        setServicesCities(uniqueCities);
      } catch (err) {
        console.error('Error cargando ciudades:', err);
      }
    } else {
      setServicesCities([]);
    }
  };


  const handleCityCheckboxChange = (e) => {
    const cityId = e.target.value;
    const isChecked = e.target.checked;

    setFormData(prev => {
      const updatedCities = isChecked
        ? [...prev.serviceArea.cities, cityId]
        : prev.serviceArea.cities.filter(id => id !== cityId);

      return {
        ...prev,
        serviceArea: {
            ...prev.serviceArea,
            cities: updatedCities,
        }
      };
    });
  };


  const handleDepartmentChange = async (e) => {
    const selectedId = e.target.value;
    setFormData(prev => ({
        ...prev,
        address: {
            ...prev.address,
            department: selectedId,
            city: '',
        }
    }));

    if (selectedId) {
        try {
          const cityData = await getCitiesByDepartment(selectedId);
          setAddressCities(cityData);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
    } else {
        setAddressCities([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    if (field) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      const { name, lastname, email, password, confirmPassword } = formData;
      if (!name || !lastname || !email || !password || password !== confirmPassword) {
        alert('Por favor, completa todos los campos obligatorios y verifica las contraseñas.');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => setCurrentStep(currentStep - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario de registro de proveedor enviado:', formData);
    alert('¡Registro exitoso!');
  };

  const steps = [
    {
      title: 'Datos Personales',
      content: (
        <>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastname">
            <Form.Label>Apellido *</Form.Label>
            <Form.Control type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email *</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña *</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirmar Contraseña *</Form.Label>
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </Form.Group>
        </>
      ),
    },
    {
      title: 'Información del Proveedor',
      content: (
        <>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTypeProvider">
            <Form.Label>Tipo de Proveedor</Form.Label>
            <Form.Control type="text" name="typeProvider" value={formData.typeProvider} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProfession">
            <Form.Label>Profesión</Form.Label>
            <Form.Control type="text" name="profession" value={formData.profession} onChange={handleChange} />
          </Form.Group>
        </>
      ),
    },
    {
      title: 'Dirección',
      content: (
        <>
            <Form.Group className="mb-3" controlId="formStreet">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNumber">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                name="address.number"
                value={formData.address.number}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFloor">
              <Form.Label>Piso</Form.Label>
              <Form.Control
                type="text"
                name="address.floor"
                value={formData.address.floor}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formApartment">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                type="text"
                name="address.apartment"
                value={formData.address.apartment}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPostalCode">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control
                type="text"
                name="address.postal_code"
                value={formData.address.postal_code}
                onChange={handleChange}
              />
            </Form.Group>

          <Form.Select name="address.province" value={formData.address.province} onChange={handleProvinceForAddress}>
            <option value="">Seleccione una provincia</option>
            {provincesAddress.map((province) => (
              <option key={province.id_province} value={province.id_province}>
                {province.name}
              </option>
            ))}
          </Form.Select>


          <Form.Group className="mb-3" controlId="formDepartment">
            <Form.Label>Departamento</Form.Label>
            <Form.Select name="address.department" value={formData.address.department} onChange={handleDepartmentChange} disabled={!formData.address.province}>
              <option value="">Seleccione un departamento</option>
              {addressDepartments
                .filter(d => d && d.id_department)
                .map((department) => (
                  <option key={department.id_department} value={department.id_department}>{department.name}</option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCity">
            <Form.Label>Ciudad</Form.Label>
            <Form.Select name="address.city" value={formData.address.city} onChange={handleChange} disabled={!formData.address.department}>
              <option value="">Seleccione una ciudad</option>
              {addressCities
                .filter(c => c && c.id_city)
                .map((city) => (
                  <option key={city.id_city} value={city.id_city}>{city.name}</option>
                ))}
            </Form.Select>
          </Form.Group>


        </>
      ),
    },
    {
      title: 'Ubicación y Servicios',
      content: (
        <>
          <Form.Select name="serviceArea.province" value={formData.serviceArea.province} onChange={handleProvinceForServices}>
            <option value="">Seleccione una provincia para ver sus departamentos</option>
            {provincesServices.map((province) => (
              <option key={province.id_province} value={province.id_province}>
                {province.name}
              </option>
            ))}
          </Form.Select>


          {servicesDepartments.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Departamentos donde ofrece servicios</Form.Label>
              {servicesDepartments.map((department) => (
                <Form.Check
                  key={department.id_department}
                  type="checkbox"
                  label={department.name}
                  value={department.id_department}
                  checked={formData.serviceArea.departments.includes(department.id_department.toString())}
                  onChange={handleDepartmentCheckboxChange}
                />
              ))}
            </Form.Group>
          )}

          {servicesCities.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Ciudades donde ofrece servicios</Form.Label>
              {servicesCities.map((city) => (
                <Form.Check
                  key={city.id_city}
                  type="checkbox"
                  label={city.name}
                  value={city.id_city}
                  checked={formData.serviceArea.cities.includes(city.id_city.toString())}
                  onChange={handleCityCheckboxChange}
                />
              ))}
            </Form.Group>
          )}
        </>

      ),
    },
  ];

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--main-bg)' }}>
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={9} xl={8}>
          <Card className="p-4 shadow-lg" style={{ borderRadius: '1rem' }}>
            <Card.Body>
              <h2 className="mb-4 section-title text-center">Registro de Proveedor</h2>
              <Nav variant="tabs" className="mb-4 justify-content-center">
                {steps.map((step, index) => (
                  <Nav.Item key={`tab-${index}`}>
                    <Nav.Link active={index === currentStep} onClick={() => setCurrentStep(index)}>
                      {step.title}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <Form onSubmit={handleSubmit}>
                <div style={{ overflowX: 'hidden' }}>
                  <div
                    style={{
                      display: 'flex',
                      width: `${steps.length * 100}%`,
                      transform: `translateX(-${(currentStep / steps.length) * 100}%)`,
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    {steps.map((step, index) => (
                      <div key={`step-${index}`} style={{ width: `${100 / steps.length}%`, flexShrink: 0 }}>
                        {step.content}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  {currentStep > 0 && (
                    <Button variant="secondary" onClick={handlePrevious}>
                      Anterior
                    </Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button variant="primary" onClick={handleNext}>
                      Siguiente
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button variant="success" type="submit">
                      Registrarse
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProviderRegistrationForm;
