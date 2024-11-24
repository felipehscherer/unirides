import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { Messages } from 'primereact/messages';
import axios from '../services/axiosConfig';
import './styles/Cadastro.css';

const Cadastro = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    telefone: '',
    dataNascimento: '',
    cep: '',
    cidade: '',
    estado: '',
    endereco: '',
    numero: '',
    complemento: ''
  });
  
  const navigate = useNavigate();
  const messagesRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const buscarEnderecoPorCep = async (cep) => {
    const cepSemMascara = cep.replace(/\D/g, '');
    if (cepSemMascara.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepSemMascara}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          showMessage('error', 'Erro:', 'CEP não encontrado!');
          return;
        }

        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro,
          cidade: data.localidade,
          estado: data.uf
        }));
      } catch (error) {
        showMessage('error', 'Erro:', 'Não foi possível buscar o endereço.');
      }
    }
  };

  const showMessage = (severity, summary, detail) => {
    messagesRef.current?.clear();
    messagesRef.current?.show({
      severity,
      summary,
      detail,
      life: 5000,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.cpf || 
        !formData.telefone || !formData.dataNascimento || !formData.password) {
      showMessage('error', 'Erro:', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
        password: formData.password,
        telefone: formData.telefone.replace(/\D/g, ''), // Remove caracteres não numéricos
        dataNascimento: formData.dataNascimento,
        cep: formData.cep.replace(/\D/g, ''), // Remove caracteres não numéricos
        cidade: formData.cidade,
        estado: formData.estado,
        endereco: formData.endereco,
        numero: formData.numero,
        complemento: formData.complemento || '' // Garante que complemento não seja undefined
      };
      
      const response = await axios.post('/auth/register', payload);
      
      if (response.status === 200 || response.status === 201) {
        showMessage('success', 'Sucesso:', 'Cadastro realizado com sucesso!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error('Erro ao realizar cadastro');
      }
    } catch (error) {
      showMessage('error', 'Erro:', error.response?.data?.message || 'Algo deu errado durante o cadastro.');
    }
  };

  const getCurrentTitle = () => {
    return step === 1 ? 'Informações Pessoais' : 'Informações de Endereço';
  };

  const getCurrentDescription = () => {
    return step === 1 
      ? 'Preencha seus dados pessoais para criar sua conta.'
      : 'Agora, informe seu endereço para finalizar o cadastro.';
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        <p className="cadastro-title">{getCurrentTitle()}</p>
        <p className="cadastro-description">{getCurrentDescription()}</p>

        <form onSubmit={step === 1 ? handleNext : handleSubmit}>
          {step === 1 ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nome completo"
                required
                className="underline-input"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="E-mail"
                required
                className="underline-input"
              />

              <InputMask
                mask="999.999.999-99"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="CPF"
                className="underline-input"
                required
              />

              <InputMask
                mask="(99) 99999-9999"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="Telefone"
                className="underline-input"
                required
              />

              <InputMask
                mask="99/99/9999"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleInputChange}
                placeholder="Data de nascimento"
                className="underline-input"
                required
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Senha"
                required
                className="underline-input"
              />

              <button type="submit" className="submit-button">Próximo</button>
              <button type="button" className="secondary-button" onClick={() => navigate('/login')}>
                Já tem uma conta? Faça login
              </button>
            </>
          ) : (
            <>
              <InputMask
                mask="99999-999"
                name="cep"
                value={formData.cep}
                onChange={(e) => {
                  handleInputChange(e);
                  buscarEnderecoPorCep(e.target.value);
                }}
                placeholder="CEP"
                className="underline-input"
                required
              />

              <div className="input-row">
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Cidade"
                  required
                  className="underline-input"
                />
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="Estado"
                  required
                  className="underline-input"
                />
              </div>

              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                placeholder="Endereço"
                required
                className="underline-input"
              />

              <div className="input-row">
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  placeholder="Número"
                  className="underline-input"
                />
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  placeholder="Complemento"
                  className="underline-input"
                />
              </div>

              <button type="submit" className="submit-button">Cadastrar</button>
              <button type="button" className="secondary-button" onClick={handlePrevious}>
                Voltar
              </button>
            </>
          )}
        </form>
      </div>
      <Messages ref={messagesRef} className="custom-toast" />
    </div>
  );
};

export default Cadastro;