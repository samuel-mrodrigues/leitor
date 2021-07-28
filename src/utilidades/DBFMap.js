class DBFMap {
    linhasDBF = []

    constructor(dados) {
        console.log("Inicializando mapa de DBF...");
        this.linhasDBF = dados
        console.log(this.linhasDBF);
    }

    getColunas() {
        if (this.getTotalColunas() != 0) {
            let colunas = []
            Object.keys(this.linhasDBF[0]).forEach(dataLinha => {
                if (dataLinha.indexOf("@") == -1) {
                    colunas.push(dataLinha)
                }
            })

            return colunas
        }

        return []
    }

    getTotalColunas() {
        return this.linhasDBF[0].length
    }

    getTotalRecordes() {
        return this.linhasDBF.length
    }

    getRecorde(row) {
        return this.linhasDBF[row]
    }
}

module.exports = { DBFMap }