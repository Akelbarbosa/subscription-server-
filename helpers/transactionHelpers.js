const firebase = require('../utils/firebaseUtils');


const getUserFromOriginalTransactionID = async (originalTransactionId) => {
    try {
        const user = await firebase.getUserFromTransactionID(originalTransactionId);
        return user;
    } catch (error) {
        throw error;
    }
};

const searchUserFromTranstionID = async (originalTransactionId) => {
    try {
        let user = await firebase.getUserFromTransactionID(originalTransactionId)
        return user
    } catch (error) {
        throw error
    }
}

/**
 * Metodo para cambiar un usuario a su suscripcion inicial
 *
 * @param {string} originalTransactionId - El ID de transacción original.
 * @throws {Error} Si no puede hacer el cambio de organizacion en el usuario
 */
 const downgradeToInitialOrganization = async (originalTransactionId) => {
    try {
        let user = await getUserFromOriginalTransactionID(originalTransactionId)
        let downgradeToOrganization = user.subscription.initialOrganization
        
        await firebase.upgradeOrganizationInUser(user.uid, downgradeToOrganization)
        console.log("Se actualizo la organizacion en el user.") 

    } catch (error) {
        console.log("Error al tratar de cambiar la organization en el user", error)
    }
}

const createTransactionObject = (payloadData, userID, paidOrganization, initialOrganization, typeOfTransaction) => {
    try {
        const originalTransactionId = payloadData.originalTransactionId;
        const purchaseDate = dateInStringFromDateInUnix(payloadData.purchaseDate);
        const expirationDate = dateInStringFromDateInUnix(payloadData.expiresDate);
        const subscription = payloadData.productId; 

        const transactionData = {
        originalTransactionId,
        typeOfTransaction,
        userID,
        purchaseDate,
        expirationDate,
        subscription,
        paidOrganization,
        initialOrganization,
        };
    
        return transactionData;
    } catch (error) {
        throw error;
    }
}

const typeOfTransaction = (notificationType) => {

}

const dateInStringFromDateInUnix = (dateInUnix) => {
    try {
        const date = new Date(dateInUnix * 1000);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
        const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);
        return formattedDate;
    } catch (error) {
        throw new Error("Error al tratar de convertir la fecha de Unix a string: " + error.message);
    }
}


/// Este metodo se ejecutara luego que se reciba una notificacion, en este caso vamos a crear el metodo que se encargar de guardar 
/// en la db el transaction object
const saveObjectTransaction = async (transactionObject) => {
    try {
        await firebase.saveTransaction(transactionObject)
    } catch (error) {
        console.error("Error al guardar objecto en la db: ", error);
    }
}

module.exports = {
    getUserFromOriginalTransactionID,
    searchUserFromTranstionID,
    downgradeToInitialOrganization,
    createTransactionObject,
    saveObjectTransaction,
    dateInStringFromDateInUnix,
}