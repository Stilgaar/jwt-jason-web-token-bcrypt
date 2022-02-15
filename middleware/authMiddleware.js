const jwt = require('jsonwebtoken')
const User = require('../models/Users')

const requireAuth = (req, res, next) => {

    // check si le token existe first
    const token = req.cookies.jwt

    // ok ce middleware est trop bien foutu.
    // en gros on va verifié si le token est encore présente dans le req.cookie (le cookie en gros)
    // puis s'il y a pas de cookie ou s'il y a une erreure, on va rediriger vers le login
    // bon c'est cool parce que tout est dans le back la donc, heu bha voilà. 
    // mais avec ça doit yavoir moyen de surveiller les routes et d'envoyer un message d'erreure plus facilement
    // dans le front qui supprimerais l'user et aussi supprimerait le cookie au cas ou. 
    // rendant la navigation imposssible.
    // la dans le 'else' fonctionnant, on balance un next(), pour que la suite du code s'execute quand même
    // les autres ya un res, donc ça va arrêter de toutes façons

    // ce middleware est utilisable partout, c'est l'interet 

    if (token) {
        jwt.verify(token, 'SECRETAMETTREDANSUN.ENV', (err, decodedToken) => {
            if (err) {
                res.redirect('/login')
            } else {
                next()
            }
        })
    } else {
        res.redirect('/login')
    }

}

// check l'user

const checkUser = (req, res, next) => {

    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'SECRETAMETTREDANSUN.ENV', async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null // le res.locals.cacahouette te permet d'utiliser un truc localement en local (du coup t'as vu ?)
                next()
            } else {
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })

    } else {
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkUser }