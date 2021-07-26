<template>
  <div>
    Tela de Inicio
    <div v-if="!arquivoValidado">
      <br />
      Selecione o arquivo
      <br />
      <input type="file" ref="arquivo" @change="getArquivos" />
    </div>

    <div v-else>
      <TelaExcel :dadosArray="dadosPlanilha" />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

import TelaExcel from "./TelaExcel.vue";

export default {
  components: {
    TelaExcel,
  },
  mounted() {
    this.receberDadosExcel()
    this.arquivo = {
      path: "C:\\Users\\samuel\\Desktop\\teste.xlsx",
      name: "teste.xlsx",
    };
    this.enviarArquivo();
  },
  data() {
    return {
      arquivo: "",
      arquivoValidado: false,
      dadosPlanilha: "",
    };
  },
  methods: {
    async getArquivos() {
      console.log("Novo input de arquivo...");
      this.arquivo = this.$refs.arquivo.files[0];

      this.enviarArquivo();
    },
    enviarArquivo() {
      console.log(this.arquivo);
      let resposta = ipcRenderer.sendSync("novo-arquivo", {
        path: this.arquivo.path,
        name: this.arquivo.name,
      });

      if (resposta.status == 0) {
        console.log("Arquivo é um Excel!");
      }
    },
    receberDadosExcel() {
      ipcRenderer.on("dados-excel", (evento, dados) => {
        console.log("Recebi os dados!");
        this.dadosPlanilha = dados
        this.arquivoValidado = true;
      });
    },
  },
};
</script>

<style>
</style>