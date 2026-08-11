import Reading from "../models/Reading.js";
import NumerologyProfile from "../models/Numerology-profiles.js";
import { generarInterpretacion } from "../services/gemini.service.js";

export const generarLectura =async (req, res) => {
    try{
        const perfil = await NumerologyProfile.findOne({ usuario: req.usuario._id });

        if(!perfil){
            return res.satatus(404).json({
                msg:'primero debes cacular tu perfil numerologico'
            });
        }

        const prompt = `
Eres un numerologo experto. Genera una lectura de tipo "${tipoLectura}" para una
persona con los siguientes numeros centrales:
- Numero de Camino de Vida: ${perfil.numeroVida}
- Numero de Expresion: ${perfil.numeroExpresion}
- Numero del Alma: ${perfil.numeroAlma}

Ofrece una interpretacion natural, clara y personalizada.
`;
        const respuesta = await generarInterpretacion(prompt);

        const reading = new Reading({
            prompt,
            respuesta,
            tipoLectura,
            usuario: req.usuario._id
        });

        await reading.save();

        res.status(201).json({ reading });

    } catch (error){
        console.log(error);
        res.status(500).json({
            msg: 'no se pudo generar la lectura'
        });
    }
};

export const obtenerHistorial = async (req, res) => {
    try{
        const historial = await Reading.find({ usuario: req.usuario._id }).sort({ fecha: -1 });
        res.json({ historial });

    } catch (error){
        res.status(500).json({
            msg: 'hable con el admin'
        });
    }
}