module.exports = function(app){
  var formConfigRouter = app.loopback.Router();
  var fs = require('fs');
  //Get Form For Config App
  formConfigRouter.get('/', function (req, res) {
    res.render('form_config.pug');
  })

  //Add Configs in APK
  formConfigRouter.post('/', function(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const logo = req.body.logo;
    const primaryColor = req.body.primaryColor;
    const donation = req.body.donation;
    const facebook = req.body.facebook;
    const twitter = req.body.twitter;
    const instagram = req.body.instagram;
    const youtube = req.body.youtube;
    if(title === undefined || description === undefined || logo === undefined || primaryColor === undefined) {
      res.status(400).end();
      return;
    }
    var infos = JSON.stringify(req.body);
    console.log(infos);
    fs.writeFile('apk_config.txt', infos, function(err) {
      if(err) {
        throw err;
      }
    });
    res.render('ok.pug');

  });
  app.use(formConfigRouter);
}
