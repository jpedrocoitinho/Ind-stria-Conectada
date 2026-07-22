import "dotenv/config";

import cors from "cors";
import express from "express";

import pool from "./config/database.js";
import maquinaRoutes from "./routes/maquinaRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
    response.status(200).json({
        nome: "API Indústria Conectada",
        status: "online"
    });
});

app.get("/saude", async (request, response) => {
    try {
        await pool.query("SELECT 1");

        response.status(200).json({
            api: "online",
            banco: "conectado"
        });
    } catch (erro) {
        response.status(500).json({
            api: "online",
            banco: "desconectado",
            erro: erro.message
        });
    }
});

app.use("/maquinas", maquinaRoutes);

app.use((request, response) => {
    response.status(404).json({
        mensagem: "Rota não encontrada."
    });
});

app.use((erro, request, response, next) => {
    console.error(erro);

    response.status(500).json({
        mensagem: "Erro interno do servidor."
    });
});

app.listen(PORT, () => {
    console.log(`API executando em http://localhost:${PORT}`);
});