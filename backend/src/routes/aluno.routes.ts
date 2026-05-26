import { Router } from "express";

import { AlunoController } from "../controllers/AlunoController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/alunos",
  authMiddleware,
  AlunoController.create
);

router.get(
  "/alunos",
  authMiddleware,
  AlunoController.findAll
);

router.delete(
  "/alunos/:id",
  authMiddleware,
  AlunoController.delete
)
export default router;