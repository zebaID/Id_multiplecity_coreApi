module.exports = function(DriverAllocationReport) {
DriverAllocationReport.createAllocationHistory = function(bookingId, driverId, userId, allocationStatus,cb) {
        // sql query
        var sql = 'select * from create_allocation_history('+bookingId +', '+driverId+', '+ userId +', \'' + allocationStatus + '\' )';

        console.log('Duty  Accept function ...' + sql);
        // call sql query from postreSQL
        DriverAllocationReport.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error accepting duty ...');
                console.log(err);
                return cb(err);
            }
            console.log('allocation history function ...' + JSON.stringify(result));
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    DriverAllocationReport.remoteMethod(
        'createAllocationHistory', {
            accepts: [{
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'driverId',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
                type: 'string',
                required: true
            }, {
                arg: 'allocationStatus',
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
};
