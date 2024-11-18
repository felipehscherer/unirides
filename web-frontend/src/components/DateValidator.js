import React, { useEffect } from 'react';

const DateValidator = ({ date, onError, showError }) => {
  useEffect(() => {
    if (date.length >= 10 && !validateDate(date)) {
      onError(true);
      showError('warn', 'Alerta:', 'Data inválida ou você deve ter pelo menos 16 anos!');
    } else {
      onError(false);
    }
  }, [date, onError, showError]);

  const validateDate = (date) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/; // regex DD/MM/AAAA
    if (!dateRegex.test(date)) {
      return false;
    }
    const [day, month, year] = date.split('/').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    const minAgeDate = new Date();
    minAgeDate.setFullYear(currentDate.getFullYear() - 16); // Define a data mínima (16 anos atrás)

    return (
      parsedDate.getFullYear() === year &&
      parsedDate <= currentDate &&
      parsedDate <= minAgeDate &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day
    );
  };

  return null; // Não precisa renderizar nada, apenas usamos o efeito colateral
};

export default DateValidator;
