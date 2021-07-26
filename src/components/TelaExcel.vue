<template>
  <div>
    <br />

    <div class="campo">
      <label for="xColunas"
        >Em qual linha se encontra o cabeçalho dos dados?</label
      >
      <input id="xColunas" type="number" min="1" />
    </div>
  </div>
</template>

<script>
import { ExcelMap } from "../ExcelMap";

export default {
  props: {
    dadosArray: [],
  },
  mounted() {
    console.log("Montando tela de dados..");

    this.mapaExcel = new ExcelMap(this.dadosArray);
  },
  data() {
    return {
      mapaExcel: "",
    };
  },
};
</script>

<style>
</style>