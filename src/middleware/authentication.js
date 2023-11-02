const jwt = require('jsonwebtoken');
const { privateKey } = require('../../config/config')

const authenticateToken = (req, res, next) => {
    const appleReceipt = req.body.token;

    if (!appleReceipt) {
        return res.status(400).send("Token JWT no proporcionado en la solicitud.");
    }

    const appleSharedSecret = privateKey;

    jwt.verify(appleReceipt, appleSharedSecret, (err, decoded) => {
        if (err) {
            console.error("Error al verificar el token JWT:", err);
            return res.status(401).send("Token JWT no válido.");
        }

        // El token JWT se ha verificado con éxito, y 'decoded' contiene la información de la transacción
        console.log("Token JWT decodificado:", decoded);
        next()
    });


};

module.exports = authenticateToken;
