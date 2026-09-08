import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/audit-logsRoutes.js";
import numerologyRoutes from "./src/routes/numerology-profilesRoutes.js";
import readingRoutes from "./src/routes/readingRoutes.js";
import compatibilityRoutes from "./src/routes/compatibility-matchesRoutes.js";
import { rutaNoEncontrada, manejarErrores } from "./src/middleware/errorHandler.js";
import { registrarAuditoria } from "./src/middleware/audit.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(registrarAuditoria)

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/numerology", numerologyRoutes);
app.use("/api/v1/readings", readingRoutes);
app.use("/api/v1/compatibility", compatibilityRoutes);

app.use(express.static("public"));
app.use(rutaNoEncontrada);
app.use(manejarErrores);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});