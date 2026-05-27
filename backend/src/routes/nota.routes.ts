import { Router } from "express";

import { NotaController }
  from "../controllers/NotaController";

import { authMiddleware }
  from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/notas",
  authMiddleware,
  NotaController.create
);

router.get(
  "/notas",
  authMiddleware,
  NotaController.findAll
);

router.delete(
  "/notas/:id",
  authMiddleware,
  NotaController.delete
);

export default router;