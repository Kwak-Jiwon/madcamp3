// CustomModal.js
import React from 'react';
import './CustomModal.css';

const CustomModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">확인</button>
          <button onClick={onCancel} className="cancel-button">취소</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;