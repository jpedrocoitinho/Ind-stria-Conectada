import { Router } from "express";

import{
    atualizarMaquina,
    buscarMaquina,
    cadastrarMaquina,
    excluirMaquina,
    listarMaquinas
} from "../controllers/maquinaController.js"

const router = Router();

router.get("/", listarMaquinas);
router.get("/:id", buscarMaquina);
router.post("/", cadastrarMaquina);
router.put("/:id", atualizarMaquina);
router.delete("/:id", excluirMaquina);

export default router;