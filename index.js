const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { redirect } = require('express/lib/response');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/auth-demo');
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
    secret: 'verysecressecret',
    name: 'AuthDemo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
    }
};
app.use(session(sessionConfig));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', (req, res) => {
    res.send('this is the homepage');
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const user = new User({username, password});
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { password, username } = req.body;

    const foundUser = await User.findAndValidate(username, password);

    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})