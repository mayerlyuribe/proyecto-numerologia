import { Router } from 'express';
import { calcularPerfil, obtenerPerfil } from '../controllers/numerology-ProfilesController.js';
import { validarJWT } from '../middleware/validar-jwt.js';

const router = Router();

router.post('/calculate', [
    validarJWT
], calcularPerfil);

router.get('/profile', [
    validarJWT
], obtenerPerfil);

export default router;
