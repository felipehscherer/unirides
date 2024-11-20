import React, { useState, useRef} from 'react';
import axios from '../services/axiosConfig';
import "./styles/Cadastro.css"
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import PasswordValidator from '../components/PasswordValidator.js';
import DateValidator from '../components/DateValidator.js';
import CpfValidator from '../components/CpfValidator.js';
import logoImage from '../assets/logo.png';
import { Messages } from 'primereact/messages';
import { CadastroRequestBuilder } from '../components/CadastroRequestBuilder.js';
// Importações de estilos do PrimeReact
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

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
  const [complemento, setComplemento] = useState('')
  const [numero, setNumero] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [genericError, setGenericError] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const messagesRef = useRef(null);

  const showError = (severity, summary, detail) => {
    messagesRef.current.clear();
    messagesRef.current.show({
      severity: severity,
      summary: summary,  // Mensagem de resumo
      detail: detail,    // Detalhe do erro
      life: 5000         // Tempo de exibição
    });
  };

  const [cpfError, setCpfError] = useState(false); //
  const [isError, setIsError] = useState(false);
  const [cepError, setCepError] = useState(null);
  const [isTyping, setIsTyping] = useState(false); //


    const handleDateChange = (ev) => {
        const date = ev.target.value;
        setDataNascimento(date);
};

  const handleCpfChange = (ev) => {
    const cpfValue = ev.target.value;
    setCpf(cpfValue); // Atualiza o estado do CPF
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setCep(e.target.value);

    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) {
          showError('error', 'Erro:', 'CEP não encontrado!');
          return
        } else {
          setCidade(response.data.localidade)
          setEstado(response.data.estado)
          setEndereco(response.data.logradouro)
        }
      } catch (error) {
        showError('error', 'Erro:', 'Erro ao buscar o CEP');
      }
    }
  };

const handlePasswordFocus = () => {
  setIsTyping(true); // Marca que o usuário está começando a digitar
};

const handlePasswordBlur = () => {
  setIsTyping(false); // Marca que o usuário parou de digitar
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setPasswordError('')
  setGenericError('')
    if(name.trim().split(' ').length < 2){
    setGenericError('Campo "Nome" incompleto!')
    return
  }

  const dataToSend = new CadastroRequestBuilder()
    .setName(name)
    .setEmail(email)
    .setCpf(cpf)
    .setPassword(password)
    .setPhone(telefone)
    .setBirthDate(dataNascimento)
    .setAddressDetails(cep, cidade, estado, endereco, numero, complemento)
  .build();

  try {
    await axios.post('/auth/register', dataToSend);
    showError('success', 'Sucesso:', 'Cadastro realizado!');
    setTimeout(function() { 
      navigate('/login'); 
    }, 2000);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorMsg = error.response.data;
      setErrorMessage(errorMsg);
      showError('error', 'Erro:', errorMessage);  // Exibe o erro do backend
    }else{
      showError('error', 'Erro:', "Algo deu errado..");
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
                        <CpfValidator cpf={cpf} onError={setCpfError} showError={showError} />
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
                <DateValidator date={dataNascimento} onError={setIsError} showError={showError} />
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
              onFocus={handlePasswordFocus} // Marca o foco
              onBlur={handlePasswordBlur} // Marca quando perde o foco
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
              onFocus={handlePasswordFocus} // Marca o foco
              onBlur={handlePasswordBlur} // Marca quando perde o foco
              className={'inputBox'}
              required
            />
            <PasswordValidator
              password={password}
              passwordConfirm={passwordConfirm}
              onPasswordError={(error) => setPasswordError(error)}
              isTyping={isTyping}
            />
            <div id='box-senha'>
              <label className="errorLabel">{}</label>

              <div className={passwordError === '' ? 'tooltip-hidden' : 'tooltip'}>
                <span class="tooltip-text">A  no mínimo: 8 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 símbolo especial</span>
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
      <Messages className='custom-toast' ref={messagesRef} />
    </div>
  );
}

export default Cadastro;
