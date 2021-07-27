<template>
  <div>
    Tela de Inicio
    <div v-if="!arquivosOk">
      <div class="campo">
        <label for="arquivoExcel">Selecione o arquivo Excel</label>
        <input
          id="arquivoExcel"
          type="file"
          ref="arquivoExcel"
          @change="getArquivoExcel"
        />
      </div>

      <div class="campo">
        <label for="arquivoBanco">Selecione o arquivo do banco .DBF</label>
        <input
          id="arquivoBanco"
          type="file"
          ref="arquivoBanco"
          @change="getArquivosBanco"
        />
      </div>
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
    this.receberDados();
    // this.arquivoExcel = {
    //   path: "E:\\Coisas de programacao\\teste.xlsx",
    //   name: "teste.xlsx",
    // };
    // this.enviarArquivo();
  },
  data() {
    return {
      arquivoExcel: "",
      arquivoBanco: "",

      arquivosOk: false,

      dadosPlanilha: "",
    };
  },
  watch: {
    arquivoExcel() {
      this.enviarArquivo(this.arquivoExcel)

      if (this.arquivoBanco != "") {
        this.arquivosOk = true
      }
    },
    arquivoBanco() {
      this.enviarArquivo(this.arquivoBanco)
    },
  },
  methods: {
    async getArquivoExcel() {
      console.log("Novo input de arquivo...");
      this.arquivoExcel = this.$refs.arquivoExcel.files[0];
    },
    async getArquivosBanco() {
      console.log("Novo input de arquivo do banco...");
      this.arquivoBanco = this.$refs.arquivoBanco.files[0];
    },
    enviarArquivo(dados) {
      console.log(dados);

      let resposta = ipcRenderer.sendSync("novo-arquivo", {
        path: dados.path,
        name: dados.name,
      });

      if (resposta.status == 0) {
        console.log("Arquivo aceito!");
      }
    },
    receberDados() {
      ipcRenderer.on("dados-excel", (evento, dados) => { // eslint-disable-line
        console.log("Recebi os dados Excel!");
        this.dadosPlanilha = dados;
      });

      ipcRenderer.on("dados-dbf", (evento, dados) => { // eslint-disable-line
        console.log("Recebi os dados DBF!");
  
      });
    },
  },
};
</script>

<style>
</style>