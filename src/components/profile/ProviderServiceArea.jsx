import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import { getProviderArea, removeCityFromProviderArea } from '../../services/locationServices.js';
import { FaTrash } from 'react-icons/fa';

const ProviderServiceArea = ({ providerId, onEdit, onUpdate }) => {
    const [serviceArea, setServiceArea] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingCity, setDeletingCity] = useState(null);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    const fetchServiceArea = async () => {
        if (!providerId) return;
        try {
            setLoading(true);
            const areaData = await getProviderArea(providerId);
            setServiceArea(areaData);
            setError(null);
        } catch (err) {
            setError('Error al cargar el área de servicio.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceArea();
    }, [providerId]);

    const handleDeleteCity = async (cityId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta ciudad de tu área de servicio?')) {
            return;
        }
        try {
            setDeletingCity(cityId);
            console.log('Eliminar cityId:', cityId, 'de providerId:', providerId);
            await removeCityFromProviderArea(token, providerId, cityId); // <-- corregido aquí
            if(onUpdate) {
                onUpdate();
            }
            fetchServiceArea(); // Re-fetch to update the list
        } catch (err) {
            console.error('Error deleting city:', err);
        } finally {
            setDeletingCity(null);
        }
    };


    if (loading) {
        return <p>Cargando área de servicio...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title className="mb-0">Ciudades de Cobertura</Card.Title>
                    <Button variant="secondary" size="sm" onClick={onEdit}>
                        Editar
                    </Button>
                </div>
                {serviceArea.length > 0 ? (
                    <ListGroup variant="flush">
                        {serviceArea.map((city) => (
                            <ListGroup.Item key={city.id_city} className="d-flex justify-content-between align-items-center">
                                {city.name}
                                <Button variant="link" className="text-danger" size="sm" onClick={() => handleDeleteCity(city.id_city)} disabled={deletingCity === city.id_city}>
                                    {deletingCity === city.id_city ? <Spinner as="span" animation="border" size="sm" /> : <FaTrash />}
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>No se ha definido un área de servicio.</p>
                )}
            </Card.Body>
        </Card>
    );
};

export default ProviderServiceArea;
