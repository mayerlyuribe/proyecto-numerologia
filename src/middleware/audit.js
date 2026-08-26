import AuditLog from '../models/Audit-logs.js';

export const registrarAuditoria = (req, res, next) => {
    res.on('finish', async () => {
        try {
            await AuditLog.create({
                endpoint: req.originalUrl,
                metodo: req.method,
                statusCode: res.statusCode,
                usuario: req.usuario ? req.usuario._id : null
            });
        } catch (error) {
            console.log('No se pudo guardar el log de auditoria:', error.message);
        }
    });

    next();
};