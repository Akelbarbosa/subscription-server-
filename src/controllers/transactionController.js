//const { generateJWT } = require('../../utils/jwtUtils')
const notificationHandler = require("../../utils/notificationHandler")
const decodePayload = require('../../helpers/decodePayloadHelpers')

const receiveAppleTransaction = async (req, res) => {  
    try {
        const payload = decodePayload.splitAndDecodePayload(req.body.signedPayload, 'signedPayload')//req.body.signedPayload.split('.');

        res.status(200).send("OK");
        await appleHandler(payload)

    } catch (error) {
        console.log("Error al decodificar", error);
        res.status(500).send("Error");


    }
};

const appleHandler = async (decodedPayload) => {
    await notificationHandler.notificationAppleHandler(decodedPayload)
}


const receiveGoogleTransaction = (req, res) => {

}

module.exports = {
    receiveAppleTransaction,
    receiveGoogleTransaction,
}