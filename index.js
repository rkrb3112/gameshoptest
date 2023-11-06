const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();

// ! DB setup
mongoose
    .connect(process.env.DB_URI)
    .then(()=>{
        console.log('db connected');
    })
    .catch((error)=>{
        console.log(error);
    });

const User = require('./models/user');

// ! session setup
app.use(session({
    secret: 'very secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 2
    }
}));

// ! passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ! server setup
// flash setup
app.use(flash());
// serving static files
app.use(express.static(path.join(__dirname, 'public')));
// form data parsing
app.use(express.urlencoded({extended: true}));
// remove ejs extension
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res)=>{
    res.send('working');
})

const gameRoutes = require('./routes/games');
const notifRoutes = require('./routes/notifications');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const quesRoutes = require('./routes/questions');
app.use(gameRoutes);
app.use(notifRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(quesRoutes);

const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`server running on port ${port}`);
})