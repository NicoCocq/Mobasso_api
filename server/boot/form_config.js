

module.exports = function(app) {
  var formConfigRouter = app.loopback.Router();
  var fs = require('fs');
  var multer = require('multer');
  var upload = multer({dest: 'uploads/'});
  var express = require('express');
  //var session = require('express-session');

  //app.use(session({secret:'AZERTY'}))
  app.use(express.static('public'));

  //GLOBAL VAR
  global.ssn = "";

  //Go To Index/Login Page
  formConfigRouter.get('/', function (req, res) {
    res.render('index.pug');
  })

  //Logging Function
  formConfigRouter.post('/', function (req, res) {
    console.log("Test Logging");
    login(req, res);
  });

  //Go To Register Page
  formConfigRouter.get('/register', function (req, res) {
    res.render('register.pug');
  })

  //Registing function
  formConfigRouter.post('/register', function(req, res) {
    //TODO Registing if ok form if nok index
    console.log("Test Registing");
    register(req, res);
    res.redirect('/formConfig');
  })

  //Get Form For Config App
  formConfigRouter.get('/formConfig', function (req, res) {
    console.log("userId = " + ssn);
    res.render('form_config.pug');
  })

  //Add Configs in APK
  formConfigRouter.post('/formConfig', upload.single('logo'), function(req, res, next) {

    console.log(ssn);

    const file = req.file;
    const title = req.body.title;
    const description = req.body.description;
    const primaryColor = req.body.primaryColor;
    const donation = req.body.donation;
    const facebook = req.body.facebook;
    const twitter = req.body.twitter;
    const instagram = req.body.instagram;
    const youtube = req.body.youtube;

    if (title === undefined || description === undefined ||
      file === undefined || primaryColor === undefined) {
      res.status(400).end();
      return;
    }

    var filename = file.destination + file.originalname;
    fs.renameSync(file.path, filename);

    req.body.logo = file.originalname;

    var infos = JSON.stringify(req.body);
    var apkConfigFile = "apk_config.txt";
    fs.writeFileSync(apkConfigFile, infos, function(err) {
      if (err) {
        throw err;
      }
    });

    uploadFile(filename, file.mimeType);
    uploadFile(apkConfigFile, 'text/plain');

    res.render('ok.pug');
  });

  app.use(formConfigRouter);
};


//FUNCTIONS
function uploadFile(file, contentType) {
  var request = require('request');
  var path = require('path');
  var fs = require('fs');

  var filename = path.basename(file);

  var target = 'http://localhost:3000/api/containers/' + ssn.toString() + '/upload';

  var formData = {
    custom_file: {
      value: fs.createReadStream(file),
      options: {
        filename: filename,
        contentType: contentType
      }
    }
  };

  request.post({url: target, formData: formData}, function optionalCallback(err, httpResponse, body) {
    fs.unlink(file);

    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
  });
}



function register(req, res) {
  var request = require('request');

  const associationName = req.body.associationName;
  const email = req.body.email;
  const password = req.body.pass;
  const confirmPwd = req.body.pass2;

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

    });
  });
}


function login(req, res) {
  var request = require('request');

  const email = req.body.email;
  const password = req.body.pass;

  if( email === undefined || password === undefined ) {
    //res.status(400).end();
    //TODO manque infos
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
    else
    {
      var account = body.valueOf();

      console.log(account);
      console.log(account.userId);

      ssn = account.userId;
      console.log(ssn);
      res.redirect('/formConfig');
    }

    console.log("Logged !");
  });
}
