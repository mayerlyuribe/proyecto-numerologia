import {Schema, SchemaType, model} from 'mongoose'

const CompatibilityMatchSchema = new Schema({
    usuario1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    usuario2: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    puntaje: {
        type: Number,
        required:true,
    },
    interpretacion: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    }
});

export default model ('Compatibility-matches', CompatibilityMatchSchema);