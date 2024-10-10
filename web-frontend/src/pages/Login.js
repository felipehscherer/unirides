import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from '../services/axiosConfig';
import './styles/Login.css'; 
import logoImage from '../assets/logo.jpg'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });
      // Salve o token de autenticação 
      localStorage.setItem('token', response.data.token);

      navigate('/perfil'); // vai pra /home
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Trate o erro 
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <img src={logoImage} alt="Logo" className="login-logo" />
        <p className="login-title">Faça seu login</p>

        <label htmlFor="email" className="login-label">Digite seu email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <label htmlFor="password" className="login-label">Digite sua senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
