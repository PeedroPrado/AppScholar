import express from 'express';
import cors from 'cors';

import authRoutes from "./routes/auth.routes"

const app = express();

app.use(cors ());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API AppScholar funcionando")
});

app.use("/api", authRoutes)

export default app; 