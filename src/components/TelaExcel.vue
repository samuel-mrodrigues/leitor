<template>
  <div>
    <!-- Configurar em qual row ta o nome das colunas -->
    <div class="cCampo">
      <label for="xColunas"
        >Em qual linha se encontra o cabeçalho dos dados?</label
      >
      <input id="xColunas" type="number" min="1" v-model="linhaX" />
    </div>

    <!-- Mostrar as informações de como será salvo as informações -->
    <div class="cTabelaExcel">
      <Tabela
        :mapaExcel="mapaExcel"
        v-on:excluir-linha="excluirLinha"
        v-on:excluir-coluna="excluirColuna"
      />
    </div>

    <!-- Solicitar quais colunas apontam pra qual coluna do banco -->
    <div class="cColunas">

    </div>
  </div>
</template>

<script>
import { ExcelMap } from "../ExcelMap";

import Tabela from "./Tabela.vue";

export default {
  props: {
    dadosArray: [],
  },
  data() {
    return {
      mapaExcel: new ExcelMap(this.dadosArray),
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
  },
};
</script>

<style>
</style>