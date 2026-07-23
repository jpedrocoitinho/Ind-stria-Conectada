import { api } from "./api.js";

const tabela = document.querySelector("#lista-maquinas");
const contador = document.querySelector("#quantidade-maquinas");
const formularioFiltros = document.querySelector("#formulario-filtros");
const campoPesquisa = document.querySelector("#pesquisa");
const campoStatus = document.querySelector("#status");

let todasAsMaquinas = [];

function classeDoStatus(status) {
    if (status === "Em operação") return "status-operacao";
    if (status === "Em manutenção") return "status-manutencao";
    return "status-parada";
}

function exibirEstado(mensagem, classe = "") {
    tabela.innerHTML = "";

    const linha = document.createElement("tr");
    const celula = document.createElement("td");

    celula.colSpan = 7;
    celula.className = `estado-tabela ${classe}`.trim();
    celula.textContent = mensagem;

    linha.appendChild(celula);
    tabela.appendChild(linha);
}

function atualizarContador(quantidade) {
    contador.textContent = quantidade === 1
        ? "1 máquina encontrada"
        : `${quantidade} máquinas encontradas`;
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto;
    return celula;
}

function criarLinhaDaMaquina(maquina) {
    const linha = document.createElement("tr");

    linha.appendChild(criarCelula(maquina.nome));
    linha.appendChild(criarCelula(maquina.setor));
    linha.appendChild(criarCelula(maquina.tipo));

    const celulaStatus = document.createElement("td");
    const status = document.createElement("span");

    status.className = `status ${classeDoStatus(maquina.status)}`;
    status.textContent = maquina.status;
    celulaStatus.appendChild(status);
    linha.appendChild(celulaStatus);

    linha.appendChild(criarCelula(
        `${Number(maquina.consumo_energia).toLocaleString("pt-BR")} kWh`
    ));

    linha.appendChild(criarCelula(
        `${Number(maquina.temperatura).toLocaleString("pt-BR")} °C`
    ));

    const celulaAcoes = document.createElement("td");
    celulaAcoes.className = "acoes";

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.className = "botao-acao editar";
    botaoEditar.textContent = "Editar";
    botaoEditar.addEventListener("click", () => {
        window.location.href = `./cadastro-maquina.html?id=${maquina.id}`;
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "botao-acao excluir";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.addEventListener("click", async () => {
        const confirmou = window.confirm(
            `Deseja excluir a máquina "${maquina.nome}"?`
        );

        if (!confirmou) return;

        botaoExcluir.disabled = true;
        botaoExcluir.textContent = "Excluindo...";

        try {
            await api.excluirMaquina(maquina.id);
            await carregarMaquinas();
        } catch (erro) {
            window.alert(erro.message);
            botaoExcluir.disabled = false;
            botaoExcluir.textContent = "Excluir";
        }
    });

    celulaAcoes.appendChild(botaoEditar);
    celulaAcoes.appendChild(botaoExcluir);
    linha.appendChild(celulaAcoes);

    return linha;
}

function renderizarMaquinas(maquinas) {
    tabela.innerHTML = "";
    atualizarContador(maquinas.length);

    if (maquinas.length === 0) {
        exibirEstado("Nenhuma máquina encontrada.");
        return;
    }

    maquinas.forEach((maquina) => {
        tabela.appendChild(criarLinhaDaMaquina(maquina));
    });
}

function aplicarFiltros() {
    const nomePesquisado = campoPesquisa.value
        .trim()
        .toLocaleLowerCase("pt-BR");
    const statusSelecionado = campoStatus.value;

    const maquinasFiltradas = todasAsMaquinas.filter((maquina) => {
        const correspondeAoNome = maquina.nome
            .toLocaleLowerCase("pt-BR")
            .includes(nomePesquisado);
        const correspondeAoStatus =
            statusSelecionado === "" || maquina.status === statusSelecionado;

        return correspondeAoNome && correspondeAoStatus;
    });

    renderizarMaquinas(maquinasFiltradas);
}

async function carregarMaquinas() {
    exibirEstado("Carregando máquinas...");
    atualizarContador(0);

    try {
        todasAsMaquinas = await api.listarMaquinas();
        renderizarMaquinas(todasAsMaquinas);
    } catch (erro) {
        exibirEstado(
            `Erro ao carregar as máquinas: ${erro.message}`,
            "estado-erro"
        );
        console.error(erro);
    }
}

formularioFiltros.addEventListener("submit", (evento) => {
    evento.preventDefault();
    aplicarFiltros();
});

campoPesquisa.addEventListener("input", aplicarFiltros);
campoStatus.addEventListener("change", aplicarFiltros);

carregarMaquinas();
