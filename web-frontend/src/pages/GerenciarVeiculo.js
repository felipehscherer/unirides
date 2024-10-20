import {useNavigate} from 'react-router-dom';
import './styles/EditarVeiculo.css';

function GerenciarVeiculo() {

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
            </div>
        </div>
    );
}

export default GerenciarVeiculo;
