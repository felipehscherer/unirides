import React, { useState } from 'react';
import axios from '../services/axiosConfig';

function Cadastro() {
  const [name, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setSenha] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/register', { name, email, cpf, password }); // passa o parametros do body da request
      // Redirecione para a tela de login ou exiba mensagem de sucesso
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <form onSubmit={handleCadastro}>
      <input
        type="text"
        value={name}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        placeholder="CPF"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default Cadastro;
