const express = require('express');
const app = express();
const admin = require('firebase-admin')
const firebaseConfig = require('./saluta-app-firebase-adminsdk-5px0w-a157139d8f.json')


// Se Inicializa la conexion con firebase
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
})

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const sandBoxRoutes = require('./src/routes/sandboxRoutes')

app.use('/subscriptions', subscriptionRoutes);
app.use('/transactions', transactionRoutes);
app.use('/sandbox', sandBoxRoutes)

// Iniciar el servidor
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
