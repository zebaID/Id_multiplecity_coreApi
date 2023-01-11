module.exports = function(OnlineTest) {
	
  OnlineTest.calculateTestScore = function(questionId,answerId,driverId,cb) {
    // sql query
    var sql = 'select * from calculate_test_score(\'' + questionId + '\',\'' + answerId + '\',\'' + driverId + '\')';
       console.log(questionId);
       console.log(answerId);
       console.log(driverId);
    // call sql query from postreSQL
   OnlineTest.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  OnlineTest.remoteMethod(
    'calculateTestScore', {
      accepts: [{
        arg: 'questionId',
        type: 'string',
        required: true
      },{
        arg: 'answerId',
        type: 'string',
        required: true
      },{
        arg: 'driverId',
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
