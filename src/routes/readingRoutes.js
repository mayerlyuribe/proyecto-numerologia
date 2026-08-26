import { Router } from 'express';
import { check } from 'express-validator';
import { generarLectura, obtenerHistorial } from '../controllers/readingController.js';
import { validarJWT } from '../middleware/validar-jwt.js';
import { validarCampos } from '../middleware/validar-campos.js';

const router = Router();

router.post('/generate', [
    validarJWT,
    check('tipoLectura', 'El tipo de lectura no es valido').isIn(['diaria', 'general', 'anual']),
    validarCampos
], generarLectura);

router.get('/history', [
    validarJWT
], obtenerHistorial);

export default router;
