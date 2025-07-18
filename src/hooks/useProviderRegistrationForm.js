import { useState, useEffect } from 'react';
import { getProvinces, 
        getDepartmentsByProvince, 
        getCitiesByDepartment,
        createAddress } from '../services/locationServices';

import { getCategories,
        getTypeProviders,
       getProfessions
                      } from '../services/profileService';


import { registerUser } from '../services/authService';

/**
 * cutom hook que encapsula la logica de formulario de registro de proveedor
 * dividio en pasos (multi-step form), incluyendo la gestion de datos de ubicacion
 * tanto particular como de servicios.
 * 
 * 
 * 
 * Este hook separa toda la lógica del formulario de registro de proveedores en un solo lugar, 
 * facilitando su reutilización, testeo y legibilidad. Maneja estados complejos, 
 * relaciones entre provincias/departamentos/ciudades y lógica de navegación entre pasos.
 * 
 */


const useProviderRegistrationForm = () => {

    // Estados de ubicaciones
  
  const [provincesAddress, setProvincesAddress] = useState([]);
  const [provincesServices, setProvincesServices] = useState([]);

  const [addressDepartments, setAddressDepartments] = useState([]);
  const [addressCities, setAddressCities] = useState([]);

  const [servicesDepartments, setServicesDepartments] = useState([]);
  const [servicesCities, setServicesCities] = useState([]);

  // Estados de perfil
  const [categories, setCategories] = useState([]);
  const [typeProviders, setTypeProviders] = useState([]);
  const [professions, setProfessions] = useState([]);


  // Paso actual del formulario 

  const [currentStep, setCurrentStep] = useState(0);

  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);


  // Formulario principal

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    type_provider: '',
    profession: '',
    address: {
      street: '',
      number: '',
      floor: '',
      apartment: '',
      postal_code: '',
      province: '',
      department: '',
      city: '',
    },
    serviceArea: {
      province: '',
      departments: [],
      cities: [],
    },
    categories: [],
  });


  // Carga inicial de provincias 
  // Se ejecuta al montar el componente, carga provincias y las guarda para ambos contextos

  useEffect(() => {
    getProvinces()
      .then(data => {
        setProvincesAddress(data);
        setProvincesServices(data);
      })
      .catch(err => console.error('Error fetching provinces:', err));
  }, []);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [categoriesData, typeProvidersData, professionsData] = await Promise.all([
          getCategories(),
          getTypeProviders(),
          getProfessions()
        ]);
        setCategories(categoriesData);
        setTypeProviders(typeProvidersData);
        setProfessions(professionsData);
        console.log('Profesiones:', professionsData);
        console.log('Categorías:', categoriesData);
        console.log('Tipos:', typeProvidersData);

      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  // Actualizacion de campos

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange called:', { name, value });
    const [section, field] = name.split('.');

    if (name === 'categories') {
      setFormData(prev => ({ ...prev, categories: value }));
      console.log('Updated formData.categories:', value);
    } else if (field) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); // ✅ ahora `e` está definido
  setLoading(true);
  setErrors(null);
  setSuccessMessage(null);

  try {
    console.log('Attempting to create address with data:', formData.address);
    const addressResponse = await createAddress(formData.address);
    const addressId = addressResponse.id;

    const registrationData = {
      ...formData,
      role: 'provider',
      address: addressId,
      categories: formData.categories.map((id) => parseInt(id, 10)),
    };

    // Eliminar campos opcionales si están vacíos para no enviar null, string vacío o 0
    if (formData.type_provider && formData.type_provider !== '' && formData.type_provider !== null && formData.type_provider !== undefined) {
      registrationData.type_provider = Number(formData.type_provider);
    } else {
      delete registrationData.type_provider;
    }
    if (formData.profession && formData.profession !== '' && formData.profession !== null && formData.profession !== undefined) {
      registrationData.profession = Number(formData.profession);
    } else {
      delete registrationData.profession;
    }

    // Eliminar datos que no son del backend
    delete registrationData.confirmPassword;
    delete registrationData.serviceArea;

    // Agregar las ciudades seleccionadas como parte del registro
    if (formData.serviceArea && Array.isArray(formData.serviceArea.cities) && formData.serviceArea.cities.length > 0) {
      registrationData.cities = formData.serviceArea.cities.map(id => Number(id));
    }

    const data = await registerUser(registrationData);
    setSuccessMessage(data.message || 'Registro exitoso');
  } catch (err) {
    console.error('Error during registration:', err);
    setErrors(err);
  } finally {
    setLoading(false);
  }
};



  // Avanzar y retroceder pasos
  // validacion basica al avanzar al siguiente paso

  const handleNext = () => {
    if (currentStep === 0) {
      const { name, lastname, email, password, confirmPassword } = formData;
      if (!name || !lastname || !email || !password || password !== confirmPassword) {
        alert('Por favor, completa todos los campos obligatorios y verifica las contraseñas.');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => setCurrentStep(prev => prev - 1);


  // Carga de departamentos y ciudades

  const handleProvinceForAddress = async (e) => {
    const selectedId = e.target.value;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, province: selectedId, department: '', city: '' }
    }));

    try {
      const data = await getDepartmentsByProvince(selectedId);
      setAddressDepartments(data);
      setAddressCities([]);
    } catch (error) {
      console.error('Error cargando departamentos:', error);
    }
  };

  // Al elegit una provincia para la direccion, se cargab sus departamentos
  // al elegir un departamento, se cargan sus ciudades

  const handleDepartmentForAddress = async (e) => {
    const selectedId = e.target.value;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, department: selectedId, city: '' }
    }));

    try {
      const data = await getCitiesByDepartment(selectedId);
      setAddressCities(data);
    } catch (error) {
      console.error('Error cargando ciudades:', error);
    }
  };

  // carga de departamentos y ciudades para el area de servicios

  const handleProvinceForServices = async (e) => {
    const selectedId = e.target.value;
    setFormData(prev => ({
      ...prev,
      serviceArea: { ...prev.serviceArea, province: selectedId, departments: [], cities: [] }
    }));

    try {
      const data = await getDepartmentsByProvince(selectedId);
      setServicesDepartments(data);
      setServicesCities([]);
    } catch (error) {
      console.error('Error cargando departamentos de servicios:', error);
    }
  };

  // checkbox de departamentos y ciudades

  const handleDepartmentCheckbox = async (e) => {
    const deptId = e.target.value;
    const isChecked = e.target.checked;
    console.log('handleDepartmentCheckbox called:', { deptId, isChecked });

    const updatedDepartments = isChecked
      ? [...formData.serviceArea.departments, deptId]
      : formData.serviceArea.departments.filter((id) => id !== deptId);

    let updatedCities = [...formData.serviceArea.cities];

    if (!isChecked) {
      try {
        const citiesOfDept = await getCitiesByDepartment(deptId);
        const cityIds = citiesOfDept.map(c => c.id_city.toString());
        updatedCities = updatedCities.filter(id => !cityIds.includes(id));
        console.log('Cities filtered after unchecking department:', updatedCities);
      } catch (err) {
        console.error('Error filtrando ciudades:', err);
      }
    }

    setFormData(prev => ({
      ...prev,
      serviceArea: {
        ...prev.serviceArea,
        departments: updatedDepartments,
        cities: updatedCities
      }
    }));
    console.log('Updated formData.serviceArea.departments:', updatedDepartments);

    if (updatedDepartments.length > 0) {
      try {
        const allCities = (await Promise.all(
          updatedDepartments.map(id => getCitiesByDepartment(id))
        )).flat();

        const uniqueCities = allCities.filter((c, i, arr) =>
          arr.findIndex(ci => ci.id_city === c.id_city) === i
        );

        setServicesCities(uniqueCities);
        console.log('Updated servicesCities:', uniqueCities);
      } catch (err) {
        console.error('Error cargando ciudades:', err);
      }
    } else {
      setServicesCities([]);
      console.log('servicesCities cleared.');
    }
  };

  // checkbox de ciudades para el area de servicios

  const handleCityCheckbox = (e) => {
    const cityId = e.target.value;
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      serviceArea: {
        ...prev.serviceArea,
        cities: isChecked
          ? [...prev.serviceArea.cities, cityId]
          : prev.serviceArea.cities.filter(id => id !== cityId)
      }
    }));
  };

  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    provincesAddress,
    provincesServices,
    addressDepartments,
    addressCities,
    servicesDepartments,
    servicesCities,
    categories,
    typeProviders,
    professions,
    handleChange,
    handleNext,
    handlePrevious,
    handleProvinceForAddress,
    handleDepartmentForAddress,
    handleProvinceForServices,
    handleDepartmentCheckbox,
    handleCityCheckbox,
    handleSubmit,
    errors,
    successMessage,
  };
};

export default useProviderRegistrationForm;
