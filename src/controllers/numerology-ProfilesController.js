import NumerologyProfile from '..models/Numerology-profiles.js';
import {
    calcularNumeroVida,
    calcularNumeroExprecion,
    calcularNUmeroAlma
} from '..services/numerology.service.js'

export const calcularPerfil = async (req, res) =>{
    try{
        const numeroVida = calcularNumeroVida(req.usuario.fechaNacimiento);
        const numeroExpresion = calcularNumeroExpresion(req.usuario.nombreCompleto);
        const numeroAlma = calcularNUmeroAlma(req.usuario.nombreCompleto);

        const perfil = await NumerologyProfile.findOneAndUpdate(
            { usuario: req.usuario._id },
            { numeroVida, numeroExpresion, numeroAlma, usuario: req.usuario._id },
            { returnDocument: 'after', upsert: true }
        );

        res.status(201).json({perfil});

    } catch (error){
        res.status(500).json({
            msg: 'mani hable con el admin'
        });
    }
};

export const obtenerPerfil = async (req, res) =>{
    try{
        const perfil = await NumerologiProfile.findOne({usuario: req.usuario._id});

        if(!perfil){
            return res.status(404).json({
                msg: 'aun no has calculado tu perfil'
            });
        }
    
    res.json({perfil});
    } catch (error){
        res.status(500).json({
            msg: ' Hable con el admin'
        });
    }
}