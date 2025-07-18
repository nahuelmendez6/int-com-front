import React from 'react';
import { Button } from 'react-bootstrap';

const FormNavigator = ({ currentStep, totalSteps, onPrevious, onNext }) => (
  <div className="d-flex justify-content-between mt-4">
    {currentStep > 0 && (
      <Button variant="secondary" onClick={onPrevious}>
        Anterior
      </Button>
    )}
    {currentStep < totalSteps - 1 && (
      <Button variant="primary" onClick={onNext}>
        Siguiente
      </Button>
    )}
    {currentStep === totalSteps - 1 && (
      <Button variant="success" type="submit">
        Registrarse
      </Button>
    )}
  </div>
);

export default FormNavigator;
