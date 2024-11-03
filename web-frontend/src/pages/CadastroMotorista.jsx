import React, { useState } from 'react';
import axios from '../services/axiosConfig';
import styles from './styles/CadastroMotorista.module.css'; // Importando o CSS Module
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const CadastroMotorista = () => {
  const [email, setEmail] = useState('');
  const [numeroCnh, setNumeroCnh] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [categoria, setCategoria] = useState('B');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !numeroCnh || !dataEmissao || !dataValidade) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/drivers', {
        email,
        numeroCnh,
        dataEmissao,
        dataValidade,
        categoria
      });
      console.log('Motorista criado com sucesso:', response.data);
      navigate('/home');
    } catch (err) {
      console.error('Erro ao criar motorista:', err);
      setError('Erro ao criar motorista. Tente novamente.');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <form onSubmit={handleSubmit} id="div-form-completo">
        <div className={styles.inputContainer}>
          <input
            className={styles.inputBox}
            type="email"
            placeholder='Email'
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <input
            className={styles.inputBox}
            type="text"
            placeholder='Número da CNH'
            value={numeroCnh}
            onChange={(ev) => setNumeroCnh(ev.target.value)}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="dataEmissao">Data de Emissão:</label>
          <input
            id="dataEmissao"
            className={styles.inputBox}
            type="date"
            value={dataEmissao}
            onChange={(ev) => setDataEmissao(ev.target.value)}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="dataValidade">Data de Validade:</label>
          <input
            id="dataValidade"
            className={styles.inputBox}
            type="date"
            value={dataValidade}
            onChange={(ev) => setDataValidade(ev.target.value)}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <select className={styles.inputBox} value={categoria} onChange={(ev) => setCategoria(ev.target.value)}>
            <option value="B">Categoria B</option>
            <option value="A">Categoria A</option>
          </select>
        </div>

        {error && <div className={styles.errorLabel}>{error}</div>}

        <div className={styles.inputContainer}>
          <button type="submit" className={styles.cadastrar}>Cadastrar Motorista</button>
        </div>
      </form>
    </div>
  );
};

export default CadastroMotorista;
