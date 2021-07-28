class ExcelMap {
    x = 0
    arrayExcel = []
    relExcelxDBF = {}

    constructor(dados) {
        console.log("Inicializando mapa de Excel...");
        this.arrayExcel = dados
        console.log(this.arrayExcel);

        this.updateRelacoes()
    }

    updateRelacoes() {
        let novaRelacao = {}
        this.getColunas().forEach(coluna => {

            // Se existe na relacao, copia pro novo
            if (Object.keys(this.relExcelxDBF).indexOf(coluna) != -1) {
                novaRelacao[coluna] = this.relExcelxDBF[coluna]
            } else {
                novaRelacao[coluna] = ""
            }
        })

        this.relExcelxDBF = novaRelacao
    }

    getRelacoes() {
        return this.relExcelxDBF
    }

    setRelacao(colExcel, colDBF) {
        this.relExcelxDBF[colExcel] = colDBF
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

        this.updateRelacoes()
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