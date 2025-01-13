import React, { useEffect } from 'react';

const Alert = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); 

      return () => clearTimeout(timer); 
    }
  }, [isVisible, onClose]);

  return (
    isVisible && (
      <div
        id="toast-bottom-right"
        className="fixed flex items-center w-full max-w-xs p-4 space-x-4 bg-main text-white rounded-lg shadow bottom-5 right-5"
        role="alert"
      >
        <div className="text-sm font-normal">{message}</div>
        <button
          onClick={onClose}
          className="ml-4 text-white"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    )
  );
};

export default Alert;
