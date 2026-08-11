import { Schema, model} from 'mongoose';

const AuditLogSchema = new Schema({
    endpoint: {
        type: String,
        required: true,
    },
    metodo: {
        type: String,
        required: true,
    },
    statusCode:{
        type: Number,
        required:true,
    },
    timestamp: {
        type: Date,
        default:Date.now,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    }
})

export default model('Audit-logs', AuditLogSchema);