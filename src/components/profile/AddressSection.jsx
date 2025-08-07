import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, ListGroup } from 'react-bootstrap';
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
  // const [formData, setFormData] = useState({
  //   id_address: null,
  //   street: '',
  //   number: '',
  //   floor: '',
  //   apartment: '',
  //   postal_code: '',
  //   city: '',
  //   department: '',
  //   province: ''
  // });


  // useEffect(() => {
  //   if (provider?.address) {
  //     console.log("Populating form with address:", provider.address);
  //     setFormData({
  //       address: {
  //         id_address: provider.address.id_address || null,
  //         street: provider.address.street || '',
  //         number: provider.address.number || '',
  //         floor: provider.address.floor || '',
  //         apartment: provider.address.apartment || '',
  //         postal_code: provider.address.postal_code || '',
  //         city: provider.address.city?.id_city || '',
  //         department: provider.address.city?.department?.id_department || '',
  //         province: provider.address.city?.department?.province?.id_province || ''
  //       }
  //     });
  //   }
  // }, [provider]);
  
  
  useEffect(() => {
    if (provider?.address) {
      setFormData({
        id_address: provider.address.id_address || null,
        street: provider.address.street || '',
        number: provider.address.number || '',
        floor: provider.address.floor || '',
        apartment: provider.address.apartment || '',
        postal_code: provider.address.postal_code || '',
        city: provider.address.city?.id_city || '',
        department: provider.address.city?.department?.id_department || '',
        province: provider.address.city?.department?.province?.id_province || ''
      });
    }
  }, [provider]);

  
  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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
    try {
      const departmentsData = await getDepartmentsByProvince(provinceId);
      setDepartments(departmentsData);
      setCities([]);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    handleChange(e);
    try {
      const citiesData = await getCitiesByDepartment(departmentId);
      setCities(citiesData);
    } catch (error) {
      console.error('Error fetching cities:', error);
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
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id_address: formData.address.id_address,
      street: formData.address.street,
      number: formData.address.number,
      floor: formData.address.floor,
      apartment: formData.address.apartment,
      postal_code: formData.address.postal_code,
      city: parseInt(formData.address.city, 10) || null  // 👈 convierte a entero o null
    };

    console.log('Submitting address data:', payload);
    try {
      await updateProvider(token, { address: payload });
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const payload = {
  //     id_address: formData.id_address,
  //     street: formData.street,
  //     number: formData.number,
  //     floor: formData.floor,
  //     apartment: formData.apartment,
  //     postal_code: formData.postal_code,
  //     city: parseInt(formData.city, 10) || null  // Asegurás que sea número o null
  //   };

  //   console.log('Submitting address data:', payload);

  //   try {
  //     await updateProvider(token, payload);  // ⬅️ ya no envolvés en { address: payload }
  //     onUpdate();
  //     handleClose();
  //   } catch (error) {
  //     console.error('Error updating address:', error);
  //   }
  // };



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
              <strong>Calle:</strong> {provider?.address?.street}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Número:</strong> {provider?.address?.number}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Ciudad:</strong> {provider?.address?.city?.name}
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
            // formData={formData}
            formData={{
    ...formData,
    address: formData.address || {
      street: "",
      number: "",
      floor: "",
      apartment: "",
      postal_code: "",
      city: "",
      province: "",
      department: "",
    },
  }}
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
