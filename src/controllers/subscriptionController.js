const axios = require('axios');
const { generateJWT } = require('../../utils/jwtUtils') 
const fs = require('fs')

const newSubscription = async (req, res) => {
    const transactionID = req.params.transaction
    console.log("transactionID: --> ", transactionID)

    try {
        const token = generateJWT()
        const requestOptions = {
            method: 'GET',
            url: `https://api.storekit-sandbox.itunes.apple.com/inApps/v1/transactions/${transactionID}`,// https://api.storekit-sandbox.itunes.apple.com/inApps/v1/transactions/{transactionId}
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };


        const response = await axios(requestOptions);
        const [header, payload, signature] = response.data.signedTransactionInfo.split('.');
        
        const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
        const payloadData = JSON.parse(decodedPayload);

       
        // Guardar la respuesta en un archivo de texto
        fs.writeFile('respuesta.txt', JSON.stringify(response.data, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar la respuesta en el archivo:', err);
            } else {
                console.log('Respuesta guardada en respuesta.txt');
            }
        });
                
        
        res.status(200).send(payloadData);
    

    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      res.status(500).json({ error: 'Error al realizar la solicitud' });
    }


};


module.exports = {
    newSubscription
};
