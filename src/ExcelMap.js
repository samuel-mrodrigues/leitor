class ExcelMap {
    x = 0
    arrayExcel = []

    constructor(dados) {
        console.log("Mapeando dados novos...");
        this.arrayExcel = dados
    }

    setX(novaLinha) {
        this.x = novaLinha - 1
        console.log("Setando a linha principal para " + novaLinha);
    }

    excluirColuna(qualColuna) {
        console.log("Excluindo a coluna " + qualColuna);
        let novoArray = []
        for (let index = this.x; index < this.getTotalLinhas(); index++) {
            const linhaAtual = this.arrayExcel[index]

            linhaAtual.splice(qualColuna, 1)
            novoArray.push(linhaAtual)
        }

        this.arrayExcel = novoArray

        console.log(this.arrayExcel);
        if (this.arrayExcel[this.x].length == 0) {
            console.log("Array igual a 0, setando pra vazio...");
            this.arrayExcel = []
        }
    }

    excluirLinha(qualLinha) {
        console.log("Excluindo a linha " + qualLinha);

        this.arrayExcel.splice(qualLinha + this.x + 1, 1)
    }

    getTotalLinhas() {
        return this.arrayExcel.length
    }

    getTotalColunas() {
        return this.arrayExcel[this.x].length
    }

    getColunas() {
        return this.arrayExcel[this.x]
    }

    getLinhas() {
        let linhas = []

        for (let index = this.x + 1; index < this.getTotalLinhas(); index++) {
            let linha = this.arrayExcel[index]

            linhas.push(linha)
        }

        return linhas
    }

}

module.exports = { ExcelMap }