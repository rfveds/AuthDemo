const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');


app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/secret', (req, res) => {
    res.send('you have to be logged in to see this')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})