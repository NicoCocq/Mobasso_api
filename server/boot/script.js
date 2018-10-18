module.exports = function(app) {
  var formConfigRouter = app.loopback.Router();
  var express = require('express');
  app.use(express.static('public'));

  //Go To Index/Login Page
  /*
  formConfigRouter.get('/', function (req, res) {
    res.render('index.pug');
  });*/

  formConfigRouter.get('/test', function(req, res) {
    login();
    res.render('ok.pug');
  });

  app.use(formConfigRouter);
};


function register() {
  var request = require('request');
  /*
  const associationName = req.body.associationName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPwd = req.body.confirmPwd;*/
  const associationName = "La croix rouge";
  const email = "lcr@gmail.com";
  const password = "a";
  const confirmPwd = "a";

  // Check value conformity
  if( associationName === undefined || email === undefined ||
      password === undefined ||confirmPwd === undefined ) {
    res.status(400).end();
    console.log("Error : values are not conform.");
    return;
  }

  if( password !== confirmPwd ) {
    res.status(400).end();
    console.log("Error : password and confirmation are different.");
    return;
  }

  // Register account using API
  var options = {
    uri: "http://localhost:3000/api/accounts",
    method: 'POST',
    json: {
      association_name: associationName,
      email: email,
      password: password
    }
  };

  request(options, function(err, httpResponse, body) {
    if( err || httpResponse.statusCode !== 200 ) {
      return console.log('Error while creating account : ', err);
    }

    console.log('Account created !');

    // Remembers accountId for the next
    var account = body.valueOf();

    options.json = {
      name: account.id.toString()
    };
    options.uri = "http://localhost:3000/api/containers";

    request(options, function(err, httpResponse, body) {
      if( err || httpResponse.statusCode !== 200 ) {
        return console.log('Error while creating the container : ', err);
      }

      console.log('Container created !');

      // Redirect to the next page

    });
  });
}


function login() {
  var request = require('request');
  /*
  const email = req.body.email;
  const password = req.body.pass;*/
  const email = "lcr@gmail.com";
  const password = "a";

  if( email === undefined || password === undefined ) {
    //res.status(400).end();
    console.log("Error, values are not conform.");
    return;
  }


  var options = {
    uri: "http://localhost:3000/api/accounts/login",
    method: 'POST',
    json: {
      email: email,
      password: password
    }
  };

  request(options, function(err, httpResponse, body) {
    if( err || httpResponse.statusCode !== 200 ) {
      //res.status(400).end();
      return console.log("User does not exist.");
    }

    console.log("Logged !");
    // Add global variable (https://stackoverflow.com/questions/40755622/how-to-use-session-variable-with-nodejs)
  });
}

