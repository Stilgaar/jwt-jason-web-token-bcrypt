const User = require('../models/Users')
const jwt = require('jsonwebtoken')

// errors 
const handleErrors = (err) => {

    //  console.log(err.message, err.code)

    let errors = { email: "", password: "" }
    // duplicata d'email ?
    // je mets le code 11000 parce que contrairement aux autres erreurs, il est impossible d'écrire celle ci dans le modele. (doit yen avoir d'autre, mais celle la c'est celle là)
    // et ici ne l'occurence, on a cette erreur en checkant les err.code (cool)

    if (err.message === 'no email') {
        errors.email = 'Cet utilisateur n\'existe pas'
    }

    if (err.message === 'no password') {
        errors.password = 'Mot de passe incorrect'
    }

    if (err.code === 11000) {
        errors.email = 'Email déjà utilisé'
        return errors;
    }

    // erreurs de validation 
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60 // ça c'est trois jours, en secondes, un jwt demande un secondes, un cookie en miliesecondes (pour des fuckings raison)
// creation de tokens avec JWT on prends l'id de l'user, puis on retourne le JWT avec la methode SIGN( dans laquelle on passe le l'id, le 'secret' et son expiration ) expiration unique au JWT, pas au cookie
const createToken = (id) => {
    return jwt.sign( // methode pour singup le jwt (yhea c'est comme ça)
        { id },
        'SECRETAMETTREDANSUN.ENV', {
        expiresIn: maxAge
    })
}


module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id)

        res.cookie('jwt', // on envoi un cookie dans le front avec res.cookie
            token,  // pour ça on envoi le token crée juste au dessus
            { httpOnly: true, maxAge: maxAge * 1000 })  // on indique que c'est httpOnly pour bien s'assurer que ça ne peut pas être lu par un conosle.log et un maxAge * 1000 (parce que c'est de nouveau en milisecondes)
        res.status(201).json({ user: user._id })

    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.login_post = async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })

    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }

}

// alors pour 'virer' un cookie, du back on peut pas vraiment vraiment du coup on fait quoi ? 
// on le remplace par un autre cookie ici "jwt" ou peu importe comment on l'a appellé
// et on lui donne un maxAge de 1ms, donc autant dire que c'est plutôt court
// puis on redirige vers des sales \o/
module.exports.logout_get = (req, res) => {

    res.cookie('jwt', '', { httpOnly: true, maxAge: 1 })
    res.redirect('/')

}