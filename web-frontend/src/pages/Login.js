import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from '../services/axiosConfig';
import './styles/Login.css'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Messages } from 'primereact/messages';

function Login() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const messagesRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  const showMessage = (severity, summary, detail) => {
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
      showMessage('success', 'Sucesso:', 'Login realizado com sucesso!');
      // Salve o token de autenticação 
      localStorage.setItem('token', response.data.token);
      setTimeout(function() { 
        navigate('/home'); 
      }, 2000);
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 403)) {
        const errorMsg = error.response.data; 
        setErrorMessage(errorMsg);
        showMessage('error', 'Erro:', errorMessage);  // Exibe o erro do backend
      } else {
        showMessage('error', 'Erro:', "Algo deu errado..");  //erro caso o back esteja off
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <p className="login-title">Faça seu login</p>
        <p className="login-description">
          Acesse sua conta utilizando seu e-mail e senha cadastrados.
        </p>
  
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          required
          className="underline-input"
        />
  
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
          className="underline-input"
        />
  
        <button type="submit" className="submit-button">Entrar</button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate('/cadastro')} // Usando React Router para redirecionar
        >
          Não tem uma conta?
        </button>
      </form>
      <Messages className="custom-toast" ref={messagesRef} />
    </div>
  );
}

export default Login;
