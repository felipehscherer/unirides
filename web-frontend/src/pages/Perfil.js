import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './styles/Perfil.css';

const Perfil = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Estados para alteração de senha
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Buscar os dados do usuário ao montar o componente
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user/profile');
        setEmail(response.data.email);
        // Se necessário, você pode definir outros estados com os dados retornados
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Se o token estiver inválido ou expirado, redirecionar para o login
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
      // Limpar os campos de senha
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordFields(false);
    } catch (error) {
      setErrorMessage('Erro ao atualizar senha.');
      console.error('Erro ao atualizar senha:', error);
    }
  };

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>
      <form onSubmit={handleSaveEmail}>
        <div className="input-container">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="btn-salvar">Salvar Email</button>
      </form>

      <button
        onClick={() => setShowPasswordFields(!showPasswordFields)}
        className="btn-alterar-senha"
      >
        {showPasswordFields ? 'Cancelar' : 'Alterar Senha'}
      </button>

      {showPasswordFields && (
        <form onSubmit={handleChangePassword}>
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
          <button type="submit" className="btn-salvar">Salvar Nova Senha</button>
        </form>
      )}

      <div className="button-container">
        <button
          className="btn-cnh"
          onClick={() => navigate('/vincular-cnh')}
        >
          Vincular CNH
        </button>
        <button
          className="btn-veiculos"
          onClick={() => navigate('/veiculos')}
        >
          Meus Veículos
        </button>
      </div>
    </div>
  );
};

export default Perfil;
