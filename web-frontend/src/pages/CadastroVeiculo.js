import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/CadastroVeiculo.css';
import logoImage from '../assets/logo.jpg';

function CadastroVeiculo() {
    const [email, setEmail] = useState('');
    const [color, setColor] = useState('');
    const [capacity, setCapacity] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [plate, setPlate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
                const response = await axios.post(
                    'vehicle/register',
                    {email, color, capacity, model, brand, plate}
                );
                alert('Cadastro Realizado com sucesso!');
                navigate('/perfil');
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const errorMsg = error.response.data;
                    setErrorMessage(errorMsg);
                    alert(errorMsg);
                }
            }
        } catch (error) {
            console.error("Erro ao cadastrar o veiculo:", error);
        }
    };

    return (
        <div className="register-container-vehicle">
            <div className="register-box-vehicle">
                <form onSubmit={handleCadastro}>
                    <img src={logoImage} alt="Logo" className="register-logo-vehicle"/>

                    <p className="register-title-vehicle">Preencha as informações sobre seu carro </p>

                    <label htmlFor="color" className="register-label-vehicle">Digite a cor</label>
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Cor"
                        required
                    />
                    <label htmlFor="capacity" className="register-label-vehicle">Digite a capacidade</label>
                    <input
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Capacidade"
                        required
                    />

                    <label htmlFor="model" className="register-label-vehicle">Digite o modelo</label>
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Modelo"
                        required
                    />

                    <label htmlFor="brand" className="register-label-vehicle">Digite a marca</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Marca"
                        required
                    />
                    <label htmlFor="plate" className={'register-label-vehicle'}>Digite a placa</label>
                    <input
                        type="text"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        placeholder="Placa"
                        required
                    />

                    <button type="submit" className={'button-register-vehicle'}>📝 Cadastrar</button>
                    <button
                        className={'btn-profile-vehicle'}
                        onClick={() => navigate('/perfil')}
                    >
                        Voltar para Perfil
                    </button>
                </form>
            </div>
        </div>
    )
        ;
}

export default CadastroVeiculo;
