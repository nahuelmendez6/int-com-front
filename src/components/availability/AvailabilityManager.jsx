import React, { useState, useEffect } from 'react';
import { Form, Button, Card, ListGroup, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getProviderAvailability, updateProviderAvailability, deleteProviderAvailability, editProviderAvailability } from '../../services/availabilityService';
import ConfirmationModal from '../common/ConfirmationModal';

const daysMap = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 0: 'Domingo' };
const dayDisplayOrder = [1, 2, 3, 4, 5, 6, 0];

const AvailabilityManager = () => {
  const { id_provider, role, isLoading: isAuthLoading } = useAuth();
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);

  const fetchAvailability = async () => {
    if (!id_provider || role !== 'provider') return;
    try {
      // No longer setting main loading to true, to avoid UI flash
      // setLoading(true);
      const data = await getProviderAvailability(id_provider);
      const availabilityMap = data.reduce((acc, item) => {
        const day = item.day_of_week;
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
      }, {});
      setAvailability(availabilityMap);
    } catch (err) {
      setError('Error al cargar la disponibilidad.');
    } finally {
      setLoading(false); // This is for the initial load
    }
  };

  useEffect(() => {
    if (isAuthLoading) {
      return; // Wait until auth is settled
    }

    if (role === 'provider' && id_provider) {
      fetchAvailability();
    } else {
      // If not a provider or no id, stop loading
      setLoading(false);
    }
  }, [id_provider, role, isAuthLoading]);

  const handleTimeChange = (day, index, field, value) => {
    const updatedDaySlots = [...(availability[day] || [])];
    updatedDaySlots[index] = { ...updatedDaySlots[index], [field]: value };
    setAvailability(prev => ({ ...prev, [day]: updatedDaySlots }));
  };

  const handleAddNewSlot = (day) => {
    const newSlot = { id_availability: null, start_time: '', end_time: '' };
    const daySlots = availability[day] ? [...availability[day], newSlot] : [newSlot];
    setAvailability(prev => ({ ...prev, [day]: daySlots }));
  };

  const handleSaveSlot = async (day, index) => {
    const slot = availability[day][index];
    if (!slot.start_time || !slot.end_time) {
      setError('La hora de inicio y fin son obligatorias.');
      return;
    }

    if (!id_provider) {
        setError("No se pudo obtener el ID del proveedor. Intente recargar la página.");
        return;
    }

    setIsSubmitting(true);
    const payload = {
      id_provider: id_provider,
      day_of_week: day,
      start_time: slot.start_time.includes(':') && slot.start_time.length === 5 ? `${slot.start_time}:00` : slot.start_time,
      end_time: slot.end_time.includes(':') && slot.end_time.length === 5 ? `${slot.end_time}:00` : slot.end_time,
    };

    try {
      setError(null);
      if (slot.id_availability) {
        await editProviderAvailability(slot.id_availability, payload);
      } else {
        await updateProviderAvailability(payload);
      }
      await fetchAvailability();
    } catch (err) {
      setError(`Error al guardar el horario. Verifique que los tiempos no se superpongan.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSlotToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!slotToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteProviderAvailability(slotToDelete);
      setShowModal(false);
      setSlotToDelete(null);
      await fetchAvailability();
    } catch (err) {
      setError('Error al eliminar el horario.');
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || (role === 'provider' && loading)) return <Spinner animation="border" />;
  
  if (role !== 'provider') {
      return <Alert variant="warning">Esta sección es solo para proveedores.</Alert>
  }

  return (
    <>
      <Card>
        <Card.Header as="h4">Gestionar Disponibilidad Semanal</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          <ListGroup variant="flush">
            {dayDisplayOrder.map(day => (
              <ListGroup.Item key={day} className="p-3">
                <h5>{daysMap[day]}</h5>
                {availability[day] && availability[day].map((slot, index) => (
                  <Row key={slot.id_availability || `new-${index}`} className="align-items-center mb-2">
                    <Col md={4}>
                      <Form.Control type="time" value={slot.start_time} onChange={e => handleTimeChange(day, index, 'start_time', e.target.value)} disabled={isSubmitting} />
                    </Col>
                    <Col md={4}>
                      <Form.Control type="time" value={slot.end_time} onChange={e => handleTimeChange(day, index, 'end_time', e.target.value)} disabled={isSubmitting} />
                    </Col>
                    <Col md={2}>
                      <Button variant="success" size="sm" onClick={() => handleSaveSlot(day, index)} disabled={isSubmitting}>
                        {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> : 'Guardar'}
                      </Button>
                    </Col>
                    <Col md={2}>
                      {slot.id_availability && <Button variant="danger" size="sm" onClick={() => handleDeleteClick(slot.id_availability)} disabled={isSubmitting}>Eliminar</Button>}
                    </Col>
                  </Row>
                ))}
                <Button variant="primary" size="sm" className="mt-2" onClick={() => handleAddNewSlot(day)} disabled={isSubmitting}>+ Añadir horario</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Está seguro de que desea eliminar este horario?"
      />
    </>
  );
};

export default AvailabilityManager;