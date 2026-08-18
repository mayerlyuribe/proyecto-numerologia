import { Router } from 'express';
import { calcularPerfil, obtenerPerfil } from '../controllers/numerology-profilesController.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post('/calculate', [
    validarJWT
], calcularPerfil);

router.get('/profile', [
    validarJWT
], obtenerPerfil);

export default router;
