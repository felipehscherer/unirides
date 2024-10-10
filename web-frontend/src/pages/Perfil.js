import React, { useState } from "react";
import axios from "../services/axiosConfig";

function Perfil() {
  const [name, getNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, getCpf] = useState("");
  const [password, setSenha] = useState("");

  const verificarLogin = async () => {
    try {
      const resposta = await axios.get("/api/verificar-login", {
        withCredentials: true, // Isso é importante se você estiver usando cookies para autenticação
      });

      if (resposta.status === 200) {
        console.log("Usuário está logado:", resposta.data);
        return true; // Usuário está logado
      }
    } catch (erro) {
      console.error("Erro ao verificar login:", erro);
    }

    return false; // Usuário não está logado
  };

  //fetchProfile();

  //if (loading) return <div>Loading...</div>;
  //if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{Perfil.name}</h2>
      <p>Age: {Perfil.email}</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <p>Senha: {Perfil.password}</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit">Editar</button>
    </div>
  );
}

export default Perfil;
