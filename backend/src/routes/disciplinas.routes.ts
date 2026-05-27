import { Router } from 'express';
import { DisciplinaController } from '../controllers/DisciplinaController';
import {authMiddleware} from '../middleware/authMiddleware'

const router = Router();

router.post('/disciplinas', authMiddleware, DisciplinaController.create);
router.get('/disciplinas', authMiddleware, DisciplinaController.findAll);
router.delete('/disciplinas/:id', authMiddleware, DisciplinaController.delete);

export default router;