import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/CadastroMotorista.css';
import logoImage from "../assets/logo.jpg";

function EditarMotorista() {
    const [email, setEmail] = useState('');
    const [numeroCnh, setNumeroCnh] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [categoria, setCategoria] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/profile');
                const data = response.data;

                setEmail(data.email);

                const responseDriver = await axios.get(`/driver/get/${data.email}`);

                const driverData = responseDriver.data;

                setNumeroCnh(driverData.numeroCnh || '');
                setDataEmissao(driverData.dataEmissao || '');
                setDataValidade(driverData.dataValidade || '');
                setCategoria(driverData.categoria || '');

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

        const dados = {email, numeroCnh, dataEmissao, dataValidade, categoria}

        console.log(dados)

        try {
            const response = await axios.put(
                `driver/update/${email}`,
                dados
            );
            alert('Dados de motorista atualizado com Sucesso!');
            navigate('/perfil');
        } catch (error) {
            if (error.response) {
                const errorMsg = error.response.data;
                setErrorMessage(errorMsg);
                alert(errorMsg);
            }
        }
    };

    return (
        <div className="register-container">
            <form className="register-box" onSubmit={handleCadastro}>
                <button
                    className="btn-back"
                    onClick={() => navigate('/perfil')}
                >
                    ↩
                </button>
                <img src={logoImage} alt="Logo" className="register-logo"/>

                <p className="register-title">✏️ Edite suas as informações </p>

                <label htmlFor="numeroCnh" className="register-label">🪪 Digite o numero da sua CNH</label>
                <input
                    type="text"
                    value={numeroCnh}
                    onChange={(e) => setNumeroCnh(e.target.value)}
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

export default EditarMotorista;
