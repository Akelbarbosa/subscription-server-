// jwtUtils.js
const jwt = require('jsonwebtoken');
const config = require('../config/config')

const generateJWT = () => {
    const date_iat = new Date();
    const date_exp = new Date();
    date_exp.setMinutes(date_exp.getMinutes() + 60);

    const iat = Math.trunc(date_iat.getTime() / 1000);
    const exp = Math.trunc(date_exp.getTime() / 1000);
    
    const payload = {
        "iss": config.iss,
        "iat": iat,
        "exp": exp,
        "aud": "appstoreconnect-v1",
        "bid": config.bid
    }

    const privateKey = config.privateKey

    const accessToken = jwt.sign(payload, privateKey, {
        algorithm: "ES256",
        header: {
            "alg": "ES256",
            "kid": config.kid,
            "typ": "JWT"
        }
    });


    // ...
    return accessToken;
};

const verifyJWT = (token, publicKey) => {
    return decodedToken;
};

module.exports = {
    generateJWT,
    verifyJWT,
};