const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Person = require('./models/Person');

passport.use(new localStrategy(async(Username, Password, done) => {
    try {
        console.log('Received credentials:', Username, Password);
        const user = await Person.findOne({username: Username});

        if (!user) {
            return done(null, false, {message: 'Incorrect username.'});
        }

        const isPasswordMatch = await user.comparePassword(Password);
        if (isPasswordMatch) {
            return done(null, user);
        } else {
            return done(null, false, {message: 'Incorrect password.'});
        }
    } catch (error) {
        return done(error);
    }
}))

module.exports = passport;