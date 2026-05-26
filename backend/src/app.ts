import express from 'express';
import cors from 'cors';

import authRoutes from "./routes/auth.routes"
import alunoRoutes from "./routes/aluno.routes";

const app = express();

app.use(cors ());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API AppScholar funcionando")
});

app.use("/api", authRoutes)
app.use("/api", alunoRoutes)

export default app; 