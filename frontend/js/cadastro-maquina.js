import { api } from "./api.js";

const formulario = document.querySelector("#formulario-maquina");
const mensagem = document.querySelector("#mensagem-formulario");
const titulo = document.querySelector(".titulo-pagina h2");
const descricao = document.querySelector(
    ".titulo-pagina > div > p:not(.caminho)"
);
const botaoSalvar = formulario.querySelector("button[type='submit']");
const parametros = new URLSearchParams(window.location.search);
const maquinaId = parametros.get("id");
const estaEditando = Boolean(maquinaId);

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = `mensagem-formulario ${tipo}`.trim();
}

function obterDadosDoFormulario() {
    const dados = new FormData(formulario);

    return {
        nome: dados.get("nome").trim(),
        setor: dados.get("setor").trim(),
        tipo: dados.get("tipo").trim(),
        status: dados.get("status"),
        consumo_energia: Number(dados.get("consumo")),
        temperatura: Number(dados.get("temperatura"))
    };
}

function preencherFormulario(maquina) {
    formulario.elements.nome.value = maquina.nome;
    formulario.elements.setor.value = maquina.setor;
    formulario.elements.tipo.value = maquina.tipo;
    formulario.elements.status.value = maquina.status;
    formulario.elements.consumo.value = maquina.consumo_energia;
    formulario.elements.temperatura.value = maquina.temperatura;
}

async function carregarMaquinaParaEdicao() {
    if (!estaEditando) return;

    titulo.textContent = "Editar máquina";
    descricao.textContent = "Altere os dados do equipamento selecionado.";
    botaoSalvar.textContent = "Atualizar máquina";
    botaoSalvar.disabled = true;
    mostrarMensagem("Carregando dados da máquina...", "carregando");

    try {
        const maquina = await api.buscarMaquina(maquinaId);
        preencherFormulario(maquina);
        mostrarMensagem();
    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
    } finally {
        botaoSalvar.disabled = false;
    }
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const maquina = obterDadosDoFormulario();
    const textoOriginal = botaoSalvar.textContent;

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = estaEditando ? "Atualizando..." : "Salvando...";
    mostrarMensagem(
        estaEditando ? "Atualizando máquina..." : "Cadastrando máquina...",
        "carregando"
    );

    try {
        if (estaEditando) {
            await api.atualizarMaquina(maquinaId, maquina);
            mostrarMensagem("Máquina atualizada com sucesso!", "sucesso");
        } else {
            await api.cadastrarMaquina(maquina);
            mostrarMensagem("Máquina cadastrada com sucesso!", "sucesso");
        }

        window.setTimeout(() => {
            window.location.href = "./maquinas.html";
        }, 900);
    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = textoOriginal;
    }
});

carregarMaquinaParaEdicao();
