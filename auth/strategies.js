'use strict';
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/models');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((username, password, callback) => { //using passport-local module to authorize user
  let user;                                                                
  User.findOne({ username: username })  //look for user with supplied u/n.
    .then(_user => {                    //go over meaning.
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);  //instance method from models.js. Boolean.
    })  //If the password is valid, the user object will be added to the request object at req.user?
    .then(isValid => {  //if p/w not valid (passed in from the above return)
      if (!isValid) {  //ternary operator?
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);  //null is no errors? If p/w valid, user obj added to req obj at req.user.
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);  //err is message in reject (above).
      }
      return callback(err, false);  //Error other than loginError?
    });
});

const jwtStrategy = new JwtStrategy(  //Object {}, then function  //using passport-jwt module (user accessing protected route)
  {
    secretOrKey: JWT_SECRET,  //This strategy uses this secret to decode token.
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'), //This strategy retrieves token from request's Header.
    // Only allow HS256 tokens - the same as the ones we issue  //In Postman, put in Headers: Authorization: Bearer <token>
    algorithms: ['HS256']
  },
  (payload, done) => {        //payload is 2nd section in JWT?
    done(null, payload.user); //assign user decoded from payload to req.user in req object.
  }                           //(done is success case with null saying no errors with this user).
);

module.exports = { localStrategy, jwtStrategy };
