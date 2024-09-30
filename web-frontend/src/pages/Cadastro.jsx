import React, { useState } from 'react';
import axios from '../services/axiosConfig';
import "./styles/Cadastro.css"
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import logoImage from '../assets/logo.png';

const removeMask = (value) => {
  return value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
};

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
  const [passwordError, setPasswordError] = useState('')
  const [genericError, setGenericError] = useState('')
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    setPasswordError('')
    setGenericError('')
    if (password.length <= 7) {
      setPasswordError('A senha deve conter 8 caracteres ou mais')
      return
    }
    if(!(password === passwordConfirm)){
      setPasswordError('As senhas não coincidem')
      return
    }

    if(telefone.length < 15 || !nome.includes(' ')){
      setGenericError('Verifique todos os campos!')
      return
    }

    //setDataNascimento(removeMask(dataNascimento))
    //console.log(removeMask(dataNascimento))

    try {
      await axios.post('/register', { nome, email, cpf, password, telefone, dataNascimento, cep, cidade, estado, endereco }); // passa o parametros do body da request
      console.log('Sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <div className='mainContainer'>
      <div>
        <img src={logoImage} alt="Logo" className="login-logo" />
      </div>
  

      <div id='div-form-completo'>
        <form onSubmit={handleSubmit}> 
          <div className='div-infos-endereco'>
            <div id='div-infos-basicas'>
              
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
              </div>

              <div className='inputContainer'>
                  <InputMask 
                    mask="999.999.999-99" 
                    maskChar={null} 
                    placeholder='CPF'
                    value={cpf}
                    onChange={(ev) => setCpf(ev.target.value)}
                    className={'inputBox'}
                    required
                  /> 
              </div>

              <div className='inputContainer'>
                <InputMask
                  mask={telefone === '' ? null : "(99) 99999-9999"} 
                  maskChar={null} 
                  placeholder='Telefone'
                  value={telefone}
                  onChange={(ev) => setTelefone(ev.target.value)}
                  className={'inputBox'}
                  required
                />
              </div>

              <div className='inputContainer'>
                <InputMask
                  mask={dataNascimento === '' ? null : "99/99/9999"} 
                  maskChar={null} 
                  placeholder='Data de nascimento'
                  value={dataNascimento}
                  onChange={(ev) => setDataNascimento(ev.target.value)}
                  className={'inputBox'}
                  required
                />
              </div>
            </div>
            
            <div className='espaco'>
              
            </div>

            <div id='div-endereco'>

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
                  pattern="[^0-9]*"
                  placeholder='Estado' //fazer lista e/ou preencher automaticamente com o cep, nao permitir numeros
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
            </div>
          </div>
        

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
          <div className='centro'>
            <label className="errorLabel">{genericError}</label>
          </div>
          <button className='cadastrar' type="submit">Cadastrar</button>
          </div>
          
        </form>
      </div>
    </div>
  );


} 

export default Cadastro;
