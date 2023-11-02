const { generateJWT } = require('../../utils/jwtUtils')
const { userWithSuscription, upgradeOrganizationInUser, getUpgradeOrganizationFromOrganization }  = require('../../utils/firebaseUtils')

const sanboxResponseHello = async (req, res) => {

    res.status(200).send("Ok")
}

const generateSandBox = (req, res) => {
    console.log("Body para : --> ", req.body)
    const token = generateJWT()

    res.status(200).send(token)
}


const testDb = async ( req, res ) => {

    try {
        const results = await userWithSuscription();
        console.log("Users with subscription:", results);
        res.status(200).send("OK");

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send("Error");
    }
}


module.exports = {
    sanboxResponseHello,
    generateSandBox,
    testDb
}