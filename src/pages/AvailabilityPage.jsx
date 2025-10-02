import React from 'react';
import AvailabilityManager from "../components/availability/AvailabilityManager";
import { Container, Row, Col } from 'react-bootstrap';

const AvailabilityPage = () => {
  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <AvailabilityManager />
        </Col>
      </Row>
    </Container>
  );
};

export default AvailabilityPage;
