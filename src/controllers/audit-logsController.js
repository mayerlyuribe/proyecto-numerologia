import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generarJWT } from '../middleware/validar-jwt.js';

export const register = async (req, res) => {
    const {nombreCompleto, email, password, fechaNacimiento} = req.body;

    try {
        const user = new User ({nombreCompleto, email, fechaNacimiento });

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        res.status(201).json({
            usuario: {
                id: user._id,
                nombreCompleto: user.nombreCompleto,
                email: user.email,
                fechaNacimiento:user.fechaNacimiento
            }
        });

    }catch (error){
        res.status(500).json({
            msg: 'hable con el WebMaster bro'
        });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user){
            return res.status(401).json({
                msg:'Email / password no son correctos'
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json ({
                msg:'Email / password no son correctos'
            });
        }

        const token = await generarJWT(user.id);

        res.json({
            usuario: {
                id: user._id,
                nombreCompleto: user.nombreCompleto,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            msg: 'hable con el WebMaster bro'
        });
    }
    
}