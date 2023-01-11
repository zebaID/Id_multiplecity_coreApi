module.exports = function(DriverPaymentCycles) {
 


DriverPaymentCycles.generatePaymentCycle = function(paymentCycleId, driverId, bookingId, driverShare, createdBy, createdDate, cb) {
        // sql query
        var sql = 'select * from generate_payment_cycle(\''+paymentCycleId+'\', \''+driverId+'\', \''+bookingId+'\', '+driverShare+', \''+createdBy+'\', \''+createdDate+'\' )';

        
        // call sql query from postreSQL
        DriverPaymentCycles.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error generating payment cycle ...');
                console.log(err);
                return cb(err);
            }
            console.log('payment cycle generated...' + JSON.stringify(result));
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    DriverPaymentCycles.remoteMethod(
        'generatePaymentCycle', {
            accepts: [{
                arg: 'paymentCycleId',
                type: 'string',
                required: true
            },{
                arg: 'driverId',
                type: 'string',
                required: true
            },{
                arg: 'bookingId',
                type: 'string',
                required: true
            },{
                arg: 'driverShare',
                type: 'string',
                required: true
            },{
                arg: 'createdBy',
                type: 'string',
                required: true
            },{
                arg: 'createdDate',
                type: 'string',
                required: true
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

    DriverPaymentCycles.paymentConfirmation = function(paymentCycleId, driverId, cb) {
        // sql query
        var sql = 'select * from payment_confirmation(\''+paymentCycleId+'\', \''+driverId+'\')';

        
        // call sql query from postreSQL
        DriverPaymentCycles.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error confirmation payment cycle ...');
                console.log(err);
                return cb(err);
            }
            console.log('payment cycle confirmation...' + JSON.stringify(result));
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    DriverPaymentCycles.remoteMethod(
        'paymentConfirmation', {
            accepts: [{
                arg: 'paymentCycleId',
                type: 'string',
                required: true
            },{
                arg: 'driverId',
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
