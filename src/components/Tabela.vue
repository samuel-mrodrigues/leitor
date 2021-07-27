<template>
  <table>
    <tr>
      <th v-for="(coluna, index) in mapaExcel.getColunas()" :key="index">
        <div>
          <button @click="$emit('excluir-coluna', index)">
            Excluir Coluna
          </button>
        </div>
        {{ formatarData(coluna) }}
      </th>
    </tr>

    <tr v-for="(linha, index) in mapaExcel.getLinhas()" :key="index">
      <td v-for="(linhaDados, index) in linha" :key="index">
        {{ formatarData(linhaDados) }}
      </td>
      <div>
        <button @click="$emit('excluir-linha', index)">Excluir Linha</button>
      </div>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    mapaExcel: {
      type: Object,
    },
  },
  methods: {
    formatarData(data) {
      let formatado = data;

      if (formatado == null) return "Vazio";

      return formatado;
    },
  },
};
</script>

<style>
</style>