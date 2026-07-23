const URL_BASE = "http://localhost:3000";

async function fazerRequisicao(caminho, opcoes = {}) {
    let resposta;

    try {
        resposta = await fetch(`${URL_BASE}${caminho}`, {
            ...opcoes,
            headers: {
                "Content-Type": "application/json",
                ...opcoes.headers
            }
        });
    } catch {
        throw new Error(
            "Não foi possível conectar à API. Verifique se o servidor está iniciado."
        );
    }

    if (resposta.status === 204){
        return null;
    }

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok){
        throw new Error(
            dados.mensagem || "Não foi possível concluir a operação."
        );
    }

    return dados;
}

export const api = {
    listarMaquinas(){
        return fazerRequisicao("/maquinas");
    },

    buscarMaquina(id){
        return fazerRequisicao(`/maquinas/${id}`);
    },

    cadastrarMaquina(maquina) {
        return fazerRequisicao("/maquinas", {
            method: "POST",
            body: JSON.stringify(maquina)
        });
    },

    atualizarMaquina(id, maquina){
        return fazerRequisicao(`/maquinas/${id}`, {
            method: "PUT",
            body: JSON.stringify(maquina)
        });
    },

    excluirMaquina(id){
        return fazerRequisicao(`/maquinas/${id}`, {
            method: "DELETE"
        });
    }
};
