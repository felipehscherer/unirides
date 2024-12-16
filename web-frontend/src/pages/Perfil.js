import React, {useEffect, useRef, useState} from 'react';
import axios from '../services/axiosConfig';
import {useNavigate} from 'react-router-dom';
import './styles/Perfil.css';
import {Messages} from 'primereact/messages';
import {HomeIcon} from "lucide-react";

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
    const messagesRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

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

                // Buscar imagem de perfil
                fetchProfileImage(data.email);

                try {
                    const responseDriver = await axios.get(`/driver/get/${data.email}`);
                    const driverData = responseDriver.data;

                    if (driverData) {
                        setMotorista(true);
                    }
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        setMotorista(false);
                    } else {
                        console.error('Erro ao verificar motorista:', error);
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

    const fetchProfileImage = async (email) => {
        try {
            const encodedEmail = encodeURIComponent(email);
            const response = await axios.get(`/user/${encodedEmail}/profile-image`, {responseType: 'blob'});
            const imageBlob = response.data;
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(imageBlob);
        } catch (error) {
            console.error('Erro ao buscar imagem de perfil:', error);
        }
    };

    const showError = (severity, summary, detail) => {
        messagesRef.current.clear();
        messagesRef.current?.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 5000,
        });
    };

    // Funções de validação
    const validateName = () => {
        if (!name.trim()) {
            return 'Nome não pode estar vazio.';
        } else if (name.length < 3 || name.length > 50) {
            return 'Nome deve ter entre 3 e 50 caracteres.';
        } else if (!/^[A-Za-z\s]+$/.test(name)) {
            return 'Nome deve conter apenas letras.';
        }
        return null;
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            return 'E-mail não pode estar vazio.';
        } else if (!emailRegex.test(email)) {
            return 'Formato de e-mail inválido.';
        }
        return null;
    };

    const validatePassword = () => {
        if (newPassword && newPassword.length < 8) {
            return 'A nova senha deve ter no mínimo 8 caracteres.';
        } else if (newPassword && !/[A-Z]/.test(newPassword)) {
            return 'A nova senha deve conter ao menos uma letra maiúscula.';
        } else if (newPassword && !/[a-z]/.test(newPassword)) {
            return 'A nova senha deve conter ao menos uma letra minúscula.';
        } else if (newPassword && !/[0-9]/.test(newPassword)) {
            return 'A nova senha deve conter ao menos um número.';
        } else if (newPassword && !currentPassword) {
            return 'Informe a senha atual para mudar a senha.';
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

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteDriver = async (email) => {
        try {
            await axios.delete(`/vehicle/delete/AllByUserEmail/${email}`);
            await axios.delete(`/driver/delete/${email}`);
            const mensagem = 'CNH desvinculada com sucesso!';

            showError('success', 'Sucesso:', mensagem);
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMsg = error.response.data;
                showError('error', 'Erro:', errorMsg);
            }
        }
    };

    const handleConfirmDelete = () => {
        handleDeleteDriver(email);
        closeDeleteModal();
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Exibir a imagem imediatamente
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Enviar a imagem para o backend
            const formData = new FormData();
            formData.append('file', file);
            try {
                const encodedEmail = encodeURIComponent(email);
                await axios.post(`/user/${encodedEmail}/upload-profile-image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Imagem enviada com sucesso');
            } catch (error) {
                console.error('Erro ao enviar imagem:', error);
            }
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#e8f6e8]">
            <header className="bg-[#43A715] text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Unirides</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <a
                                    href="/home"
                                    className="flex items-center hover:text-[#2e760f] transition-colors"
                                >
                                    <HomeIcon className="w-5 h-5 mr-1"/>
                                    Home
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <div className="user-container">
                <div className="user-box">
                    <h1>Meu Perfil</h1>
                    <div className="profile-image-container">
                        {profileImage ? (
                            <img src={profileImage} alt="Imagem de Perfil" className="profile-image"/>
                        ) : (
                            <img src="/placeholder-profile.png" alt="Imagem Padrão" className="profile-image"/>
                        )}
                        <button onClick={handleImageClick} className="btn-add-image">
                            Adicionar Imagem
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            style={{display: 'none'}}
                        />
                    </div>

                    <form onSubmit={handleSaveAll} className="user-box">
                        <div className="underline-input">
                            <input
                                placeholder="Nome"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="underline-input">
                            <input
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input className="underline-input-perfil"
                                   placeholder="Senha Atual (para alterar senha)"
                                   type="password"
                                   value={currentPassword}
                                   onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <input className="underline-input-perfil"
                                   placeholder="Nova senha"
                                   type="password"
                                   value={newPassword}
                                   onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <input className="underline-input-perfil"
                                   placeholder="cidade"
                                   type="text"
                                   value={cidade}
                                   onChange={(e) => setCidade(e.target.value)}
                            />
                        </div>
                        <div>
                            <input className="underline-input-perfil"
                                   placeholder="Estado"
                                   type="text"
                                   value={estado}
                                   onChange={(e) => setEstado(e.target.value)}
                            />
                        </div>
                        <div>
                            <input className="underline-input-perfil"
                                   placeholder="Endereço"
                                   type="text"
                                   value={endereco}
                                   onChange={(e) => setEndereco(e.target.value)}
                            />
                        </div>
                        <div>
                            <input className="underline-input-perfil"
                                   placeholder="Número"
                                   type="text"
                                   value={numero}
                                   onChange={(e) => setNumero(e.target.value)}
                            />
                        </div>
                        <div>
                            <input className="underline-input-perfil"
                                   placeholder="Complemento"
                                   type="text"
                                   value={complemento}
                                   onChange={(e) => setComplemento(e.target.value)}
                            />
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit" className="btn-primary">
                            Salvar Tudo
                        </button>
                    </form>

                    <div className="button-container">
                        {motorista ? (
                            <>
                                <div className="button-container-driver-vehicle">
                                    <div className="button-container-driver">
                                        <button
                                            className="button-driver-vehicle"
                                            onClick={() => navigate('/motorista/gerenciar/editar')}
                                        >
                                            Editar CNH
                                        </button>
                                        <button
                                            className="button-driver-vehicle"
                                            onClick={() => handleDeleteClick(email)}
                                        >
                                            Deletar CNH
                                        </button>
                                        {/* Modal de Exclusão */}
                                        {isDeleteModalOpen && (
                                            <div className="modal-overlay">
                                                <div className="modal-content">
                                                    <h2>Confirmar Exclusão</h2>
                                                    <p>
                                                        Você tem certeza que deseja desvincular sua CNH?
                                                        Todos os seus veículos vinculados serão deletados.
                                                    </p>
                                                    <div>
                                                        <div className="button-container">
                                                            <button
                                                                className={'manage-Btn'}
                                                                onClick={handleConfirmDelete}
                                                            >
                                                                ✔ Confirmar
                                                            </button>
                                                            <button
                                                                className={'manage-Btn'}
                                                                onClick={closeDeleteModal}
                                                            >
                                                                ❌ Cancelar
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
                                            Cadastrar Veículo
                                        </button>
                                        <button
                                            className="button-driver-vehicle"
                                            onClick={() => navigate('/veiculo/gerenciar/apresentarLista')}
                                        >
                                            Visualizar Veículos
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    className="button-register-cnh"
                                    onClick={() => navigate('/motorista/gerenciar/cadastro')}
                                >
                                    Cadastrar CNH
                                </button>
                            </>
                        )}
                        <div/>
                    </div>
                    <button className="btn-home" onClick={() => navigate('/home')}>
                        Voltar para home
                    </button>
                    <Messages className="custom-toast" ref={messagesRef}/>
                </div>
            </div>
            <footer className="bg-[#43A715] text-white py-4 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">&copy; 2023 RideShare. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Perfil;
