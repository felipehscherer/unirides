export class CadastroRequestBuilder {
    constructor() {
      this.data = {};
    }
  
    setName(name) {
      this.data.name = name;
      return this;
    }
  
    setEmail(email) {
      this.data.email = email;
      return this;
    }
  
    setCpf(cpf) {
      this.data.cpf = cpf.replace(/\D/g, ''); // Remove máscaras
      return this;
    }
  
    setPassword(password) {
      this.data.password = password;
      return this;
    }
  
    setPhone(telefone) {
      this.data.telefone = telefone.replace(/\D/g, ''); // Remove máscaras
      return this;
    }
  
    setBirthDate(dataNascimento) {
      this.data.dataNascimento = dataNascimento;
      return this;
    }
  
    setAddressDetails(cep, cidade, estado, endereco, numero, complemento) {
      this.data.cep = cep.replace(/\D/g, ''); // Remove máscaras
      this.data.cidade = cidade;
      this.data.estado = estado;
      this.data.endereco = endereco;
      this.data.numero = numero;
      this.data.complemento = complemento;
      return this;
    }
  
    build() {
      return this.data;
    }
  }