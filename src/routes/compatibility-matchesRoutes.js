import { Router } from 'express';
import { check } from 'express-validator';
import { verificarCompatibilidad } from '../controllers/compatibility-matchesController.js';
import { validarJWT } from '../middleware/validar-jwt.js';
import { validarCampos } from '../middleware/validar-campos.js';

const router = Router();

router.post('/check', [
    validarJWT,
    check('otroUsuarioId', 'No es un ID valido').isMongoId(),
    validarCampos
], verificarCompatibilidad);

export default router;