function register() {
  const associationName = req.body.associationName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPwd = req.body.confirmPwd;

  // Check value conformity
  if( associationName === undefined || email === undefined ||
      password === undefined ||confirmPwd === undefined ) {
    res.status(400).end();
    return;
  }

  if( !password.equals(confirmPwd) ) {
    res.status(400).end();
    return;
  }

  // Register account using API
  var formData = {
    association_name: associationName,
    email: email,
    password: password
  };

  request.post({url: "localhost:3000/api/accounts", formData: formData}, function callback(err, httpResponse, body) {
    if(err) {
      return console.log('Error while creating account : ', err);
    }

    console.log('Account created !');

    // Remembers accountId for the next
    var account = JSON.parse(body);

    // Create the association container using API
    formData = {
      name: account.id
    };
    request.post({url: "localhost:3000/api/containers", formData: formData}, function callback(err, httpResponse, body) {
      if(err) {
        return console.log('Error while creating the container : ', err);
      }

      console.log('Container created !');

      // Redirect to the next page

    });
  });
}
