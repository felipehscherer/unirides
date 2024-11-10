import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from '../services/axiosConfig';
import './styles/Login.css'; 
import logoImage from '../assets/logo.jpg'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Messages } from 'primereact/messages';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const navigate = useNavigate();
  const messagesRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');


  const showError = (severity, summary, detail) => {
    messagesRef.current.clear();
    messagesRef.current.show({
      severity: severity,
      summary: summary,  // Mensagem de resumo
      detail: detail,    // Detalhe do erro
      life: 5000         // Tempo de exibição
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });
      // Salve o token de autenticação 
      localStorage.setItem('token', response.data.token);

      navigate('/home');
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 403)) {
        const errorMsg = error.response.data; 
        setErrorMessage(errorMsg);
        showError('error', 'Erro:', errorMessage);  // Exibe o erro do backend
      }else{
        showError('error', 'Erro:', "Algo deu errado..");  //erro caso o back esteja off
      }

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
      <Messages className='custom-toast' ref={messagesRef} />
    </div>
  );
}

export default Login;
