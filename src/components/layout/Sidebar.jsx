import React, {useState, useEffect}from 'react';
import { Card, Image, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';

import { getProfile, getProviderProfile, getProviderProfileData  } from '../../services/profileService';

const Sidebar = () => {

  const { role } = useAuth();
  const [profile, setProfile] = useState(null);

  const [providerData, setProviderData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const data = await getProviderProfile(token);
        console.log("Profile data fetched:", data);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [])

  // useEffect(() => {
  //   const fetchProviderProfile = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) return;
  //       const data = await getProviderProfileData(token);
  //       console.log("Provider profile data fetched:", data);
  //       setProviderData(data);
  //     } catch (error) {
  //       console.error('Error fetching provider profile:', error);
  //     }
  //   };
  //   fetchProviderProfile();
  // }, [])

  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const data = await getProfile(token);
        console.log("Profile data fetched:", data);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }

      if (role === 'provider') {
        try {
          const providerData = await getProviderProfileData(token);
          console.log("Provider profile data fetched:", providerData);
          setProviderData(providerData);
        } catch (err) {
          console.error('Error fetching provider profile data:', err);
          setProviderData(null);
        }
      }
    };

    fetchProfile();
  }, [role]);


  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: '56px', // altura del navbar
        left: 0,
        backgroundColor: '#f3f2ef',
        overflowY: 'auto',
        borderRight: '1px solid #ddd',
        padding: '1rem',
      }}
    >
      <Card className="mb-4">
        <Card.Body className="text-center">
          <Image
            src={profile?.profile_image || "https://via.placeholder.com/80"}
            roundedCircle
            className="mb-2"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <Card.Title className="mb-0">
            {profile?.name} {profile?.lastname}
          </Card.Title>
          <Card.Text className="text-muted">
            {/* {providerData?.profession?.name || "Sin profesión"} */}
            {
              role == 'provider' && (
                <span>{providerData?.profession?.name || "Sin profesión asignada"}</span>
              )
            }
          </Card.Text>
        </Card.Body>
      </Card>

      <ListGroup variant="flush">
        {
          role === 'provider' && (
            <ListGroup.Item as={NavLink} to="/provider-profile">Mi Perfil</ListGroup.Item>
          )
        }
        { role === 'customer' && (
          <ListGroup.Item as={NavLink} to="/customer-profile">Mi Perfil</ListGroup.Item>
        )
        }
        {/* <ListGroup.Item as={NavLink} to="/profile">Mi perfil</ListGroup.Item> */}
        { role == 'provider' && (
          <>
            <ListGroup.Item as={NavLink} to="/portfolio">Portfolio</ListGroup.Item>
            {/* <ListGroup.Item as={NavLink} to="/address-management">Gestión de dirección</ListGroup.Item> */}
          </>  
        )}

        
        {/* <ListGroup.Item action href="#">Conexiones</ListGroup.Item> */}
        {/* <ListGroup.Item action href="#">Grupos</ListGroup.Item> */}
        {/* <ListGroup.Item action href="#">Eventos</ListGroup.Item> */}
        {/* <ListGroup.Item action href="#">Hashtags seguidos</ListGroup.Item> */}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
