var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

//PROFILE//////////////
router.get('/profile', isLoggedIn, function(req,res,next){
    res.render('user/profile');
});
//LOG OUT
router.get('/logout',isLoggedIn, function(req,res,next){
    req.logout();
    res.redirect('/');
})
//Check if user is not loggedIn before accessing the following routes
router.use('/', notLoggedIn, function(req,res,next){
    next();
});
router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));
//SIGNIN///////////////
router.get('/signin', function(req,res,next){
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));
module.exports = router;

//custom middleware to check if user is logged in
function isLoggedIn(req, res, next){
    //isAuthenticated is a Passport function
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
//custom middleware to check if user is logged in
function notLoggedIn(req, res, next){
    //isAuthenticated is a Passport function
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}





