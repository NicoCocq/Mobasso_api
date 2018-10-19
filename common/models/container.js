'use strict';

module.exports = function(Container) {
  Container.saveConfig = function(req, res) {
    var fs = require('fs');

    fs.writeFileSync("server/storage/" + req.params.container.toString() + "/apk_config.txt", JSON.stringify(req.body));
  };

  Container.remoteMethod('saveConfig', {
    accepts: [
      {arg: 'req', type: 'object', http: { source: 'req' }},
      {arg: 'res', type: 'object', http: { source: 'res' }}
    ],
    returns: {arg: 'status', type: 'string'},
    http: {path: '/:container/saveConfig', verb: 'post'}
  });
};
