const User = require('../models/user');


module.exports.loginForm = (req, res)=>{
    res.render('users/login')
};

module.exports.loginLogic = (req, res)=>{
    req.flash('success', 'welcome back user');
    res.redirect('/games');
};

module.exports.registerForm = (req, res)=>{
    res.render('users/signup');
};

module.exports.registerLogic = async (req, res)=>{
    try {
        const newUser = new User({
            username: req.body.username,
            cgpa: req.body.cgpa,
            gender: req.body.gender,
            phone: req.body.phone,
            dob: req.body.dob
        });
        let registeredUser = await User.register(newUser, req.body.password);
        req.login(registeredUser, function(err){
            if(error){ 
                req.flash('error', 'Something went wrong while signing you up, please try again');
                console.log(error);
                res.redirect('/games');
            }
            req.flash('success', 'Registration successful');
            res.redirect('/games');
        });
    } catch (error) {
        req.flash('error', 'Something went wrong while signing you up, please try again');
        console.log(error);
        res.redirect('/games');
    }
};

module.exports.logoutUser = (req, res)=>{
    req.logout(function(error){
        if(error) {
            req.flash('error', 'Something went wrong while logging you out, please try again');
            console.log(error);
            res.redirect('/games');
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/games');
    });
};