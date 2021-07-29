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

    <div>
      <span>Qual será a chave primaria?</span>
      <select name="chave" v-model="chavePrincipal">
        <option selected disabled>Selecione</option>
        <option
          v-for="coluna in mapaDBF.getColunas()"
          :key="coluna"
          :value="coluna"
        >
          {{ coluna }}
        </option>
      </select>
    </div>

    <!-- Fazer a gravação dos dados no DBF -->
    <div>
      <span>Remover espacos da Chave Primaria?</span>
      <input type="checkbox" v-model="removerEspacosChavePrimaria" />
      <br />
      <button @click="salvarDBF()">Salvar no DBF</button>
      <br>
      <button @click="recarregar()">Carregar arquivos novamente...</button>
    </div>
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

      // Contem todos os recordes no Excel
      recordsExcel: [],

      //Contem todos os records do DBF atualizados com novos dados dos que estão no Excel
      recordsDBF: [],

      // Contem todos os records que não existem no DBF e existem no Excel
      recordsCriados: [],

      chavePrincipal: "",
      removerEspacosChavePrimaria: false,

      linhaX: 1,
    };
  },
  methods: {
    recarregar() {
      this.$emit("recarregar")
    },
    salvarDBF() {
      console.log("Iniciando salvamento...");

      let listaDeRecords = [];
      for (
        let index = this.mapaExcel.x + 1;
        index < this.mapaExcel.getTotalLinhas();
        index++
      ) {
        // let linhaData = this.mapaExcel.arrayExcel[index];
        // let dadosSalvar = {};

        // // Passar por cada coluna de uma linha
        // let indexColuna = 0;
        // this.mapaExcel.getColunas().forEach((coluna) => {
        //   let colNoDBF = this.mapaExcel.getColunaDBF(coluna);
        //   if (colNoDBF != "") {
        //     dadosSalvar[colNoDBF] = linhaData[indexColuna];
        //   }
        //   indexColuna++;
        // });

        let dadosSalvar = this.mapaExcel.getRecorde(index);
        listaDeRecords.push(dadosSalvar);
      }

      // Contem todos os dados que tem no Excel
      this.recordsExcel = listaDeRecords;

      // Verificar os records no DBF e atualizar com os existentes no Excel
      this.checarExistentes();
    },
    checarExistentes() {
      console.log("Verificando todos os records do DBF se existem no Excel");
      console.log("Chave primaria sendo utilizada: " + this.chavePrincipal);
      console.log(
        "Remove espacos da chave primaria: " + this.removerEspacosChavePrimaria
      );

      console.log("Records presentes no Excel atualmente:");
      console.log(this.recordsExcel);
      console.log("-----------------");

      console.log("Iniciando leitura dos dados no DBF...");
      // Armazenar os records que serão salvos
      let records = [];

      // Armazenar os records existentes no Excel
      let recordesExistentes = [];

      // Pega todos os records do DBF e verifica se tem algo no Excel
      for (let index = 0; index < this.mapaDBF.getTotalRecordes(); index++) {
        // Record atual como está no DBF
        let record = this.mapaDBF.getRecorde(index);
        // Pega o valor da chave ID dessa linha atual
        let recordChave = this.removerEspacosChavePrimaria
          ? record[this.chavePrincipal].replaceAll(" ", "")
          : record[this.chavePrincipal];

        console.log(`Checando se ${recordChave} esta no Excel...`);

        let existeRecorde = this.getRecordASalvar(recordChave);

        if (existeRecorde != undefined) {
          recordesExistentes.push(existeRecorde);
          console.log(
            `${recordChave} encontrado no Excel, juntando os dados com o do Excel..`
          );

          for (const colunasAlteradas in existeRecorde) {
            console.log(
              `Alterando ${recordChave} ${colunasAlteradas}=${record[colunasAlteradas]} para > ${colunasAlteradas}=${existeRecorde[colunasAlteradas]}`
            );
            record[colunasAlteradas] = existeRecorde[colunasAlteradas];
          }
          records.push(record);
        } else {
          console.log(
            `${recordChave} não esta no Excel... Setando simplesmente tudo o que tinha no record do DBF no objeto`
          );
          records.push(record);
        }
      }
      // Pega todos os records do Excel e verifica se não ficou sem incluir
      console.log("Lista de records totais que serão salvas:");
      console.log(records);
      this.recordsDBF = records;

      console.log("Recordes existentes encontrados no Excel: ");
      console.log(recordesExistentes);

      // Adicionar os recordes novos que não existem no DBF
      this.checarNovos();
    },
    checarNovos() {
      console.log("Iniciando a adição de records novos do Excel no DBF..");

      let recordsNovos = [];
      for (const recordeExcel of this.recordsExcel) {
        let existe = false;
        for (const recordeDBF of this.recordsDBF) {
          console.log(
            `Verificando se ${recordeExcel[this.chavePrincipal]} == ${
              recordeDBF[this.chavePrincipal]
            }`
          );

          if (
            recordeExcel[this.chavePrincipal] == recordeDBF[this.chavePrincipal]
          ) {
            existe = true;
            break;
          }
        }

        if (!existe) {
          console.log(
            `${
              recordeExcel[this.chavePrincipal]
            } não esta no DBF, adicionando...`
          );
          recordsNovos.push(recordeExcel);
        }
      }

      console.log("Records que precisam ser criados no DBF..");
      console.log(recordsNovos);
      this.recordsCriados = recordsNovos;
    },
    getRecordASalvar(chaveValor) {
      for (const linha of this.recordsExcel) {
        if (linha[this.chavePrincipal] == chaveValor) {
          return linha;
        }
      }
    },
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