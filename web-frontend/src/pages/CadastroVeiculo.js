import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/User.css';
import {Messages} from "primereact/messages";
import {Toast} from "primereact/toast";

function CadastroVeiculo() {
    const [email, setEmail] = useState('');
    const [color, setColor] = useState('');
    const [capacity, setCapacity] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [plate, setPlate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const messagesRef = useRef(null);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/profile');
                const data = response.data;

                setEmail(data.email)

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

            try {

                const dados = {email, color, capacity, model, brand, plate};
                const response = await axios.post(
                    'vehicle/register',dados

                );
                const mensagem = "Cadastro Realizado com sucesso!"

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
        } catch (error) {
            console.error("Erro ao cadastrar o veiculo:", error);
        }
    };

    const showError = (severity, summary, detail) => {
        messagesRef.current.clear();
        messagesRef.current.show({
            severity: severity,
            summary: summary,  // Mensagem de resumo
            detail: detail,    // Detalhe do erro
            life: 5000         // Tempo de exibição
        });

    }

    return (
        <div className="driver-container">
            <Toast ref={messagesRef}/>
            <div className="login-box">
                <form onSubmit={handleCadastro}>
                    <p className="driver-title">Cadastro de Veiculo</p>
                    <p className='driver-description'>Preencha as informações sobre seu veiculo</p>
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Cor"
                        className="underline-input"
                        required
                    />
                    <input
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Capacidade"
                        className="underline-input"
                        required
                    />
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Modelo"
                        className="underline-input"
                        required
                    />
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Marca"
                        className="underline-input"
                        required
                    />
                    <input
                        type="text"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        placeholder="Placa"
                        className="underline-input"
                        required
                    />
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
                <Messages className='custom-toast' ref={messagesRef}/>
            </div>
        </div>
    )
        ;
}

export default CadastroVeiculo;
