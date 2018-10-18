module.exports = function(app){
  var formConfigRouter = app.loopback.Router();
  var fs = require('fs');
  var multer = require('multer');
  var upload = multer({ dest: 'uploads/' });
  var express = require('express');
  app.use(express.static('public'));

  //Go To Index/Login Page
  formConfigRouter.get('/', function (req, res) {
    res.render('index.pug');
  })

  //Logging Function
  formConfigRouter.post('/', function (req, res) {
    //TODO logging if ok form if nok index
    console.log("Test Logging");
    res.render('form_config.pug');
  })

  //Go To Register Page
  formConfigRouter.get('/register', function (req, res) {
    res.render('register.pug');
  })

  //Registing function
  formConfigRouter.post('/register', function(req, res) {
    //TODO Registing if ok form if nok index
    console.log("Test Registing");
    res.render('form_config.pug');
  })

  //Get Form For Config App
  formConfigRouter.get('/formConfig', function (req, res) {
    res.render('form_config.pug');
  })

  //Add Configs in APK
  formConfigRouter.post('/formConfig', upload.single('logo'), function(req, res, next) {
    const file = req.file;
    const title = req.body.title;
    const description = req.body.description;
    const primaryColor = req.body.primaryColor;
    const donation = req.body.donation;
    const facebook = req.body.facebook;
    const twitter = req.body.twitter;
    const instagram = req.body.instagram;
    const youtube = req.body.youtube;

    if(title === undefined || description === undefined || file === undefined || primaryColor === undefined) {
      res.status(400).end();
      return;
    }

    var filename = file.destination + file.originalname;
    fs.renameSync(file.path, filename);

    var infos = JSON.stringify(req.body);
    var apkConfigFile = "apk_config.txt";
    fs.writeFileSync(apkConfigFile, infos, function(err) {
      if(err) {
        throw err;
      }
    });

    uploadFile(filename, file.mimeType);
    uploadFile(apkConfigFile, "text/plain");

    res.render('ok.pug');

  });

  app.use(formConfigRouter);
}


  function uploadFile(file, contentType) {
    var request = require('request');
    var path = require('path');
    var fs = require('fs');

    var filename = path.basename(file);

    var target = 'http://10.33.2.244:3000/api/containers/test/upload' //TODO remplacer test par nom assos en var global

    var formData = {
      custom_file: {
        value:  fs.createReadStream(file),
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
