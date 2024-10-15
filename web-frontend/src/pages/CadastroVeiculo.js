    import React, {useEffect, useState} from 'react';
    import {useNavigate} from 'react-router-dom';
    import axios from '../services/axiosConfig';
    import './styles/CadastroVeiculo.css';
    import logoImage from '../assets/logo.jpg';

    function CadastroVeiculo() {
        const [email, setEmail] = useState('');
        const [color, setColor] = useState("");
        const [capacity, setCapacity] = useState("");
        const [model, setModel] = useState("");
        const [brand, setBrand] = useState("");
        const [plate, setPlate] = useState("");
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
            }catch (error) {
                console.error("Erro ao cadastrar o veiculo:", error);
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
                    <p className="register-title">🚗 Preencha as informações sobre seu carro </p>

                    <label htmlFor="color" className="register-label">🔵 Digite a cor</label>
                    <input
                        id="color"
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className={'input-container'}
                        placeholder="Cor"
                        required
                    />

                    <label htmlFor="capacity" className="register-label">💺 Digite a capacidade</label>
                    <input
                        id="capacity"
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className={'input-container'}
                        placeholder="Capacidade"
                        required
                    />

                    <label htmlFor="model" className="register-label">🚙 Digite o modelo</label>
                    <input
                        id="model"
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className={'input-container'}
                        placeholder="Modelo"
                        required
                    />

                    <label htmlFor="brand" className="register-label">🏷️ Digite a marca</label>
                    <input
                        id="brand"
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className={'input-container'}
                        placeholder="Marca"
                        required
                    />
                    <label htmlFor="plate" className="register-label">🔢 Digite a placa</label>
                    <input
                        id="password"
                        type="text"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        className={'input-container'}
                        placeholder="Placa"
                        required
                    />

                    <button type="submit">📝 Cadastrar</button>
                </form>
            </div>
        );
    }

    export default CadastroVeiculo;
