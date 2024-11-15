// src/components/CepValidator.js
import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';

const CepValidator = ({ cep, setCidade, setEstado, setEndereco, showError }) => {
  const [localCep, setLocalCep] = useState(cep);

  useEffect(() => {
    const fetchCepData = async () => {
      const formattedCep = localCep.replace(/\D/g, '');
      if (formattedCep.length === 8) {
        try {
          const response = await axios.get(`https://viacep.com.br/ws/${formattedCep}/json/`);
          if (response.data.erro) {
            showError('error', 'Erro:', 'CEP não encontrado!');
            return;
          }
          setCidade(response.data.localidade);
          setEstado(response.data.uf);
          setEndereco(response.data.logradouro);
        } catch (error) {
          showError('error', 'Erro:', 'Erro ao buscar o CEP');
        }
      }
    };

    fetchCepData();
  }, [localCep, setCidade, setEstado, setEndereco, showError]);

  const handleChange = (e) => {
    setLocalCep(e.target.value);
  };
};

export default CepValidator;