import { Router } from "express";

import { NotaController }
  from "../controllers/NotaController";

import { authMiddleware }
  from "../middleware/authMiddleware";

import { verifyRole }
  from "../middleware/verifyRole";

const router = Router();

router.post(

  "/notas",

  authMiddleware,

  verifyRole([
    "admin",
    "teacher"
  ]),

  NotaController.create
);

router.get(

  "/notas",

  authMiddleware,

  verifyRole([
    "admin",
    "teacher",
    "student"
  ]),

  NotaController.findAll
);

router.delete(

  "/notas/:id",

  authMiddleware,

  verifyRole([
    "admin",
    "teacher"
  ]),

  NotaController.delete
)

router.put(

  "/notas/:id",

  authMiddleware,

  verifyRole([
    "admin",
    "teacher"
  ]),

  NotaController.update
);

export default router;