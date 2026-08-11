import { Schema, model} from 'mongoose';

const ReadingSchema = new Schema({
    prompt: {
        type: String,
        required: true
    },
    respuesta: {
        type: String,
        required: true 
    },
    tipoLectura:{
        type: String,
        enum: ['diaria', 'general', 'anual'],
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    usuario:{
        type: Schema.Types.objectId,
        ref: 'User',
        required: true 
    }
})

export default model('Reading ', ReadingSchema);