import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/CadastroMotorista.css';
import logoImage from "../assets/logo.jpg";

function CadastroMotorista() {
    const [email, setEmail] = useState('');
    const [cnh, setCnh] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [categoria, setCategoria] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
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

        fetchUserData();
    }, [navigate]);

    const handleCadastro = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'driver/register',
                {email, cnh, dataEmissao, dataValidade, categoria}
            );
            alert('Cadastro de motorista realizado com Sucesso!');
            navigate('/home');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
        }
    };

    return (
        <div className="register-container">
            <form className="register-box" onSubmit={handleCadastro}>
                <button
                    className="btn-back"
                    onClick={() => navigate('/home')}
                >
                    ↩
                </button>
                <img src={logoImage} alt="Logo" className="register-logo"/>

                <p className="register-title">🪪 Preencha as informações </p>

                <label htmlFor="cnh" className="register-label">🪪 Digite o numero da sua CNH</label>
                <input
                    type="text"
                    value={cnh}
                    onChange={(e) => setCnh(e.target.value)}
                    className={'input-container'}
                    placeholder="Cnh"
                    required
                />
                <label htmlFor="dataEmissao" className="register-label">📆 Digite a data de emissão</label>
                <input
                    type="date"
                    value={dataEmissao}
                    onChange={(e) => setDataEmissao(e.target.value)}
                    className={'input-container'}
                    placeholder="Data de Emissao"
                    required
                />
                <label htmlFor="dataValidade" className="register-label">📆 Digite a data de validade</label>
                <input
                    type="date"
                    value={dataValidade}
                    onChange={(e) => setDataValidade(e.target.value)}
                    className={'input-container'}
                    placeholder="Data de validade"
                    required
                />
                <label htmlFor="categoria" className="register-label">🔠 Digite a categoria</label>
                <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={'input-container'}
                    placeholder="Categoria"
                    required
                />

                <button type="submit">📝 Cadastrar</button>
            </form>
        </div>
    );
}

export default CadastroMotorista;
