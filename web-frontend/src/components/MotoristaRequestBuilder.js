export default class MotoristaRequestBuilder {
    constructor() {
        this.data = {};
    }

    setEmail(email) {
        this.data.email = email;
        return this;
    }

    setNumeroCnh(numeroCnh) {
        this.data.numeroCnh = numeroCnh.replace(/\D/g, '');
        return this;
    }

    setDataEmissao(dataEmissao) {
        this.data.dataEmissao = dataEmissao;
        return this;
    }

    setDataValidade(dataValidade) {
        this.data.dataValidade = dataValidade;
        return this;
    }

    setCategoria(categoria) {
        this.data.categoria = categoria;
        return this;
    }

    build() {
        if (!this.data.numeroCnh || !this.data.dataEmissao || !this.data.dataValidade || !this.data.categoria) {
            throw new Error("Todos os campos devem ser preenchidos corretamente.");
        }
        return this.data;
    }
}
