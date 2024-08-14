import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <button onClick={onClose} className="text-red-500 absolute top-2 right-2">X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
