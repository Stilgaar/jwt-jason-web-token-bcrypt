// on invoque DB
const express = require('express');
const app = express();

//npm i cookie-parser
const cookieParser = require('cookie-parser')
// lien de la db
require("./db.js");

// routes 
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware.js');

// quel port ? 
const port = 4000

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// sur quel port on écoute ?
app.listen(port)

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

// COOOKIES !!
// pour donner une idée comment ça marche, on va s'en servir autrement par la suite (evideeemmmennt)
// m'est d'avis que ça va être un middleware qu'on va rajouter sur les routes voulues au fur et a mesure
// app.get('/set-cookies', (req, res) => {
// 
//     //  res.setHeader('Set-Cookie', 'newUser=true')
// 
//     // c'est la même chose qu'on à écris juste au dessus
//     // sauf qu'on utilise un middleware (cookieParser)
//     // ah et au lieu de le mettre à true le newUser, on le mets à false (=)
//     res.cookie('newUser', false)
//     res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
//     // maxAge (un jour en miliseconds) 
//     // httpOnly : on peut pas l'accèder en JavaScript, comme par exmeple dans le console.log ou le document.cookie
//     res.send("cookies ok")
//
// })
// 
// app.get('/read-cookies', (req, res) => {
// 
//     const cookies = req.cookies
//     console.log(cookies)
// 
//     res.json(cookies)
// })