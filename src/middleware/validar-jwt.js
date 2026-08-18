import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: process.env.JWT_EXPIRES_IN || '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

export const validarJWT = async (req, res, next) =>{
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'no hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await User.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'este usuario no existe'
            })
        }
        req.usuario = usuario;
        next();
    } catch (error){
        return res.status(401).json({
            msg: 'token no válido'
        })
    }
}
