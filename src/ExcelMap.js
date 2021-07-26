class ExcelMap {
    tituloColunas = 1

    constructor(dados) {
        console.log("Mapeando dados novos...");
        console.log(dados);
    }

    setLinhaTitulos(novaLinha) {
        this.tituloColunas = novaLinha
        console.log("Setando a linha principal para " + novaLinha);
    }


}

module.exports = {ExcelMap}