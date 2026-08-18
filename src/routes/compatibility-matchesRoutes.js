import { Router } from 'express';
import { check } from 'express-validator';
import { verificarCompatibilidad } from '../controllers/compatibility-controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post('/check', [
    validarJWT,
    check('otroUsuarioId', 'No es un ID valido').isMongoId(),
    validarCampos
], verificarCompatibilidad);

export default router;
