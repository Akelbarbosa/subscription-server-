const admin = require('firebase-admin')
const db = admin.firestore();

///Metodo de prueba. trae a los usuarios que tengan una suscripcion
const userWithSuscription = async () => {
    try {
        const querySnapshot = await db.collection('users').where('subscription', '!=', null).get()
        const result = []

        querySnapshot.forEach((doc) => {
            result.push(doc.data())
        })
        return result
    } catch {
        console.error("Error getting documents: ", error);
        throw error;
    }

}

///Metodo para hacer un upgrade de la suscripcion del usuario 
const upgradeOrganizationInUser = async (userID, newOrganization) => {
    try {
        const userRef = db.collection('users').doc(userID);
    
        // Verificar si el documento existe antes de actualizarlo
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
          throw new Error("El usuario con el ID especificado no existe.");
        }
    
        
        await userRef.update({ organization: newOrganization });
    
        return "Organización actualizada exitosamente";
      } catch (error) {
        console.error("Error al actualizar la organización del usuario:", error);
        throw error;
      }
}


///Metodo para obtener la actualizacion que tiene la organizacion
const getUpgradeOrganizationFromOrganization = async (organizationName) => {
    try {
        const querySnapshot = await db.collection('organization').where('name', '==', organizationName).get();
        let result = "";

        querySnapshot.forEach((doc) => {
            result = doc.data().payOrganization;
        });

        if (result === "") {
            throw new Error("No se encontraron resultados para la organización " + organizationName);
        }

        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * Busca un usuario en la colección de usuarios basado en un ID de transacción original.
 *
 * @param {string} transactionID - El ID de transacción original a buscar.
 * @returns {Promise<object>} El objeto de usuario encontrado.
 * @throws {Error} Si no se encuentra ningún usuario con el ID de transacción.
 */
const getUserFromTransactionID = async (transactionID) => {
    try {
        const usersCollection = db.collection('users');        
        const querySnapshot = await usersCollection.where('subscription.transactionID', '==', transactionID).get();
    
        if (querySnapshot.empty) {
          throw new Error("No se encontraron usuarios con la transacción ID: " + transactionID);
        }
    
        const user = querySnapshot.docs[0].data();
        return user;

      } catch (error) {
        console.error("Error al buscar usuario por transacción ID:", error);
        throw error;
      }
    
}


///Metodo para actualizar la fecha de compra y finalizacion de la suscripcion en el user
const updateSubscriptionDatesInUser = async (userID, newStart, newEnd) => {
    try {
        const userRef = db.collection('users').doc(userID)

        const userDoc = await userRef.get()
        if (!userDoc.exists) {
            throw new Error("El usuario con el ID especificado no existe.")
        }

        const userSubscription = userDoc.data().subscription || {}

        userSubscription.start = newStart
        userSubscription.end = newEnd

        await userRef.update({ subscription: userSubscription })

        return "Fechas de suscripción actualizadas exitosamente"
    } catch (error) {
        console.error("Error al actualizar las fechas de suscripción del usuario:", error)
        throw error
    }
}



/// Metodo para guardar en la db una trasaction 
const saveTransaction = async (objectTransaction) => {
    try {
        await db.collection('transactions_app').add(objectTransaction)
    } catch (error) {
        console.error("Error al guardar objecto en la db: ", error);
        throw error;
    }
}

module.exports = {
    db,
    userWithSuscription, 
    upgradeOrganizationInUser,
    getUpgradeOrganizationFromOrganization,
    getUserFromTransactionID,
    saveTransaction,
    updateSubscriptionDatesInUser,
}