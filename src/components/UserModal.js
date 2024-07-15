// src/components/UserModal.js
import React from 'react';
import './UserModal.css';

const UserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>User Information</h2>
        <p>Name: {user.name}</p>
        <p>Cash: ${user.cash}</p>
        <p>Address: {user.address}</p>
      </div>
    </div>
  );
};

export default UserModal;
