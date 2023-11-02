const firebase = require('../utils/firebaseUtils');
const transactionsHelpers = require('../helpers/transactionHelpers');
const decodePayload = require('../helpers/decodePayloadHelpers');


const notificationAppleHandler = async (payloadData) => {
    const notificationType = payloadData.notificationType;
    const subType = payloadData.subtype;

   console.log("Tipo", notificationType, "Con subtipo", subType)
    const decodedTransactionInfo = decodePayload.splitAndDecodePayload(payloadData.data.signedTransactionInfo, 'signedTransactionInfo');
    const originalTransactionId = decodedTransactionInfo.originalTransactionId


    switch (notificationType) {
        case 'DID_FAIL_TO_RENEW':
            try {
                await didFailToRenewHandler(subType, originalTransactionId)
            } catch (error) {
                console.log("Error en DID_FAIL_TO_RENEW: ", error)
            }

            break;

        case 'DID_CHANGE_RENEWAL_STATUS':
            try {
                await didChangeRenewalStatusHandler(subType, originalTransactionId)
            } catch {
                console.log("Error en DID_CHANGE_RENEWAL_STATUS: ", error)
            }
            break;

        case 'DID_RENEW':
            try {
                await didRenewHandler(subType, originalTransactionId, decodedTransactionInfo)
            } catch (error) {
                console.log("Error en DID_RENEW: ", error)
            }
            break;

        case 'SUBSCRIBED':
            try {
                await subscriptionHandler(subType, originalTransactionId, decodedTransactionInfo)
            } catch (error) {
                console.log("Error en RESUBSCRIBE: ", error)
            }
            break;

        case "EXPIRED":
            try {
                await experiedHadler(subType, originalTransactionId)
            } catch (error) {
                console.log("Error en EXPIRED: ", error)
            }
            break;

        case "REFUND":
            try {
                await refundHandler(originalTransactionId)
            } catch (error) {
                console.log("Error en REFUND: ", error)
            }
            break;

        case "REFUND_REVERSED":

            break;
        default:
            // Código por defecto si el tipo de notificación no coincide con ningún caso anterior
            break;
    }
};

const refundReversedHandler = async (originalTransactionId, decodedTransactionInfo) => {
    // En este caso de REFUND_REVERSED, al usuario se le realizo el cobro y se le debe cambiar al plan premium
    try {
        const actionToDo = "REFUND_REVERTED"
        await saveObjectTransactionHandler(actionToDo, originalTransactionId, decodedTransactionInfo)
    } catch (error) {
        throw error
    }
    
}


const refundHandler = async (originalTransactionId) => {
    /// Refund es cuando el usuario pide que se reembolse el dinero que pago por la transaccion.
    try {
        await transactionsHelpers.downgradeToInitialOrganization(originalTransactionId)
    } catch (error) {
        throw error
    }
}

const didFailToRenewHandler = async (subType, originalTransactionId) => {
    /// Cuando ocurre que es undefined el subtipo, hay que cambia quitar la suscripcion premium al usuario.
    try {
        if (subType === null) {
            await transactionsHelpers.downgradeToInitialOrganization(originalTransactionId)
        }

    } catch (error) {
        throw error
    }
};


const didChangeRenewalStatusHandler = async (subType, originalTransactionId) => {
    switch (subType) {
    case "AUTO_RENEW_DISABLED":
        await transactionsHelpers.downgradeToInitialOrganization(originalTransactionId)
        break;

    case "AUTO_RENEW_ENABLED":
        break;
    }
};


 
const experiedHadler = async (subType, originalTransactionId) => {
    switch (subType) {
    case "VOLUNTARY":
        try {
            await transactionsHelpers.downgradeToInitialOrganization(originalTransactionId)
        } catch (error) {
            throw error
        }
        break;
    default:
        console.log("Expired con subtipo", subType)
        break;
    }
}


const didRenewHandler = async (subType, originalTransactionId, decodedTransactionInfo) => {

    switch (subType) {
    case "BILLING_RECOVERY":
        try {
            const actionToDo = "RESUBSCRIBE"
            await subscriptionHandler(actionToDo, originalTransactionId)

        } catch (error) {
            throw Error("Errror al mostrar info en DID_RENEW")
        }

        break;
    
    default:
        try {
            await saveObjectTransactionHandler("DID_RENEW", originalTransactionId, decodedTransactionInfo)
        } catch (error) {
            throw error
        }
        break;
    }


}

const saveObjectTransactionHandler = async (subType, originalTransactionId, decodedTransactionInfo, secondAction = "") => {
    let user;
    let paidOrganization;
    let initialOrganization;

    try {
        user = await transactionsHelpers.getUserFromOriginalTransactionID(originalTransactionId);
        paidOrganization = user.subscription.paidOrganization;
        initialOrganization = user.subscription.initialOrganization;
        const transaction = transactionsHelpers.createTransactionObject(decodedTransactionInfo, user.uid, paidOrganization, initialOrganization, subType);//createTransactionObject(decodedTransactionInfo, user.uid, paidOrganization, initialOrganization);
        await transactionsHelpers.saveObjectTransaction(transaction);


        if (secondAction === "RESUBSCRIBE") {
            await firebase.upgradeOrganizationInUser(user.uid, paidOrganization);
        }

        console.log("Guardado con éxito");
    } catch (error) {
        console.log("Error al guardar el objeto de transacción:", error);
    }
}

const subscriptionHandler = async (subType, originalTransactionId, decodedTransactionInfo) => {
    try {
        await saveObjectTransactionHandler(subType, originalTransactionId, decodedTransactionInfo, subType)

    } catch (error) {
        throw error;
    }
};


// Exporta las funciones necesarias
module.exports = {
    notificationAppleHandler,
};