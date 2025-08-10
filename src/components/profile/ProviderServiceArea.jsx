import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { getProviderArea } from '../../services/locationServices.js';

const ProviderServiceArea = ({ providerId, onEdit }) => {
    const [serviceArea, setServiceArea] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!providerId) return;

        const fetchServiceArea = async () => {
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

        fetchServiceArea();
    }, [providerId]);

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
                            <ListGroup.Item key={city.id_city}>
                                {city.name}
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
