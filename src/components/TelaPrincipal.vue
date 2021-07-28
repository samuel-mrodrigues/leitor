<template>
  <div>
    <!-- Configurar em qual row ta o nome das colunas -->
    <div>
      <label for="selColuna"
        >Em qual linha se encontra o cabeçalho dos dados?</label
      >
      <input id="selColuna" type="number" min="1" v-model="linhaX" />
    </div>

    <!-- Mostrar as informações de como será salvo as informações -->
    <div class="tabela">
      <Tabela
        :mapaExcel="mapaExcel"
        v-on:excluir-linha="excluirLinha"
        v-on:excluir-coluna="excluirColuna"
      />
    </div>

    <!-- Solicitar quais colunas apontam pra qual coluna do banco -->
    <Relacionamentos
      :mapaExcel="mapaExcel"
      :mapaDBF="mapaDBF"
      v-on:add-relacionamento="addRelacionamento"
    />

    <!-- Fazer a gravação dos dados no DBF -->
  </div>
</template>

<script>
import { ExcelMap } from "../utilidades/ExcelMap";
import { DBFMap } from "../utilidades/DBFMap";

import Tabela from "./tabela/Tabela.vue";
import Relacionamentos from "./Relacionamentos.vue";

export default {
  props: {
    dadosPlanilha: [],
    dadosDBF: [],
  },
  data() {
    return {
      mapaExcel: new ExcelMap(this.dadosPlanilha),
      mapaDBF: new DBFMap(this.dadosDBF),
      linhaX: 1,
    };
  },
  methods: {
    excluirColuna(indexColuna) {
      this.mapaExcel.excluirColuna(indexColuna);
    },
    excluirLinha(indexLinha) {
      this.mapaExcel.excluirLinha(indexLinha);
    },
    addRelacionamento(colExcel, colDBF) {
      this.mapaExcel.setRelacao(colExcel, colDBF);
    },
  },
  watch: {
    linhaX() {
      this.mapaExcel.setX(this.linhaX);
      console.log(`Coluna principal alterada para:`);
      console.log(this.mapaExcel.getColunas());
    },
  },
  components: {
    Tabela,
    Relacionamentos,
  },
};
</script>

<style>
</style>