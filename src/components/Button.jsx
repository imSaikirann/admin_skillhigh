import React from 'react';

const Button = ({ label, handlebutton, className }) => {
    return (
        <button onClick={handlebutton} className={`p-2 rounded ${className}`}>
            {label}
        </button>
    );
};

export default Button;
