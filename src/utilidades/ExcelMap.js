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

    getColunaDBF(colExcel) {
        for (const key in this.relExcelxDBF) {
            if (key == colExcel && this.relExcelxDBF[key] != "") {
                const nomeNoDBF = this.relExcelxDBF[key];
                return nomeNoDBF
            }
        }

        return ""
    }

    setRelacao(colExcel, colDBF) {
        this.updateRelacoes()
        this.relExcelxDBF[colExcel] = colDBF
        console.log(`Nova relação adicionada ${colExcel} >> ${colDBF}`);
    }

    setX(novaLinha) {
        this.x = novaLinha - 1
        console.log("Setando a linha principal para " + novaLinha);
    }

    excluirColuna(qualColuna) {
        console.log("Excluindo a coluna " + qualColuna);
        let novoArray = []
        for (let index = 0; index < this.getTotalLinhas(); index++) {
            const linhaAtual = this.arrayExcel[index]

            linhaAtual.splice(qualColuna, 1)
            novoArray.push(linhaAtual)
        }

        console.log("--------------");
        console.log("Novo array:");
        console.log(novoArray);

        this.arrayExcel = novoArray
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