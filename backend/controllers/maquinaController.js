import pool from "../config/database.js";

const STATUS_VALIDOS =[
    "Em operação",
    "Em manutenção",
    "Parada",
    "Desativada"
];

function validarMaquina(dados) {
    const {
        nome,
        setor,
        tipo,
        status,
        consumo_energia,
        temperatura
    } = dados;

    if (
        !nome ||
        !setor ||
        !tipo ||
        !status ||
        consumo_energia === undefined ||
        temperatura === undefined
    ) {
        return "Todos os campos são obrigatórios.";
    }

    if (!STATUS_VALIDOS.includes(status)) {
        return "O status informado é inválido.";
    }

    if (Number(consumo_energia) < 0) {
        return "O consumo de energia não pode ser negativo.";
    }

    if (Number.isNaN(Number(temperatura))) {
        return "A temperatura deve ser numérica.";
    }

    return null;
}


export async function listarMaquinas(request, response, next) {
    try {
        const [maquinas] = await pool.query(
            `SELECT
                id,
                nome,
                setor,
                tipo,
                status,
                consumo_energia,
                temperatura,
                criado_em,
                atualizado_em
             FROM maquinas
             ORDER BY id DESC`
        );

        return response.status(200).json(maquinas);
    } catch (erro) {
        next(erro);
    }
}


export async function buscarMaquina(request, response, next) {
    try {
        const { id } = request.params;

        const [maquinas] = await pool.execute(
            "SELECT * FROM maquinas WHERE id = ?",
            [id]
        );

        if (maquinas.length === 0) {
            return response.status(404).json({
                mensagem: "Máquina não encontrada."
            });
        }

        return response.status(200).json(maquinas[0]);
    } catch (erro) {
        next(erro);
    }
}

export async function cadastrarMaquina(request, response, next) {
    try {
        const erroValidacao = validarMaquina(request.body);

        if (erroValidacao) {
            return response.status(400).json({
                mensagem: erroValidacao
            });
        }

        const {
            nome,
            setor,
            tipo,
            status,
            consumo_energia,
            temperatura
        } = request.body;

        const [resultado] = await pool.execute(
            `INSERT INTO maquinas (
                nome,
                setor,
                tipo,
                status,
                consumo_energia,
                temperatura
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nome.trim(),
                setor.trim(),
                tipo.trim(),
                status,
                Number(consumo_energia),
                Number(temperatura)
            ]
        );

        return response.status(201).json({
            mensagem: "Máquina cadastrada com sucesso.",
            id: resultado.insertId
        });
    } catch (erro) {
        next(erro);
    }
}


export async function atualizarMaquina(request, response, next) {
    try {
        const { id } = request.params;
        const erroValidacao = validarMaquina(request.body);

        if (erroValidacao) {
            return response.status(400).json({
                mensagem: erroValidacao
            });
        }

        const {
            nome,
            setor,
            tipo,
            status,
            consumo_energia,
            temperatura
        } = request.body;

        const [resultado] = await pool.execute(
            `UPDATE maquinas
             SET nome = ?,
                 setor = ?,
                 tipo = ?,
                 status = ?,
                 consumo_energia = ?,
                 temperatura = ?
             WHERE id = ?`,
            [
                nome.trim(),
                setor.trim(),
                tipo.trim(),
                status,
                Number(consumo_energia),
                Number(temperatura),
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return response.status(404).json({
                mensagem: "Máquina não encontrada."
            });
        }

        return response.status(200).json({
            mensagem: "Máquina atualizada com sucesso."
        });
    } catch (erro) {
        next(erro);
    }
}

export async function excluirMaquina(request, response, next) {
    try {
        const { id } = request.params;

        const [resultado] = await pool.execute(
            "DELETE FROM maquinas WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return response.status(404).json({
                mensagem: "Máquina não encontrada."
            });
        }

        return response.status(204).send();
    } catch (erro) {
        next(erro);
    }
}
