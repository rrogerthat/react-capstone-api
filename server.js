"use strict";

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');	

const { router: usersRouter } = require('./users'); //reassign variable name to usersRouter (instead of router)
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth'); //both files exporting 'router' so we change variable

mongoose.Promise = global.Promise;

const cors = require('cors');
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config');

const app = express();
app.use(morgan('common'));	
app.use(bodyParser.json());
app.use(
    cors({
    	origin: CLIENT_ORIGIN
    })
);

passport.use(localStrategy);
passport.use(jwtStrategy);
//request handler
app.use('/api/users/', usersRouter); //Requests to /api/users is redirected to usersRouter (renamed from router)
app.use('/api/auth/', authRouter);  

const jwtAuth = passport.authenticate('jwt', { session: false }); //use passport to authenticate rather than cookies.

app.get('/api/', (req, res) => {
	res.json({ok: true});
});

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {			//hook this up to main data
  return res.json({
    data: 'rosebud'
  });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(databaseUrl, port = PORT) {          //Error: listen EADDRINUSE :::8080??

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };