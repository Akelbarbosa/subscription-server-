require('dotenv').config()


module.exports = {
    privateKey: process.env.PRIVATE_KEY,
    iss: process.env.ISS,
    bid: process.env.BID,
    kid: process.env.KID
};
