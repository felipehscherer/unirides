import React, { useState } from 'react';
import axios from '../services/axiosConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      // Salve o token de autenticação 
      localStorage.setItem('token', response.data.token);
      // Redirecione para a página principal
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Trate o erro (exiba mensagem ao usuário)
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;