const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { redirect } = require('express/lib/response');


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/auth-demo');
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('this is the homepage');
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username: username,
        password: hash
    })
    await user.save();
    res.redirect('/');
})

app.get('/secret', (req, res) => {
    res.send('you have to be logged in to see this')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})