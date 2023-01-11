module.exports = function(DriverAccount) {

    DriverAccount.driverAmountDeposit = function(driverId, amount, userId, description, cb) {
        // sql query
        var sql = 'select * from driver_amount_deposit(\'' + driverId + '\', ' + amount + ', \'' + userId + '\', \'' + description + '\')';

        // call sql query from postreSQL
        DriverAccount.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in deposit amount ...');
                console.log(err);
                return cb(err);
            } else {

                 
                    cb(err, result);
                

            }

        });

    };

    //Remote method to get provider of email
    DriverAccount.remoteMethod(
        'driverAmountDeposit', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            }, {
                arg: 'amount',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
                type: 'string',
                required: true
            }, {
                arg: 'description',
                type: 'string',
                required: false
            }],
            returns: [{
                type: 'string',
                required: true,
                root: true
            }],
            http: {
                verb: 'post'
            }
        }
    );


     DriverAccount.driverAmountDeduct = function(driverId, amount, userId, description, cb) {
        // sql query
        var sql = 'select * from driver_amount_deduct(\'' + driverId + '\', ' + amount + ', \'' + userId + '\', \'' + description + '\')';

        // call sql query from postreSQL
        DriverAccount.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in deducting amount ...');
                console.log(err);
                return cb(err);
            } else {

                    cb(err, result);
              
            }

        });

    };

    //Remote method to get provider of email
    DriverAccount.remoteMethod(
        'driverAmountDeduct', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            }, {
                arg: 'amount',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
                type: 'string',
                required: true
            }, {
                arg: 'description',
                type: 'string',
                required: false
            }],
            returns: [{
                type: 'string',
                required: true,
                root: true
            }],
            http: {
                verb: 'post'
            }
        }
    );

};
