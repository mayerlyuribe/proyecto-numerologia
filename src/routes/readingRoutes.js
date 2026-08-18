import { Router } from 'express';
import { check } from 'express-validator';
import { generarLectura, obtenerHistorial } from '../controllers/readingController.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';

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
