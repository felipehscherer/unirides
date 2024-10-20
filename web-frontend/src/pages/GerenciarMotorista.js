import {useNavigate} from 'react-router-dom';
import './styles/EditarVeiculo.css';

function GerenciarMotorista() {

    const navigate = useNavigate();

    return (
        <div className="gerenciar-container">
            <div className={"gerenciar-box"}>
                <button
                    className="gerenciar-Btn"
                    onClick={() => navigate('/perfil')}
                >
                    ↩ Voltar
                </button>
                <button
                    className="btn-action-green"
                    onClick={() => navigate('/motorista/gerenciar/cadastro')}
                >
                    📝 Vincular CNH
                </button>
                <button
                    className="btn-action-green"
                    onClick={() => navigate('/motorista/gerenciar/editar')}
                >
                    ✏️ Editar Cnh
                </button>
                <button
                    className="btn-action-green"
                    onClick={() => navigate('/motorista/gerenciar/apresentarLista')}
                >
                    🗑️ Desvincular Cnh
                </button>
            </div>
        </div>
    );
}

export default GerenciarMotorista;
