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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


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
                try {
                    const responseDriver = await axios.get(`/driver/get/${data.email}`);
                    const driverData = responseDriver.data; // Corrige o uso de responseDriver

                    if (driverData) {
                        setMotorista(true);
                    }
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        setMotorista(false);
                    } else {
                        console.error("Erro ao verificar motorista:", error);
                    }
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

    // Funções de validação
    const validateName = () => {
        if (!name.trim()) {
            return "Nome não pode estar vazio.";
        } else if (name.length < 3 || name.length > 50) {
            return "Nome deve ter entre 3 e 50 caracteres.";
        } else if (!/^[A-Za-z\s]+$/.test(name)) {
            return "Nome deve conter apenas letras.";
        }
        return null;
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            return "E-mail não pode estar vazio.";
        } else if (!emailRegex.test(email)) {
            return "Formato de e-mail inválido.";
        }
        return null;
    };

    const validatePassword = () => {
        if (newPassword && newPassword.length < 8) {
            return "A nova senha deve ter no mínimo 8 caracteres.";
        } else if (newPassword && !/[A-Z]/.test(newPassword)) {
            return "A nova senha deve conter ao menos uma letra maiúscula.";
        } else if (newPassword && !/[a-z]/.test(newPassword)) {
            return "A nova senha deve conter ao menos uma letra minúscula.";
        } else if (newPassword && !/[0-9]/.test(newPassword)) {
            return "A nova senha deve conter ao menos um número.";
        } else if (newPassword && !currentPassword) {
            return "Informe a senha atual para mudar a senha.";
        }
        return null;
    };

    const handleSaveAll = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Validando todos os campos
        const nameError = validateName();
        const emailError = validateEmail();
        const passwordError = validatePassword();

        if (nameError || emailError || passwordError) {
            setErrorMessage(nameError || emailError || passwordError);
            return;
        }

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

    const handleDeleteClick = (vehicle) => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteDriver = async (email) => {
        try {
            await axios.delete(`/vehicle/delete/AllByUserEmail/${email}`)

            await axios.delete(`/driver/delete/${email}`);
            alert('Cnh desvinculada com sucesso!');
            navigate('/home')
        } catch (error) {
            console.error('Erro ao desvincular cnh:', error);
            alert(error);
        }
    };

    const handleConfirmDelete = () => {
        handleDeleteDriver(email);
        closeDeleteModal();

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

                <div className="button-container-driver">
                    {motorista ? (
                        <>
                        <div className="button-container-driver-vehicle">
                            <div className={'button-container-driver'}>
                                <button
                                    className="button-driver-vehicle"
                                    onClick={() => navigate('/motorista/gerenciar/editar')}
                                >
                                    Editar Cnh
                                </button>
                                <button className="button-driver-vehicle" onClick={() => handleDeleteClick(email)}>
                                    Deletar Cnh
                                </button>
                                {/* Modal de Exclusão */}
                                {isDeleteModalOpen && (
                                    <div className="modal-overlay">
                                        <div className="modal-content">
                                            <h2>Confirmar Exclusão</h2>
                                            <p>Você tem certeza que deseja desvincular sua cnh?
                                                Todos os seus veiculos vinculados serao deletados
                                            </p>
                                            <div>
                                                <div className="button-container">
                                                    <button className={'manage-Btn'} onClick={handleConfirmDelete}>✔
                                                        Confirmar
                                                    </button>
                                                    <button className={'manage-Btn'}
                                                            onClick={closeDeleteModal}>❌
                                                        Cancelar
                                                    </button>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    )}
                            </div>
                            <div className="button-container-driver">
                                <button
                                    className="button-driver-vehicle"
                                    onClick={() => navigate('/veiculo/gerenciar/cadastro')}
                                >
                                    Cadastrar Veiculo
                                    </button>
                                    <button
                                        className="button-driver-vehicle"
                                        onClick={() => navigate('/veiculo/gerenciar/apresentarLista')}
                                    >
                                        Visualizar Veiculos
                                    </button>
                                </div>
                        </div>
                                </>
                                ) : (
                                <>
                                <button className="button-driver-vehicle"
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
