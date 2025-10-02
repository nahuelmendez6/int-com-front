import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import AddressSection from '../../components/profile/AddressSection';
import ServiceAreaSection from '../../components/profile/ServiceAreaSection';
import ProviderServiceArea from '../../components/profile/ProviderServiceArea';

const LocationSectionPage = () => {
  const { provider, fetchProfileData, handleServiceAreaUpdate } = useOutletContext();
  const [isEditingServiceArea, setIsEditingServiceArea] = useState(false);

  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <AddressSection provider={provider} onUpdate={fetchProfileData} />
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Área de Servicio</Card.Title>
          {isEditingServiceArea ? (
            <ServiceAreaSection
              provider={provider}
              onUpdate={handleServiceAreaUpdate}
              onCancel={() => setIsEditingServiceArea(false)}
            />
          ) : (
            <ProviderServiceArea
              providerId={provider?.id_provider}
              onEdit={() => setIsEditingServiceArea(true)}
              onUpdate={handleServiceAreaUpdate}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LocationSectionPage;
