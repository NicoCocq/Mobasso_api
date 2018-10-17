'use strict';

module.exports = function enableAuthentication(server, cb) {
  const ds = server.dataSources.mysql_db;

  const models = [
    'ACL',
    'AccessToken',
    'Account',
    'Role',
    'News',
  ];

  ds.setMaxListeners(Infinity);

  ds.autoupdate(models, function(err) {
    if (err) return cb(err);
    console.log('Tables [' + models + '] created in ', ds.adapter.name);
    cb();
  });
};
