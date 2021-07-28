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

      recordsASalvar: [],
      

      chavePrincipal: "",
      removerEspacosChavePrimaria: false,

      linhaX: 1,
    };
  },
  methods: {
    salvarDBF() {
      console.log("Iniciando salvamento...");

      let listaDeRecords = [];
      for (
        let index = this.mapaExcel.x + 1;
        index < this.mapaExcel.getTotalLinhas();
        index++
      ) {
        let linhaData = this.mapaExcel.arrayExcel[index];
        console.log(
          "---------------------------------- [ PASSOU NO LOOOOOOOOP ] --------------------"
        );
        console.log(linhaData);

        let dadosSalvar = {};

        // Passar por cada coluna de uma linha
        let indexColuna = 0;
        this.mapaExcel.getColunas().forEach((coluna) => {
          console.log(
            `Coluna no Excel: ${coluna}, No DBF: ${this.mapaExcel.getColunaDBF(
              coluna
            )}`
          );

          let colNoDBF = this.mapaExcel.getColunaDBF(coluna);
          if (colNoDBF != "") {
            dadosSalvar[colNoDBF] = linhaData[indexColuna];
          }
          indexColuna++;
        });
        listaDeRecords.push(dadosSalvar);
      }

      this.recordsASalvar = listaDeRecords;
      console.log(
        "Coleta de dados terminada, resultado dos records coletados:"
      );
      console.log(listaDeRecords);
      this.checarExistentes();
    },
    checarExistentes() {
      console.log("Fazendo a junção dos dados do Excel e do DBF...");
      console.log("Chave primaria sendo utilizada: " + this.chavePrincipal);
      console.log(
        "Remove espacos da chave primaria: " + this.removerEspacosChavePrimaria
      );

      console.log("Records a salvar:");
      console.log(this.recordsASalvar);
      console.log("-----------------");

      let records = [];
      // Pega todos os records do DBF e verifica se tem algo no Excel
      for (let index = 0; index < this.mapaDBF.getTotalRecordes(); index++) {
        let record = this.mapaDBF.getRecorde(index);
        let recordChave = this.removerEspacosChavePrimaria
          ? record[this.chavePrincipal].replaceAll(" ", "")
          : record[this.chavePrincipal];

        console.log(`Checando se ${recordChave} esta no Excel...`);

        let existeRecorde = this.getRecordASalvar(recordChave);
        if (existeRecorde != undefined) {
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
        }
      }

      // Pega todos os records do Excel e verifica se não ficou sem incluir
      console.log("Inserindo os dados novos que estão no Excel..");
      console.log(this.recordsASalvar);
      
      console.log(
        "------------------------------------------------------------"
      );

      console.log(
        "Processo de juntar dados concluido. Resultado dos novos dados que serão inseridos:"
      );
      console.log(records);
    },
    getRecordASalvar(chaveValor) {
      for (const linha in this.recordsASalvar) {
        let recordeData = this.recordsASalvar[linha];

        if (recordeData[this.chavePrincipal] == chaveValor) {
          return recordeData;
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