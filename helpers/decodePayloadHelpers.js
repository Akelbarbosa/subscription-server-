const splitAndDecodePayload = (signedPayload, payloadKey) => {
    const [_, payloadData, __] = signedPayload.split('.');
    const decodedPayloadData = decodeAndParse(payloadData);
    return decodedPayloadData;
};

const decodeAndParse = (base64EncodedData) => {
    const decodedData = Buffer.from(base64EncodedData, 'base64').toString('utf-8');
    return JSON.parse(decodedData);
};

module.exports = {
    splitAndDecodePayload,
    decodeAndParse,
}