const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User'); // Assuming the User model is in models/User.js
const keys = require('./keys');

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
        done(null, user.id);
        console.log(user.id);

    })});



// Passport Local Strategy
/*
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            const isMatch = await User.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

*/

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: keys.google.GOOGLE_CLIENT_ID,
    clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {

    console.log(profile);
  
    try {
        const user = await User.findOrCreate(profile, 'google');
        done(null, user);
    } catch (err) {
        done(err);
    }
    
}));

// Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: 'FACEBOOK_APP_ID',
    clientSecret: 'FACEBOOK_APP_SECRET',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOrCreate(profile, 'facebook');
        done(null, user);
    } catch (err) {
        done(err);
    }
}));

// Passport Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: keys.twitter.TWITTER_CONSUMER_KEY,
    consumerSecret: keys.twitter.TWITTER_CONSUMER_SECRET,
    callbackURL: '/auth/twitter/callback',
    includeEmail: true
}, async (token, tokenSecret, profile, done) => {

    console.log(profile);

   /*
    try {
        const user = await User.findOrCreate(profile, 'twitter');
        done(null, user);
    } catch (err) {
        done(err);
    }
        */
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

/*
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
*/

module.exports = passport;
