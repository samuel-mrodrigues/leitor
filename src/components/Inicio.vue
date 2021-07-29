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
      <TelaExcel :dadosPlanilha="dadosPlanilha" :dadosDBF="dadosDBF" 
      v-on:recarregar="recarregar()"/>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

import TelaExcel from "./TelaPrincipal.vue";

export default {
  components: {
    TelaExcel,
  },
  mounted() {
    this.receberDados();

    // this.enviarArquivo(this.arquivoExcel);
    // this.enviarArquivo(this.arquivoBanco);
  },
  data() {
    return {
      // arquivoExcel: {
      //   name: "Códigos KMX x HF.XLSX",
      //   path: "C:\\Users\\samuel\\Desktop\\teste\\Códigos KMX x HF.XLSX",
      // },
      // arquivoBanco: {
      //   name: "CASTELMOTORS.dbf",
      //   path: "C:\\Users\\samuel\\Desktop\\teste\\CASTELMOTORS.dbf",
      // },
      arquivoExcel: "",
      arquivoBanco: "",

      arquivosOk: false,

      dadosPlanilha: "",
      dadosDBF: "",
    };
  },
  watch: {
    arquivoExcel() {
      this.enviarArquivo(this.arquivoExcel);
    },
    arquivoBanco() {
      this.enviarArquivo(this.arquivoBanco);
    },
    dadosPlanilha() {
      if (this.dadosPlanilha != "" && this.dadosDBF != "") {
        console.log("Dados coletados, liberando visão...");

        this.arquivosOk = true;
      }
    },
    dadosDBF() {
      if (this.dadosPlanilha != "" && this.dadosDBF != "") {
        console.log("Dados coletados, liberando visão...");

        this.arquivosOk = true;
      }
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
    recarregar() {
      this.arquivosOk = false
      this.dadosPlanilha = ""
      this.dadosDBF = ""
      console.log("Recarregando arquivos..");

      this.enviarArquivo(this.arquivoExcel)
      this.enviarArquivo(this.arquivoBanco)
    },
    enviarArquivo(dados) {
      if (dados == "") return
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
      ipcRenderer.on("dados-excel", (evento, dados) => {
        // eslint-disable-line
        console.log("Recebi os dados Excel!");
        this.dadosPlanilha = dados;
        console.log(dados);
      });

      ipcRenderer.on("dados-dbf", (evento, dados) => {
        // eslint-disable-line
        console.log("Recebi os dados DBF!");
        this.dadosDBF = dados;
        console.log(this.dadosDBF);
      });
    },
  },
};
</script>

<style>
</style>