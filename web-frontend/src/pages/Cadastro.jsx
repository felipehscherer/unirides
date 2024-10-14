import React, { useState} from 'react';
import axios from '../services/axiosConfig';
import "./styles/Cadastro.css"
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import logoImage from '../assets/logo.png';
import Alert from '@mui/material/Alert';

//TODO: O alert aparece mas ainda é possível salvar com cpf, cep e etc errados
//TODO: Verificar se já existe alguém no banco com aquele cpf/celular/email

const regexUpperCase = /[A-Z]/;  // Verifica se contém ao menos uma letra maiúscula
const regexLowerCase = /[a-z]/;
const regexNumber = /\d/;
const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;  // Verifica se contém ao menos um símbolo especial

const Cadastro = () => {
  const [name, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [cep, setCep] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [endereco, setEndereco] = useState('')
  const [complemento, setComplemento] = useState('')  //adicionar no back
  const [numero, setNumero] = useState('')  //adicionar no back
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [genericError, setGenericError] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setCep(e.target.value);

    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) {
          <Alert variant="filled" severity="error">
            CEP não encontrado!
          </Alert>
        } else {
          setCidade(response.data.localidade)
          setEstado(response.data.estado)
          setEndereco(response.data.logradouro)
        }
      } catch (error) {
        //alert('Erro ao buscar CEP!');
        <Alert severity="error">
          Erro ao buscar o CEP!
        </Alert>
      }
    }
  };

  const validateDate = (date) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;  //regex DD/MM/AAAA
      if (!dateRegex.test(date)) {
      return false;
    }
    const [day, month, year] = date.split('/').map(Number);

    //Date vai ajustar datas inválidas automaticamente, precisamos verificar que isso nao ocorreu
    const parsedDate = new Date(year, month - 1, day); // Mês começa em 0
    const data = new Date();
    const anoAtual = data.getFullYear();
    return (
      parsedDate.getFullYear() === year &&
      parsedDate.getFullYear() <= (anoAtual - 16) && //ano de nascimento de pelo menos 16 anos atras
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day
    );
  };
  
  const handleDateChange = (ev) => {
    const date = ev.target.value;
    setDataNascimento(date)
  
    if (date.length>= 10 && !validateDate(date)) {
      alert('Data inválida!');
      //<Alert variant="filled" severity="error">CEP não encontrado!</Alert>
    } 
  };

  function TestaCPF(strCPF) {  //código da receita federal + modificações
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF.split('').every(c => c === cpf[0])) {  //testa se todos os numeros são iguais
      return false;
    }

    for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11))  Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11))  Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
  }

  const handleCpfChange = (ev) => {
    const cpf = ev.target.value;
    setCpf(cpf)
  
    if (cpf.length>=14 && !TestaCPF(cpf.replace(/\D/g, ''))) { 
      alert('CPF Inválido!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('')
    setGenericError('')

    if (password.length < 8) {
      setPasswordError('A senha deve ter 8 caracteres ou mais')
      return
    }else if(!regexUpperCase.test(password)){
      setPasswordError('A senha deve conter ao menos uma letra maiúscula')
      return
    }else if(!regexSpecialChar.test(password)){
      setPasswordError('A senha deve conter ao menos um caracter especial')
      return
    }else if(!regexNumber.test(password)){
      setPasswordError('A senha deve conter ao menos um número')
      return
    }else if(!regexLowerCase.test(password)){
      setPasswordError('A senha deve conter ao menos uma letra minúscula')
      return
    }

    if(!(password === passwordConfirm)){
      setPasswordError('As senhas não coincidem')
      return
    }

    if(name.trim().split(' ').length < 2){
      setGenericError('Campo "Nome" incompleto!')
      return
    }

    const dataToSend = {  //remoção de mascaras
      name: name, 
      email: email,
      cpf: cpf.replace(/\D/g, ''),
      password: password,
      telefone: telefone.replace(/\D/g, ''),
      //dataNascimento: dataNascimento.replace(/\D/g, ''),
      dataNascimento: dataNascimento,
      cep: cep.replace(/\D/g, ''),
      cidade: cidade,
      estado: estado,
      endereco: endereco,
      numero: numero,
      complemento: complemento
    };

    try {
      //await axios.post('/register', { name, email, cpf, password, telefone, dataNascimento, cep, cidade, estado, endereco }); // passa o parametros do body da request
      await axios.post('/auth/register', dataToSend);
      console.log('Sucesso!');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMsg = error.response.data; // Captura a mensagem de erro
        setErrorMessage(errorMsg); // Atualiza o estado
        alert(errorMsg); // Exibe o alerta imediatamente com a mensagem capturada
      }else{
        console.error('Erro ao cadastrar:', error);
      }
    }
  };

  return (
    <div className='mainContainer'>
      <div id='div-form-completo'>
      <div>
        <img src={logoImage} alt="Logo" className="login-logo" />
      </div>

        <form onSubmit={handleSubmit}> 
          <div id='div-infos-endereco'>
            <div id='div-infos-basicas'>
              
              <div className='centro'>
                <h3>Algumas Informações Básicas</h3>
              </div>

              <div className='inputContainer'>
                <input
                  type="text"
                  name="name"
                  placeholder='Nome completo'
                  value={name}
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
                    onChange={(ev) => handleCpfChange(ev)}
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
                  onChange={(ev) => handleDateChange(ev)}
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
                <InputMask
                  mask={cep === '' ? null : "99999-999"} 
                  maskChar={null} 
                  type="text"
                  name="cep"
                  placeholder='CEP'
                  value={cep}
                  onChange={(ev) => handleCepChange(ev)}
                  className={'inputBox'}
                  required
                />
              </div>

              <div className='inputContainer'>
                <input
                  type="text"
                  name="estado"
                  pattern="[^0-9]*"
                  placeholder='Estado'
                  value={estado} 
                  onChange={(ev) => setEstado(ev.target.value)}
                  className={'inputBox'}
                  required
                />
              </div>

              <div className='inputContainer'>
                <input
                  type="text"
                  name="cidade"
                  placeholder='Cidade'
                  value={cidade}
                  onChange={(ev) => setCidade(ev.target.value)}
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

              

              <div id='complemento-numero'>
              <div className='inputContainer'>
                  <input
                    type="number"
                    name="numero"
                    placeholder='Número'
                    value={numero}
                    onChange={(ev) => setNumero(ev.target.value)}
                    id='input-box-numero'
                  />
                </div>

                <div className='inputContainer'>
                  <input
                    type="text"
                    name="complemento"
                    placeholder='Complemento'
                    value={complemento}
                    onChange={(ev) => setComplemento(ev.target.value)}
                    id='input-box-complemento'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='centro'>
            <h3>Senha</h3>
          </div>

          <div className='inputContainer' id='input-container-senha'>
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
            <div id='box-senha'>
              <label className="errorLabel">{passwordError}</label>

              <div className={passwordError === '' ? 'tooltip-hidden' : 'tooltip'}>
                <span class="circle">?</span>
                <span class="tooltip-text">A senha deve conter, no mínimo: 8 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 símbolo especial</span>
              </div>
            </div>
            
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

