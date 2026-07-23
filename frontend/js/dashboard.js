import { api } from "./api.js";

const indicadores = {
    total: document.querySelector("#total-maquinas"),
    operacao: document.querySelector("#maquinas-operacao"),
    manutencao: document.querySelector("#maquinas-manutencao"),
    paradas: document.querySelector("#maquinas-paradas")
};

const corpoTabela = document.querySelector("#resumo-maquinas");

function definirTexto(elemento, valor) {
    if (elemento) elemento.textContent = valor;
}

function classeDoStatus(status) {
    const classes = {
        "Em operação": "status-operacao",
        "Em manutenção": "status-manutencao",
        "Parada": "status-parada",
        "Desativada": "status-parada"
    };

    return classes[status] || "";
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto ?? "-";
    return celula;
}

function atualizarIndicadores(maquinas) {
    definirTexto(indicadores.total, maquinas.length);
    definirTexto(indicadores.operacao, maquinas.filter(
        (maquina) => maquina.status === "Em operação"
    ).length);
    definirTexto(indicadores.manutencao, maquinas.filter(
        (maquina) => maquina.status === "Em manutenção"
    ).length);
    definirTexto(indicadores.paradas, maquinas.filter(
        (maquina) => ["Parada", "Desativada"].includes(maquina.status)
    ).length);
}

function mostrarEstadoTabela(mensagem, erro = false) {
    if (!corpoTabela) return;

    corpoTabela.replaceChildren();
    const linha = document.createElement("tr");
    const celula = criarCelula(mensagem);
    celula.colSpan = 4;
    celula.className = `estado-tabela${erro ? " estado-erro" : ""}`;
    linha.appendChild(celula);
    corpoTabela.appendChild(linha);
}

function renderizarResumo(maquinas) {
    if (!corpoTabela) return;

    corpoTabela.replaceChildren();
    if (maquinas.length === 0) {
        mostrarEstadoTabela("Nenhuma máquina cadastrada.");
        return;
    }

    maquinas.slice(0, 3).forEach((maquina) => {
        const linha = document.createElement("tr");
        const celulaStatus = document.createElement("td");
        const status = document.createElement("span");

        status.className = `status ${classeDoStatus(maquina.status)}`.trim();
        status.textContent = maquina.status;
        celulaStatus.appendChild(status);

        linha.append(
            criarCelula(maquina.nome),
            criarCelula(maquina.setor),
            celulaStatus,
            criarCelula(
                maquina.temperatura === null || maquina.temperatura === undefined
                    ? "-"
                    : `${Number(maquina.temperatura).toLocaleString("pt-BR")} °C`
            )
        );
        corpoTabela.appendChild(linha);
    });
}

async function carregarDashboard() {
    try {
        const maquinas = await api.listarMaquinas();
        atualizarIndicadores(maquinas);
        renderizarResumo(maquinas);
    } catch (erro) {
        Object.values(indicadores).forEach(
            (indicador) => definirTexto(indicador, "--")
        );
        mostrarEstadoTabela(erro.message, true);
    }
}

carregarDashboard();
