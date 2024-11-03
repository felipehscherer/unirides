import React, { useState, useEffect } from 'react';

const CpfValidator = ({ cpf, onError, showError }) => {
  const [error, setError] = useState('');

  const TestaCPF = (strCPF) => {
    let Soma = 0;
    if (strCPF.split('').every(c => c === strCPF[0])) {
      return false; // Todos os dígitos iguais
    }

    for (let i = 1; i <= 9; i++) {
      Soma += parseInt(strCPF.charAt(i - 1)) * (11 - i);
    }
    let Resto = (Soma * 10) % 11;

    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto !== parseInt(strCPF.charAt(9))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) {
      Soma += parseInt(strCPF.charAt(i - 1)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;

    if (Resto === 10 || Resto === 11) Resto = 0;
    return Resto === parseInt(strCPF.charAt(10));
  };

  useEffect(() => {
    if (cpf.length >= 14) { // Verifica se o CPF está completo
      const cleanCpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (!TestaCPF(cleanCpf)) {
        onError(true);
        showError('warn', 'Alerta:', 'CPF inválido!'); // Exibe a mensagem desejada
      } else {
        setError('');
        onError(false);
      }
    } else {
      setError('');
      onError(false);
    }
  }, [cpf, onError, showError]);

  return (
    <div>
      {error && <label className="errorLabel">{error}</label>}
    </div>
  );
};

export default CpfValidator;
