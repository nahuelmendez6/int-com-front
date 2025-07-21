// import { useState, useEffect } from 'react';
// import { getProvinces, 
//         getDepartmentsByProvince, 
//         getCitiesByDepartment } from '../services/locationServices';

// import { getCategories,
//         getTypeProviders,
//        getProfessions
//                       } from '../services/profileService';


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


// hooks/useProviderRegistrationForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const useProviderRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastname: '',
    role: 'provider', // o 'customer' según el contexto
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrors('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;

    try {
      await registerUser(dataToSend);
      setSuccessMessage('¡Registro exitoso!');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      console.error('Error en registro:', err);
      const errorMsg =
        err.detail ||
        err.message ||
        (typeof err === 'string' ? err : 'Error al registrar usuario');
      setErrors(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    errors,
    successMessage,
  };
};

export default useProviderRegistrationForm;



// const useProviderRegistrationForm = () => {

//     // Estados de ubicaciones
  
//   const [provincesAddress, setProvincesAddress] = useState([]);
//   const [provincesServices, setProvincesServices] = useState([]);

//   const [addressDepartments, setAddressDepartments] = useState([]);
//   const [addressCities, setAddressCities] = useState([]);

//   const [servicesDepartments, setServicesDepartments] = useState([]);
//   const [servicesCities, setServicesCities] = useState([]);

//   // Estados de perfil
//   const [categories, setCategories] = useState([]);
//   const [typeProviders, setTypeProviders] = useState([]);
//   const [professions, setProfessions] = useState([]);


//   // Paso actual del formulario 

//   const [currentStep, setCurrentStep] = useState(0);

  
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setErrors] = useState(null);
//   const [success, setSuccess] = useState(false);


//   // Formulario principal

//   const [formData, setFormData] = useState({
//     name: '',
//     lastname: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     description: '',
//     typeProvider: '',
//     profession: '',
//     address: {
//       street: '',
//       number: '',
//       floor: '',
//       apartment: '',
//       postal_code: '',
//       province: '',
//       department: '',
//       city: '',
//     },
//     serviceArea: {
//       province: '',
//       departments: [],
//       cities: [],
//     },
//     categories: [],
//   });


//   // Carga inicial de provincias 
//   // Se ejecuta al montar el componente, carga provincias y las guarda para ambos contextos

//   useEffect(() => {
//     getProvinces()
//       .then(data => {
//         setProvincesAddress(data);
//         setProvincesServices(data);
//       })
//       .catch(err => console.error('Error fetching provinces:', err));
//   }, []);


//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const [categoriesData, typeProvidersData, professionsData] = await Promise.all([
//           getCategories(),
//           getTypeProviders(),
//           getProfessions()
//         ]);
//         setCategories(categoriesData);
//         setTypeProviders(typeProvidersData);
//         setProfessions(professionsData);
//         console.log('Profesiones:', professionsData);
//         console.log('Categorías:', categoriesData);
//         console.log('Tipos:', typeProvidersData);

//       } catch (error) {
//         console.error('Error fetching profile data:', error);
//       }
//     };

//     fetchProfileData();
//   }, []);

//   // Actualizacion de campos

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const [section, field] = name.split('.');

//     if (field) {
//       setFormData(prev => ({
//         ...prev,
//         [section]: {
//           ...prev[section],
//           [field]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setErrors(null);
//     setSuccessMessage(null);
//     try {
//       const data = await registerUser(formData);
//       setSuccessMessage(data.message || 'Registro exitoso');
//     } catch (err) {
//       setErrors(err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Avanzar y retroceder pasos
//   // validacion basica al avanzar al siguiente paso

//   const handleNext = () => {
//     if (currentStep === 0) {
//       const { name, lastname, email, password, confirmPassword } = formData;
//       if (!name || !lastname || !email || !password || password !== confirmPassword) {
//         alert('Por favor, completa todos los campos obligatorios y verifica las contraseñas.');
//         return;
//       }
//     }
//     setCurrentStep(prev => prev + 1);
//   };

//   const handlePrevious = () => setCurrentStep(prev => prev - 1);


//   // Carga de departamentos y ciudades

//   const handleProvinceForAddress = async (e) => {
//     const selectedId = e.target.value;
//     setFormData(prev => ({
//       ...prev,
//       address: { ...prev.address, province: selectedId, department: '', city: '' }
//     }));

//     try {
//       const data = await getDepartmentsByProvince(selectedId);
//       setAddressDepartments(data);
//       setAddressCities([]);
//     } catch (error) {
//       console.error('Error cargando departamentos:', error);
//     }
//   };

//   // Al elegit una provincia para la direccion, se cargab sus departamentos
//   // al elegir un departamento, se cargan sus ciudades

//   const handleDepartmentForAddress = async (e) => {
//     const selectedId = e.target.value;
//     setFormData(prev => ({
//       ...prev,
//       address: { ...prev.address, department: selectedId, city: '' }
//     }));

//     try {
//       const data = await getCitiesByDepartment(selectedId);
//       setAddressCities(data);
//     } catch (error) {
//       console.error('Error cargando ciudades:', error);
//     }
//   };

//   // carga de departamentos y ciudades para el area de servicios

//   const handleProvinceForServices = async (e) => {
//     const selectedId = e.target.value;
//     setFormData(prev => ({
//       ...prev,
//       serviceArea: { ...prev.serviceArea, province: selectedId, departments: [], cities: [] }
//     }));

//     try {
//       const data = await getDepartmentsByProvince(selectedId);
//       setServicesDepartments(data);
//       setServicesCities([]);
//     } catch (error) {
//       console.error('Error cargando departamentos de servicios:', error);
//     }
//   };

//   // checkbox de departamentos y ciudades

//   const handleDepartmentCheckbox = async (e) => {
//     const deptId = e.target.value;
//     const isChecked = e.target.checked;

//     const updatedDepartments = isChecked
//       ? [...formData.serviceArea.departments, deptId]
//       : formData.serviceArea.departments.filter((id) => id !== deptId);

//     let updatedCities = [...formData.serviceArea.cities];

//     if (!isChecked) {
//       try {
//         const citiesOfDept = await getCitiesByDepartment(deptId);
//         const cityIds = citiesOfDept.map(c => c.id_city.toString());
//         updatedCities = updatedCities.filter(id => !cityIds.includes(id));
//       } catch (err) {
//         console.error('Error filtrando ciudades:', err);
//       }
//     }

//     setFormData(prev => ({
//       ...prev,
//       serviceArea: {
//         ...prev.serviceArea,
//         departments: updatedDepartments,
//         cities: updatedCities
//       }
//     }));

//     if (updatedDepartments.length > 0) {
//       try {
//         const allCities = (await Promise.all(
//           updatedDepartments.map(id => getCitiesByDepartment(id))
//         )).flat();

//         const uniqueCities = allCities.filter((c, i, arr) =>
//           arr.findIndex(ci => ci.id_city === c.id_city) === i
//         );

//         setServicesCities(uniqueCities);
//       } catch (err) {
//         console.error('Error cargando ciudades:', err);
//       }
//     } else {
//       setServicesCities([]);
//     }
//   };

//   // checkbox de ciudades para el area de servicios

//   const handleCityCheckbox = (e) => {
//     const cityId = e.target.value;
//     const isChecked = e.target.checked;
//     setFormData(prev => ({
//       ...prev,
//       serviceArea: {
//         ...prev.serviceArea,
//         cities: isChecked
//           ? [...prev.serviceArea.cities, cityId]
//           : prev.serviceArea.cities.filter(id => id !== cityId)
//       }
//     }));
//   };

//   return {
//     formData,
//     setFormData,
//     currentStep,
//     setCurrentStep,
//     provincesAddress,
//     provincesServices,
//     addressDepartments,
//     addressCities,
//     servicesDepartments,
//     servicesCities,
//     categories,
//     typeProviders,
//     professions,
//     handleChange,
//     handleNext,
//     handlePrevious,
//     handleProvinceForAddress,
//     handleDepartmentForAddress,
//     handleProvinceForServices,
//     handleDepartmentCheckbox,
//     handleCityCheckbox,
//   };
// };

// export default useProviderRegistrationForm;
