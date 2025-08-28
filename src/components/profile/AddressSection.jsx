import React, { useState, useEffect } from 'react';
import { Button, Modal, Card } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { getProvinces, getDepartmentsByProvince, getCitiesByDepartment } from '../../services/locationServices';
import { updateProvider } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import AddressForm from '../registrationForm/AddressForm';
import './AddressSection.css';

const AddressSection = ({ provider, onUpdate }) => {
  const { token } = useAuth();
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
    if (provider?.address) {
      setFormData({
        address: {
          id_address: provider.address.id_address || null,
          street: provider.address.street || '',
          number: provider.address.number || '',
          floor: provider.address.floor || '',
          apartment: provider.address.apartment || '',
          postal_code: provider.address.postal_code || '',
          city: provider.address.city?.id_city || '',
          department: provider.address.city?.department?.id_department || '',
          province: provider.address.city?.department?.province?.id_province || ''
        }
      });
    }
  }, [provider]);

  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = async () => {
    if (provider?.address) {
      const provinceId = provider.address.city?.department?.province?.id_province;
      const departmentId = provider.address.city?.department?.id_department;

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
      await updateProvider(token, { address: payload });
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Error updating address:', error);
    }
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
          <div className="address-details">
            <div className="address-item">
              <span className="address-label">Calle:</span>
              <span className="address-value">{provider?.address?.street}</span>
            </div>
            <div className="address-item">
              <span className="address-label">Número:</span>
              <span className="address-value">{provider?.address?.number}</span>
            </div>
            <div className="address-item">
              <span className="address-label">Piso:</span>
              <span className="address-value">{provider?.address?.floor}</span>
            </div>
            <div className="address-item">
              <span className="address-label">Departamento:</span>
              <span className="address-value">{provider?.address?.apartment}</span>
            </div>
            <div className="address-item">
              <span className="address-label">Ciudad:</span>
              <span className="address-value">{provider?.address?.city_detail?.name}</span>
            </div>
          </div>
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
