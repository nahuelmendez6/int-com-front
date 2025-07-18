import React from 'react';
import { Nav } from 'react-bootstrap';

const StepsTabsNav = ({ steps, currentStep, setCurrentStep }) => (
  <Nav variant="tabs" className="mb-4 justify-content-center">
    {steps.map((step, index) => (
      <Nav.Item key={`tab-${index}`}>
        <Nav.Link active={index === currentStep} onClick={() => setCurrentStep(index)}>
          {step.title}
        </Nav.Link>
      </Nav.Item>
    ))}
  </Nav>
);

export default StepsTabsNav;
