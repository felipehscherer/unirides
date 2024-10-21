import React, {useState, useEffect} from 'react';
import axios from '../services/axiosConfig';
import {useNavigate} from 'react-router-dom';
import './styles/Perfil.css';

const Perfil = () => {
    const [initialData, setInitialData] = useState({});
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [motorista, setMotorista] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/profile');
                const data = response.data;

                setInitialData(data);
                setEmail(data.email);
                setName(data.name);
                setCidade(data.cidade);
                setEstado(data.estado);
                setEndereco(data.endereco);
                setNumero(data.numero);
                setComplemento(data.complemento);

                try{
                const responseDriver = await axios.get(`/driver/get/${data.email}`);
                const driverData = response.data;

                if (driverData) {
                    setMotorista(true);
                }
                }catch (error){

                }


            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSaveAll = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const updatedData = {};
        if (name !== initialData.name) updatedData.name = name;
        if (email !== initialData.email) updatedData.email = email;
        if (cidade !== initialData.cidade) updatedData.cidade = cidade;
        if (estado !== initialData.estado) updatedData.estado = estado;
        if (endereco !== initialData.endereco) updatedData.endereco = endereco;
        if (numero !== initialData.numero) updatedData.numero = numero;
        if (complemento !== initialData.complemento) updatedData.complemento = complemento;
        if (currentPassword && newPassword) {
            updatedData.currentPassword = currentPassword;
            updatedData.newPassword = newPassword;
        }

        if (Object.keys(updatedData).length === 0) {
            alert('Nenhuma alteração foi feita.');
            return;
        }

        try {
            await axios.put('/user/profile/details', updatedData);
            alert('Informações atualizadas com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setInitialData((prev) => ({...prev, ...updatedData}));
        } catch (error) {
            setErrorMessage('Erro ao atualizar as informações.');
            console.error('Erro ao atualizar informações:', error);
        }
    };

    return (
        <div className="perfil-wrapper">
            <h1>Meu Perfil</h1>
            <div className="perfil-card">
                <form onSubmit={handleSaveAll} className="form-container">
                    <div className="input-container">
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Senha Atual (para alterar senha):</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Nova Senha:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Cidade:</label>
                        <input
                            type="text"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Estado:</label>
                        <input
                            type="text"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Endereço:</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Número:</label>
                        <input
                            type="text"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label>Complemento:</label>
                        <input
                            type="text"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="btn-primary">Salvar Tudo</button>
                </form>

                <div className="button-container">
                    {motorista ? (
                        <>
                            <button className="btn-action-green" onClick={() => navigate('/Motorista/gerenciar')}>
                                Gerenciar CNH
                            </button>
                            <button
                                className="btn-action-green"
                                onClick={() => navigate('/veiculo/gerenciar/cadastro')}
                            >
                                📝 Cadastrar Veiculo
                            </button>
                            <button
                                className="btn-action-green"
                                onClick={() => navigate('/veiculo/gerenciar/apresentarLista')}
                            >
                                🔎 Visualizar Veiculos
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn-action-green"
                                    onClick={() => navigate('/motorista/gerenciar/cadastro')}>
                                Cadastrar Cnh
                            </button>
                        </>
                    )}
                    <div/>
                </div>
                <button
                    className="btn-home"
                    onClick={() => navigate('/home')}
                >
                    Voltar para home
                </button>
            </div>
        </div>
    )
}

export default Perfil;
