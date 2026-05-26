import { Router } from 'express';
import { ProfessorController } from '../controllers/ProfessorController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post(
    "/professores",
    authMiddleware,
    ProfessorController.create
);

router.get(
    "/professores",
    authMiddleware,
    ProfessorController.findAll
);

router.delete(
    "/professores/:id",
    authMiddleware,
    ProfessorController.delete
);

export default router;


