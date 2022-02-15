const mongoose = require('mongoose');

const protocolMongo = "mongodb";
const hostMongo = "localhost";
const portMongo = "27017";
const dbname = "JWTtesting";

const DB_URI = `${protocolMongo}://${hostMongo}:${portMongo}/${dbname}`;
// les nouveaux trucs pour se connecter à mongo pour pas que ce soit dépérciated (ouais je découvre)
// genre ça a changé depuis qu'on l'a appris ya quelques mois, c'est ouf :o
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log(`Connecté sur ${DB_URI}`))
    .catch(err => console.log(err)) 