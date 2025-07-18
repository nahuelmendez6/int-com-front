import React from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import useProviderRegistrationForm from '../hooks/useProviderRegistrationForm';

import PersonalInfoForm from '../components/registrationForm/PersonalInfoForm';
import ProviderInfoForm from '../components/registrationForm/ProviderInfoForm';
import AddressForm from '../components/registrationForm/AddressForm';
import ServiceAreaForm from '../components/registrationForm/ServiceAreaForm';
import StepsTabsNav from '../components/registrationForm/StepsTabsNav';
import FormNavigator from '../components/registrationForm/FormNavigator';

const ProviderRegistrationForm = () => {
  const {
    formData,
    currentStep,
    setCurrentStep,
    provincesAddress,
    provincesServices,
    addressDepartments,
    addressCities,
    servicesDepartments,
    servicesCities,
    handleChange,
    handleNext,
    handlePrevious,
    handleProvinceForAddress,
    handleDepartmentForAddress,
    handleProvinceForServices,
    handleDepartmentCheckbox,
    handleCityCheckbox,

    professions,
    categories,
    typeProviders,

    handleSubmit,
    step,
    nextStep,
    prevStep,
    loading,
    errors,
    successMessage
  } = useProviderRegistrationForm();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Formulario enviado:', formData);
  //   alert('¡Registro exitoso!');
  // };

  const steps = [
    {
      title: 'Datos Personales',
      content: <PersonalInfoForm formData={formData} handleChange={handleChange} />,
    },
    {
      title: 'Información del Proveedor',
      content: <ProviderInfoForm 
                formData={formData} 
                handleChange={handleChange} 
                professions={professions}
                categories={categories}
                typeProviders={typeProviders}
                />,
    },
    {
      title: 'Dirección',
      content: (
        <AddressForm
          formData={formData}
          provinces={provincesAddress}
          departments={addressDepartments}
          cities={addressCities}
          handleChange={handleChange}
          handleProvinceChange={handleProvinceForAddress}
          handleDepartmentChange={handleDepartmentForAddress}
        />
      ),
    },
    {
      title: 'Ubicación y Servicios',
      content: (
        <ServiceAreaForm
          formData={formData}
          provinces={provincesServices}
          departments={servicesDepartments}
          cities={servicesCities}
          handleProvinceChange={handleProvinceForServices}
          handleDepartmentCheckbox={handleDepartmentCheckbox}
          handleCityCheckbox={handleCityCheckbox}
        />
      ),
    },
  ];

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--main-bg)' }}>
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={9} xl={8}>
          <Card className="p-4 shadow-lg" style={{ borderRadius: '1rem' }}>
            <Card.Body>
              <h2 className="mb-4 section-title text-center">Registro de Proveedor</h2>
              <StepsTabsNav steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
              <Form onSubmit={handleSubmit}>
                <div style={{ overflowX: 'hidden' }}>
                  <div
                    style={{
                      display: 'flex',
                      width: `${steps.length * 100}%`,
                      transform: `translateX(-${(currentStep / steps.length) * 100}%)`,
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    {steps.map((step, index) => (
                      <div key={`step-${index}`} style={{ width: `${100 / steps.length}%`, flexShrink: 0 }}>
                        {step.content}
                      </div>
                    ))}
                  </div>
                </div>
                <FormNavigator
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProviderRegistrationForm;
