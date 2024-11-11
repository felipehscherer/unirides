import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/CadastroMotorista.css';
import logoImage from "../assets/logo.jpg";

function CadastroMotorista() {
    const [email, setEmail] = useState('');
    const [numeroCnh, setNumeroCnh] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [categoria, setCategoria] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const response = await axios.get('/user/profile');
                const data = response.data;

                setEmail(data.email);

            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/home');
                }
            }
        };

        fetchDriverData();
    }, [navigate]);

    const handleCadastro = async (e) => {
        e.preventDefault();

        const dados = {email, numeroCnh, dataEmissao, dataValidade, categoria}

        try {
            const response = await axios.post('driver/register', dados);
            alert('Cadastro de motorista realizado com Sucesso!');
            navigate('/perfil');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMsg = error.response.data;
                setErrorMessage(errorMsg);
                alert(errorMsg);
            }
        }
    };

    return (<div className="register-container-driver">
        <div className="register-box-driver">
            <form onSubmit={handleCadastro}>
                <img src={logoImage} alt="Logo" className="register-logo-driver"/>

                <p className="register-title-driver">Preencha as informações sobre sua CNH </p>

                <label htmlFor="numeroCnh" className="register-label-driver">Digite o numero da sua CNH</label>
                <input
                    type="text"
                    value={numeroCnh}
                    onChange={(e) => setNumeroCnh(e.target.value)}
                    placeholder="Cnh"
                    required
                />
                <label htmlFor="dataEmissao" className="register-label-driver">Digite a data de emissão</label>
                <input
                    type="date"
                    value={dataEmissao}
                    onChange={(e) => setDataEmissao(e.target.value)}
                    placeholder="Data de Emissao"
                    required
                />
                <label htmlFor="dataValidade" className="register-label-driver">Digite a data de validade</label>
                <input
                    type="date"
                    value={dataValidade}
                    onChange={(e) => setDataValidade(e.target.value)}
                    placeholder="Data de validade"
                    required
                />
                <label htmlFor="categoria" className="register-label-driver">Digite a categoria</label>
                <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Categoria"
                    required
                />
                <div className={'buttons-driver'}>
                    <button type="submit" className={'button-register-driver'}>📝 Cadastrar</button>
                    <button
                        className={'btn-profile-driver'}
                        onClick={() => navigate('/perfil')}
                    >
                        Voltar para Perfil
                    </button>
                </div>
            </form>


        </div>
    </div>);
}

export default CadastroMotorista;
