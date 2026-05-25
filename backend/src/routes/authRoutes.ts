import { Router } from "express";

import { AuthController } from "../controllers/Authcontroller";

const router = Router();

router.post("/login", AuthController.login);

export default router;