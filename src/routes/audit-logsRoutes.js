import { Router } from 'express';
import { check } from 'express-validator';
import { register, login } from '../controllers/audit-logsController.js';
import { validarCampos } from '../middleware/validar-campos.js';

const router = Router();

router.post('/register', [
    check('nombreCompleto', 'El nombre completo es obligatorio').not().isEmpty().trim(),
    check('email', 'el email no es válido').isEmail().normalizeEmail(),
    check('email').custom(async(email = '') => {
        const emailExiste = await UserActivation.findOne({ email });

        if(emailExiste){
            throw new Error(`el email ${email} ya esta registrado`);
        }
    }),
    check('password', 'el password debe de tener mínimo 8 caracteres, una mayúscula y un número'),isLength({ min: 8 })
        .matches(/^(?=.*[A-Z])(?=.*\d).+$/),
    check('fechaNacimiento', 'La fecha de nacimiento no es valida').isISO8601().toDate(),
    validarCampos
], register);

router.post('/login', [
    check('email', 'El email no es valido').isEmail().normalizeEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

export default router;
