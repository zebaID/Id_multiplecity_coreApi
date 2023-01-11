module.exports = function(ExceptionOutstationCity) {


ExceptionOutstationCity.fetchExceptionCity = function(city,cb) {
        // sql query
        var sql = 'select count(*) from exception_outstation_city where exception_city = \'' + city + '\' ';

        // call sql query from postreSQL
        ExceptionOutstationCity.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting exception city ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ExceptionOutstationCity.remoteMethod(
        'fetchExceptionCity', {
            accepts: [{
                arg: 'city',
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
