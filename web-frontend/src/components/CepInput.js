import React, { useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
import CepValidator from './CepValidator';

const CepInput = ({ setCidade, setEstado, setEndereco, showError }) => {
  const [cep, setCep] = useState('');
  const [cepError, setCepError] = useState('');

  const handleCepChange = async (e) => {
    const cepValue = e.target.value.replace(/\D/g, '');
    setCep(e.target.value);

    if (cepValue.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepValue}/json/`);
        if (response.data.erro) {
          showError('error', 'Erro:', 'CEP não encontrado!');
          return;
        } else {
          setCidade(response.data.localidade);
          setEstado(response.data.uf); // Corrigido para 'uf'
          setEndereco(response.data.logradouro);
        }
      } catch (error) {
        showError('error', 'Erro:', 'Erro ao buscar o CEP');
      }
    }
  };

  return (
    <div className='inputContainer'>
      <InputMask
        mask={cep === '' ? null : "99999-999"}
        maskChar={null}
        type="text"
        name="cep"
        placeholder='CEP'
        value={cep}
        onChange={handleCepChange}
        className={'inputBox'}
        required
      />
      <CepValidator cep={cep} onError={setCepError} showError={showError} />
    </div>
  );
};

export default CepInput;
