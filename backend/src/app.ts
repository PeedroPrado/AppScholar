import express from 'express';
import cors from 'cors';

import authRoutes from "./routes/auth.routes"
import alunoRoutes from "./routes/aluno.routes";
import professorRoutes from "./routes/professor.routes";

const app = express();

app.use(cors ());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API AppScholar funcionando")
});

app.use("/api", authRoutes)
app.use("/api", alunoRoutes)
app.use("/api", professorRoutes)

export default app; 