<template>
  <div>
    Relacionamento entre as colunas do Excel e do DBF
    <br />
    EXCEL >> DBF

    <div>
      <div v-for="colunaExcel in mapaExcel.getColunas()" :key="colunaExcel">
        <span>{{ colunaExcel }} >> </span>
        <select
          :name="colunaExcel"
          @change="
            $emit('add-relacionamento', colunaExcel, $event.target.value)
          "
        >
          <option value="" selected disabled>Selecione</option>
          <option
            v-for="colunaDBF in mapaDBF.getColunas()"
            :key="colunaDBF"
            :value="colunaDBF"
            v-show="!possuiRel(colunaDBF)"
          >
            {{ colunaDBF }}
          </option>
        </select>
      </div>

      <button @click="getStatus()">Examinar..</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mapaExcel: Object,
    mapaDBF: Object,
  },
  methods: {
    possuiRel(colDBF) {
      if (Object.values(this.mapaExcel.getRelacoes()).indexOf(colDBF) != -1) {
        return true;
      } else {
        return false;
      }
    },
    getStatus() {
      console.log(this.mapaExcel.getRelacoes());
    },
  },
};
</script>

<style>
</style>