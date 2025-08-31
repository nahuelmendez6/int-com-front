import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, ListGroup, Row, Col } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { getProvinces, getDepartmentsByProvince, getCitiesByDepartment } from '../../services/locationServices';
import { updateProvider, updateCustomer } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import AddressForm from '../registrationForm/AddressForm';


const AddressSection = ({ provider, customer, onUpdate }) => {
  const { token, user, role } = useAuth();

  const currentProfile = role === 'provider' ? provider : customer;
  console.log('perfil: ',currentProfile)


  const [formData, setFormData] = useState({
    address: {
      id_address: null,
      street: '',
      number: '',
      floor: '',
      apartment: '',
      postal_code: '',
      city: '',
      department: '',
      province: ''
    }
  });

  useEffect(() => {
    if (currentProfile?.address) {
      setFormData({
        address: {
          id_address: currentProfile.address.id_address || null,
          street: currentProfile.address.street || '',
          number: currentProfile.address.number || '',
          floor: currentProfile.address.floor || '',
          apartment: currentProfile.address.apartment || '',
          postal_code: currentProfile.address.postal_code || '',
          city: currentProfile.address.city?.id_city || '',
          department: currentProfile.address.city?.department?.id_department || '',
          province: currentProfile.address.city?.department?.province?.id_province || ''
        }
      });
    }
  }, [currentProfile]);

  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = async () => {
    if (currentProfile?.address) {
      const provinceId = currentProfile.address.city?.department?.province?.id_province;
      const departmentId = currentProfile.address.city?.department?.id_department;

      if (provinceId) {
        try {
          const departmentsData = await getDepartmentsByProvince(provinceId);
          setDepartments(departmentsData);
        } catch (error) {
          console.error('Error fetching departments:', error);
        }
      }
      if (departmentId) {
        try {
          const citiesData = await getCitiesByDepartment(departmentId);
          setCities(citiesData);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      }
    }
    setShowModal(true);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    handleChange(e);
    setDepartments([]);
    setCities([]);
    if (provinceId) {
      try {
        const departmentsData = await getDepartmentsByProvince(provinceId);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    handleChange(e);
    setCities([]);
    if (departmentId) {
      try {
        const citiesData = await getCitiesByDepartment(departmentId);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [keys[1]]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id_address: formData.address.id_address,
      street: formData.address.street,
      number: formData.address.number,
      floor: formData.address.floor,
      apartment: formData.address.apartment,
      postal_code: formData.address.postal_code,
      city: parseInt(formData.address.city, 10) || null
    };

    try {
      if (role == "provider") {
        await updateProvider(token, {address: payload});
      } else {
        await updateCustomer(token, {address: payload});
      }
      onUpdate();
      handleClose();
    } catch (error) {
      console.error("Error updating address:", error)
    }


    // try {
    //   await updateProvider(token, { address: payload });
    //   onUpdate();
    //   handleClose();
    // } catch (error) {
    //   console.error('Error updating address:', error);
    // }
  };

  return (
    <div className="address-section">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Dirección</Card.Title>
            <Button variant="light" onClick={handleShow} className="edit-button">
              <FiEdit />
            </Button>
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Calle:</strong></Col>
                <Col sm={9}>{currentProfile?.address?.street}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Número:</strong></Col>
                <Col sm={9}>{currentProfile?.address?.number}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Piso:</strong></Col>
                <Col sm={9}>{currentProfile?.address?.floor}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Departamento:</strong></Col>
                <Col sm={9}>{currentProfile?.address?.apartment}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Ciudad:</strong></Col>
                <Col sm={9}>{currentProfile?.address?.city_detail?.name}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Dirección</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddressForm
            formData={formData}
            provinces={provinces}
            departments={departments}
            cities={cities}
            handleChange={handleChange}
            handleProvinceChange={handleProvinceChange}
            handleDepartmentChange={handleDepartmentChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddressSection;
