import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/Motorista.css';
import { Messages } from "primereact/messages";
import InputMask from "react-input-mask";
import MotoristaRequestBuilder from '../components/MotoristaRequestBuilder';
import { Toast } from "primereact/toast";

function EditarMotorista() {
    const [email, setEmail] = useState('');
    const [numeroCnh, setNumeroCnh] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [categoria, setCategoria] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const messagesRef = useRef(null);

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const response = await axios.get('/user/profile');
                const data = response.data;

                setEmail(data.email);

                const responseDriver = await axios.get(`/driver/get/${data.email}`);
                const driverData = responseDriver.data;

                setNumeroCnh(driverData.numeroCnh || '');
                setDataEmissao(formatDate(driverData.dataEmissao) || '');
                setDataValidade(formatDate(driverData.dataValidade) || '');
                setCategoria(driverData.categoria || '');
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

        const dados = new MotoristaRequestBuilder()
            .setEmail(email)
            .setNumeroCnh(numeroCnh)
            .setDataEmissao(dataEmissao)
            .setDataValidade(dataValidade)
            .setCategoria(categoria)
            .build();

        try {
            const response = await axios.put(
                `driver/update/${email}`,
                dados
            );
            const mensagem = "Dados de motorista atualizado com Sucesso!";

            showError('success', 'Sucesso:', mensagem);
            setTimeout(() => {
                navigate('/perfil');
            }, 2000);

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMsg = error.response.data;
                showError('error', 'Erro:', errorMsg);
            }
        }
    };

    const showError = (severity, summary, detail) => {
        messagesRef.current.clear();
        messagesRef.current?.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 5000
        });
    };

    return (
        <div className="driver-container">
            <Toast ref={messagesRef} />
            <div className="login-box">
                <form onSubmit={handleCadastro}>
                    <p className="driver-title">Editar dados da CNH</p>
                    <p className='driver-description'>Preencha as informações sobre sua CNH</p>
                    <InputMask
                        mask="999.999.999-99"
                        value={numeroCnh}
                        onChange={(e) => setNumeroCnh(e.target.value)}
                        placeholder="Digite o número da CNH"
                        required
                    >
                        {(inputProps) => <input {...inputProps} type="text" className="underline-input"/>}
                    </InputMask>
                    <InputMask
                        mask="99/99/9999"
                        type="text"
                        value={dataEmissao}
                        onChange={(e) => setDataEmissao(e.target.value)}
                        placeholder="Data de Emissao"
                        required
                    >
                        {(inputProps) => <input {...inputProps} type="text" className="underline-input"/>}
                    </InputMask>
                    <InputMask
                        mask="99/99/9999"
                        type="text"
                        value={dataValidade}
                        onChange={(e) => setDataValidade(e.target.value)}
                        placeholder="Data de validade"
                        required
                        className="underline-input"
                    >
                        {(inputProps) => <input {...inputProps} type="text" className="underline-input"/>}
                    </InputMask>
                    <InputMask
                        mask="a"
                        type="text"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        placeholder="Categoria da CNH"
                        required
                        className="underline-input"
                    >
                        {(inputProps) => <input {...inputProps} type="text" className="underline-input"/>}
                    </InputMask>
                    <div className='buttons-driver'>
                        <button type="submit" className='driver-button'>📝 Cadastrar</button>
                        <button
                            className='btn-profile-driver'
                            onClick={() => navigate('/perfil')}
                        >
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
            <Messages className='custom-toast' ref={messagesRef}/>
        </div>
    );
}

export default EditarMotorista;
