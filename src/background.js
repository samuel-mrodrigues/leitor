'use strict'

// import { carregarFuncoes } from "../src electron/index"
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import lerExcel from "read-excel-file/node"
import fs from "fs"

import { DBFFile } from "dbffile"

const isDevelopment = process.env.NODE_ENV !== 'production'
let janela;
let arquivoDBF = ""

ipcMain.on("novo-arquivo", async (evento, arquivo) => {
    if (arquivo.name.toLowerCase().indexOf(".xlsx") != -1 || arquivo.name.toLowerCase().indexOf(".xls") != -1) {
        console.log("Lendo um arquivo Excel...");
        let dadosExcel = await lerArquivoExcel(arquivo)

        janela.webContents.send("dados-excel", dadosExcel)
        evento.returnValue = { status: 0 }
    } else if (arquivo.name.toLowerCase().indexOf(".dbf") != -1) {
        console.log("Lendo um arquivo DBF...");

        console.log("--------------------------------------");
        console.log("Leitura do outro DBF Parser");
        arquivoDBF = arquivo
        let dados = await DBFFile.open(arquivo.path)

        console.log("DBF contem " + dados.recordCount + " recordes");
        let recordes = await dados.readRecords(dados.recordCount)
        janela.webContents.send("dados-dbf", recordes)
        evento.returnValue = { status: 0 }
    } else {
        console.log("Arquivo recebido não é um Excel nem DBF");
        evento.returnValue = { status: 1 }
    }
})

ipcMain.on("criar-dbf", async (evento, dados) => {
    console.log("Iniciando a criação do arquivo DBF com os dados abaixo: ");
    console.log(dados);
    await criarDBF(dados)

    console.log("Criação terminou");
    evento.returnValue = { status: 0 }
})

async function criarDBF(dados) {
    let dirSalvar = `${getDiretorio(arquivoDBF.path)}${getNomeSemExt(arquivoDBF.name)} ATUALIZADO.dbf`

    console.log("Onde será salvo: " + dirSalvar);

    console.log("Records que serão gravados:");
    console.log(dados);

    let dbfOriginal = await DBFFile.open(arquivoDBF.path)
    let camposDBF = dbfOriginal.fields
    console.log("Campos que serao criados:");
    console.log(camposDBF);

    // Excluir arquivo original se existir
    

    let dbfNovo = await DBFFile.create(dirSalvar, camposDBF)
    console.log("Criando records....");
    await dbfNovo.appendRecords(dados)
    console.log("Records gravados!");

    console.log("Novo DBF criado!");
}

async function lerArquivoExcel(arquivo) {
    let dadosLeitura = []
    await lerExcel(arquivo.path).then((rows) => {
        dadosLeitura = rows
    })
    return dadosLeitura
}

function getDiretorio(path) {
    let pathCaminhos = path.split("\\")

    let diretorio = ""
    for (let index = 0; index < pathCaminhos.length; index++) {
        if ((pathCaminhos.length - 1) == index) break;
        const parte = pathCaminhos[index];
        diretorio += parte + "\\"
    }
    return diretorio
}

function getNomeSemExt(nome) {
    let nomeCorreto = nome.substr(0, nome.indexOf(".dbf"))

    return nomeCorreto;
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
    // Create the browser window.
    janela = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await janela.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) janela.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        janela.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}