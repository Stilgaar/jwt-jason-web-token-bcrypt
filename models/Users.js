const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Veuillez fournir un email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Rentez un email valide']
    },
    password: {
        type: String,
        required: [true, 'Veuillez fournir un mot de passe'],
        minlength: [6, 'Il vous faut au moins 6 caratrères']
    },
})

// MONGOOSE HOOKS
// toujours lancer un 'next()' dans les middleware mongoose, sinon ça bloque =)
// lancer une fonction après qu'un nouvelle entrée à été réalisée
// userSchema.post('save', function (doc, next) {
//     console.log('nouvel utilisateur crée et sauvgardé', doc)
//     next()
// })

// lance une fonction avant que le document soit sauvgardé sur la db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// methode statique pour login un user... (putain on fait un Users.login ? :o (cassdédi à Loïs))
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error('no password')
    }
    throw Error('no email')
}

const User = mongoose.model('user', userSchema)
module.exports = User;