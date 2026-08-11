import Compatibility_matches from '../models/Compatibility-matches.js';
import Numerology_profile from '../models/Numerology-profiles.js';
import { CalcularPuntajeCompatibilidad } from '../services/numerology.service.js';
import { generarInterpretacion } from '../services/gemini.service.js';

export const verificarCompatibilidad = async (req, res) => {
    const { otroUsuarioId } = req.body;

    try {
        const perfilPropio = await Numerology_profile.findOne({ usuario:req.usuario._id});
        const perfilOtro = await numerology_profile.findOne({ usuario: otroUsuarioId });

        if (!perfilPropio || !perfilOtro) {
            return res.status(404).json({ msg: 'Ambos usuarios deben tener su perfil numerologico calculado' });
        }
        
        const puntaje = calcularPuntajeCompatibilidad(perfilPropio, perfilOtro);

        const prompt = `Eres un numerólogo experto. Analiza la compatibilidad de una relacion entre dos personas con los siguientes numeros centrales:
        
        persona 1: camino de vida ${perfilPropio.numeroVida}, expresion ${perfilPropio.numeroExpresion}, alma ${perfilPropio.numeroAlma}
        persona 2: camino de vida ${perfilOtro.numeroVida}, expresion ${perfilOtro.numeroExpresion}, alma ${perfilOtro.numeroAlma}
        
        el puntaje de compatibilidad calculado es ${puntaje}/100. Ofrece una interpretacion natural sobre esta relación.`;

        const interpretacion = await generarInterpretacion(prompt);

        const match = new Compatibility_matches({
            usuario1: req.usuario._id,
            usuario2: otroUsuarioId,
            puntaje,
            interpretacion
        });

        await match.save();

        res.status(201).json({ match });

    } catch (error){
        console.log(error);
        res.status(500).json({
            msg: 'no se pudo calcular la compatibilidad :c'
        })

    }
}