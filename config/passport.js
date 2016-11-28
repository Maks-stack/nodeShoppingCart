var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

//Store the User in the Session
//done is executed as callback
passport.serializeUser(function(user, done){
    done(null,user.id);
});
//get user out of session
passport.deserializeUser(function(id, done){
    User.findById(id, function (err,user){
        done(err,user);
    })
});
//strategy for signing user up
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
}, function(req, email, password, done){
    // express validator checks the body
    //checkbody,notEmpty() and isEmail() are added by validator
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
    //storing errors thrown by validators
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach( function(error) {
            //msg field is added by express-validator
            messages.push(error.msg);
        });
        // return without error but no success
        //add errors directly
        return done(null, false, req.flash('error', messages));
    }
    //find user with email
    User.findOne({'email': email}, function(err,user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null,false, {message: 'Email is already in use.'});
        }
        // if there is now user yet, create one
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err,result){
           if(err){
            return done(err);
           }
           return done(null,newUser);
        });
    });
}));
//Strategy for logging user in
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
}, function(req, email, password, done){
    // express validator checks the body
    //checkbody,notEmpty() and isEmail() are added by validator
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    //storing errors thrown by validators
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach( function(error) {
            //msg field is added by express-validator
            messages.push(error.msg);
        });
        // return without error but no success
        //add errors directly
        return done(null, false, req.flash('error', messages));
    }
    //find user with email
    User.findOne({'email': email}, function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false, {message: 'User not found'});
        }
        //user function from User model to check if password is valid
        if(!user.validPassword(password)){
            //return fail with wrong password
            return done(null,false, {message: 'Wrong password'});
        }
        //return with no error and the user
        return done(null,user);
    });
}));














