import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './styles/Perfil.css';

const Perfil = () => {
  const [emailPerfil, setEmailPerfil] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Estados para alteração de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user/profile');
        setEmail(response.data.email);
        setName(response.data.name);
        setEmailPerfil(response.data.email) // Novo estado para o nome
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Função para salvar o email atualizado
  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await axios.put('/user/profile/email', { email });
      alert('Email atualizado com sucesso!');
    } catch (error) {
      setErrorMessage('Erro ao atualizar email.');
      console.error('Erro ao atualizar email:', error);
    }
  };

  // Função para alterar a senha
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await axios.put('/user/profile/password', {
        currentPassword,
        newPassword,
      });
      alert('Senha atualizada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setErrorMessage('Erro ao atualizar senha.');
      console.error('Erro ao atualizar senha:', error);
    }
  };

  return (
    <div className="perfil-wrapper">
      <div className="perfil-card">
        <h2>Meu Perfil</h2>
        <div className="perfil-info">
          <p><strong>Nome:</strong> {name}</p>
          <p><strong>Email:</strong> {emailPerfil}</p>
        </div>
      </div>

      <form onSubmit={handleSaveEmail} className="form-container">
        <div className="input-container">
          <label>Atualizar Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="btn-primary">Salvar Email</button>
      </form>

      <form onSubmit={handleChangePassword} className="form-container">
        <div className="input-container">
          <label>Senha Atual:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label>Nova Senha:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="btn-primary">Salvar Nova Senha</button>
      </form>

      <div className="button-container">
        <button
          className="btn-action-green"
          onClick={() => navigate('/vincular-cnh')}
        >
          Vincular CNH
        </button>
        <button
          className="btn-action-green"
          onClick={() => navigate('/veiculos')}
        >
          Meus Veículos
        </button>
      </div>

      <div className="btn-home-container">
        <button
          className="btn-home"
          onClick={() => navigate('/home')}
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

export default Perfil;
