module.exports = function(OtherUser) {

	OtherUser.getUsers = function(operationCity, cb) {
    // sql query
    var sql = 'select * from get_users(\'' + operationCity + '\')';

    // call sql query from postreSQL
    OtherUser.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver list to allocate duty ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  OtherUser.remoteMethod(
    'getUsers', {
      accepts: [{
        arg: 'operationCity',
        type: 'string',
        required: true
      }],
      returns: [{
        type: 'string',
        required: true,
        root: true
      }],
      http: {
        verb: 'get'
      }
    }
  );

};