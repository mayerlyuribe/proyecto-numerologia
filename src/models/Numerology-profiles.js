import {Schema, model} from 'mongoose';

const NumerologyProfileSchema = new Schema({
    numeroVida: {
        type: Number,
        required: true,
    },
    numeroExpresion: {
        type: Number,
        required: true,
    },
    numeroAlma: {
        type: Number,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true,
        unique:true,
    }
});

export default model('Numerology-profile', NumerologyProfileSchema);
