import React, { useState } from 'react';
import axios from '../services/axiosConfig';
import "./styles/Cadastro.css"
import { useNavigate } from 'react-router-dom';


const Cadastro = () => {
  
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [cep, setCep] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [endereco, setEndereco] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate();


  const validacao = () => {
    setEmailError('')
    setPasswordError('')

    if (password.length < 7) {
      setPasswordError('A senha deve conter 8 caracteres ou mais')
      return
    }

    if(!(password === passwordConfirm)){
      setPasswordError('As senhas não coincidem')
      return
    }

    handleSubmit()
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/register', { nome, email, cpf, password, telefone, dataNascimento, cep, cidade, estado, endereco }); // passa o parametros do body da request
      console.log('Sucesso!');
      // Redirecione para a tela de login ou exiba mensagem de sucesso
      navigate('/login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <div className='mainContainer'>
      <div className='titleContainer'>
        <h2>UniRides</h2>
      </div>
      <form onSubmit={handleSubmit}> 

        <div className='centro'>
          <h3>Algumas Informações Básicas</h3>
        </div>

        <div className='inputContainer'>
          <input
            type="text"
            name="nome"
            placeholder='Nome completo'
            value={nome}
            onChange={(ev) => setNome(ev.target.value)}
            className={'inputBox'}
            required
          />
        </div>

        <div className='inputContainer'>
          <input
            type="email"
            name="email"
            placeholder='Seu melhor e-mail'
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={'inputBox'}
            required
          />
          <label className="errorLabel">{emailError}</label>
        </div>

        <div className='inputContainer'>
          <input
            type="text"
            name="cpf"
            placeholder='CPF'
            value={cpf}
            onChange={(ev) => setCpf(ev.target.value)}
            className={'inputBox'}
            required
          />
        </div>

        <div className='inputContainer'>
          <input
            type="tel"
            name="telefone"
            placeholder='Telefone'
            value={telefone}
            onChange={(ev) => setTelefone(ev.target.value)}
            className={'inputBox'}
            required
          />
        </div>

        <div className='inputContainer'>
          <input
            type="text"
            name="dataNascimento"
            placeholder='Data de Nascimento' //Incluir máscara
            maxLength={10}
            value={dataNascimento}
            onChange={(ev) => setDataNascimento(ev.target.value)}
            className={'inputBox'}
            required
          />
        </div>
        <br />

        <div className='centro'>
          <h3>Endereço</h3>
        </div>

        <div className='inputContainer'>
          <input 
            type="text"
            name="cep"
            placeholder='CEP'
            value={cep}
            onChange={(ev) => setCep(ev.target.value)}
            className={'inputBox'}
            required
          />
        </div>

        <div className='inputContainer'>
          <input
            type="text"
            name="cidade"
            placeholder='Cidade' //fazer lista e/ou preencher automaticamente com o cep
            value={cidade}
            onChange={(ev) => setCidade(ev.target.value)}
            className={'inputBox'}
            required
          />
        </div>

        <div className='inputContainer'>
          <input
            type="text"
            name="estado"
            placeholder='Estado' //fazer lista e/ou preencher automaticamente com o cep
            value={estado} 
            onChange={(ev) => setEstado(ev.target.value)}
            className={'inputBox'}
            required
          />
        </div>
        
        <div className='inputContainer'>
          <input
            type="text"
            name="endereco"
            placeholder='Endereço'
            value={endereco}
            onChange={(ev) => setEndereco(ev.target.value)}
            className={'inputBox'}
            required
          />
        </div>
        <br />

        <div className='centro'>
          <h3>Senha</h3>
        </div>

        <div className='inputContainer'>
          <input //SENHAS
            type="password"
            name="password"
            placeholder='Uma senha forte'
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className={'inputBox'}
            required
          />
          <label className="errorLabel">{passwordError}</label>
        </div>

        <div className='inputContainer'> 
          <input
            type="password"
            name="passwordConfirm"
            placeholder='Confirmar Senha'
            value={passwordConfirm}
            onChange={(ev) => setPasswordConfirm(ev.target.value)}
            className={'inputBox'}
            required
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />

        <div className='inputContainer'>
        <button className='cadastrar' type="submit">Cadastrar</button>
        </div>
        
      </form>
    </div>
  );


} 

export default Cadastro;
