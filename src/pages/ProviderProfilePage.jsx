import React, { useState, useEffect } from 'react';
import './ProviderProfile.css';
import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalDataSection from '../components/profile/PersonalDataSection';
import ProviderInfoForm from '../components/registrationForm/ProviderInfoForm';
import AddressForm from '../components/registrationForm/AddressForm';
import ServiceAreaForm from '../components/registrationForm/ServiceAreaForm';
import { getProviderProfile, updateUserProfile, getProfessions, getCategories, getTypeProviders } from '../services/profileService';
import { getProvinces, getDepartmentsByProvince, getCitiesByDepartment, getCities } from '../services/locationServices';
import { useAuth } from '../context/AuthContext';
import { Button } from 'react-bootstrap';

const ProviderProfilePage = () => {
  const { token } = useAuth();
  console.log('Token: ', token)
  const [user, setUser] = useState(null);
  const [providerData, setProviderData] = useState({
    description: '',
    type_provider: '',
    profession: '',
    categories: [],
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
  });

  const [professions, setProfessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeProviders, setTypeProviders] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch user and provider profile
        const profile = await getProviderProfile(token);
        setUser(profile);
        if (profile.provider) {
          setProviderData(prevData => ({
            ...prevData,
            description: profile.provider.description || '',
            type_provider: profile.provider.type_provider?.id || '',
            profession: profile.provider.profession?.id || '',
            categories: profile.provider.categories?.map(c => c.id) || [],
            address: {
              street: profile.provider.address?.street || '',
              number: profile.provider.address?.number || '',
              floor: profile.provider.address?.floor || '',
              apartment: profile.provider.address?.apartment || '',
              postal_code: profile.provider.address?.postal_code || '',
              province: profile.provider.address?.city?.department?.province?.id || '',
              department: profile.provider.address?.city?.department?.id || '',
              city: profile.provider.address?.city?.id || '',
            },
            serviceArea: {
              province: profile.provider.cities?.[0]?.department?.province?.id || '', // Assuming one province for service area
              departments: profile.provider.cities?.map(c => c.department.id) || [],
              cities: profile.provider.cities?.map(c => c.id) || [],
            },
          }));
        }

        // Fetch lookup data
        setProfessions(await getProfessions());
        setCategories(await getCategories());
        setTypeProviders(await getTypeProviders());
        setProvinces(await getProvinces());

      } catch (error) {
        console.error('Error al obtener el perfil o datos de lookup:', error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token]);

  // Handle changes for ProviderInfoForm
  const handleProviderInfoChange = (e) => {
    const { name, value } = e.target;
    setProviderData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes for AddressForm
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProviderData(prevData => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name.split('.')[1]]: value, // Handles 'address.street' etc.
      },
    }));
  };

  const handleAddressProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setProviderData(prevData => ({
      ...prevData,
      address: {
        ...prevData.address,
        province: provinceId,
        department: '', // Reset department and city
        city: '',
      },
    }));
    if (provinceId) {
      setDepartments(await getDepartmentsByProvince(provinceId));
    } else {
      setDepartments([]);
      setCities([]);
    }
  };

  const handleAddressDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setProviderData(prevData => ({
      ...prevData,
      address: {
        ...prevData.address,
        department: departmentId,
        city: '', // Reset city
      },
    }));
    if (departmentId) {
      setCities(await getCitiesByDepartment(departmentId));
    } else {
      setCities([]);
    }
  };

  // Handle changes for ServiceAreaForm
  const handleServiceAreaProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setProviderData(prevData => ({
      ...prevData,
      serviceArea: {
        ...prevData.serviceArea,
        province: provinceId,
        departments: [],
        cities: [],
      },
    }));
    if (provinceId) {
      setDepartments(await getDepartmentsByProvince(provinceId)); // Re-use departments state
    } else {
      setDepartments([]);
      setCities([]);
    }
  };

  const handleServiceAreaDepartmentCheckbox = (e) => {
    const departmentId = e.target.value;
    const isChecked = e.target.checked;
    setProviderData(prevData => ({
      ...prevData,
      serviceArea: {
        ...prevData.serviceArea,
        departments: isChecked
          ? [...prevData.serviceArea.departments, departmentId]
          : prevData.serviceArea.departments.filter(id => id !== departmentId),
      },
    }));
    // Fetch cities for selected department (simplified, might need more complex logic for multiple departments)
    if (isChecked && departmentId) {
      getCitiesByDepartment(departmentId).then(newCities => {
        setCities(prevCities => [...prevCities, ...newCities]);
      });
    } else if (!isChecked && departmentId) {
        setCities(prevCities => prevCities.filter(city => city.department.id !== parseInt(departmentId)));
    }
  };

  const handleServiceAreaCityCheckbox = (e) => {
    const cityId = e.target.value;
    const isChecked = e.target.checked;
    setProviderData(prevData => ({
      ...prevData,
      serviceArea: {
        ...prevData.serviceArea,
        cities: isChecked
          ? [...prevData.serviceArea.cities, cityId]
          : prevData.serviceArea.cities.filter(id => id !== cityId),
      },
    }));
  };

  const handleUpdateUser = async (userData) => {
    try {
      const updatedUser = await updateUserProfile(token, userData);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  const handleUpdateProvider = (e) => {
    e.preventDefault();
    console.log('Actualizando datos de proveedor...', providerData);
    // Here you would call your API to update the provider profile
    // You'll need to construct the payload based on providerData state
  };

  return (
    <div className="provider-profile-container">
      <ProfileHeader user={user} />
      <div className="profile-body">
        <PersonalDataSection user={user} onUpdate={handleUpdateUser} />

        <form onSubmit={handleUpdateProvider}>
          <h3>Información Profesional</h3>
          <ProviderInfoForm
            formData={providerData}
            handleChange={handleProviderInfoChange}
            categories={categories}
            typeProviders={typeProviders}
            professions={professions}
          />

          <h3>Dirección Principal</h3>
          <AddressForm
            formData={providerData}
            handleChange={handleAddressChange}
            handleProvinceChange={handleAddressProvinceChange}
            handleDepartmentChange={handleAddressDepartmentChange}
            provinces={provinces}
            departments={departments}
            cities={cities}
          />

          <h3>Zonas de Trabajo</h3>
          <ServiceAreaForm
            formData={providerData}
            provinces={provinces}
            departments={departments}
            cities={cities}
            handleProvinceChange={handleServiceAreaProvinceChange}
            handleDepartmentCheckbox={handleServiceAreaDepartmentCheckbox}
            handleCityCheckbox={handleServiceAreaCityCheckbox}
          />

          <Button variant="primary" type="submit">Guardar Cambios del Proveedor</Button>
        </form>
      </div>
    </div>
  );
};

export default ProviderProfilePage;