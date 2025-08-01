
import React from 'react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="profile-header">
      <div className="profile-picture-container">
        <img src={user?.profilePicture || '/src/assets/react.svg'} alt="Foto de perfil" className="profile-picture" />
        <button className="edit-picture-btn">Editar foto</button>
      </div>
      <div className="profile-info">
        <h2>{user?.name} {user?.lastname}</h2>
        <p>{user?.provider?.description || 'Sin descripción'}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
