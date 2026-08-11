import { Schema, model} from 'mongoose';

const UserSchema = new Schema({
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'el password es obligatorio'],
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

export default model('User', UserSchema);