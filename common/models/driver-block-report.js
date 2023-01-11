'use strict';

module.exports = function(Driverblockreport) {
	 




	 Driverblockreport.driverBlockForCustomer = function(customerId, driverId, userId, remark, cb) {
        // sql query
        var sql = 'select * from driver_block_for_customer('+customerId +', '+driverId+', '+ userId +', \'' + remark + '\')';

        console.log('Driver Block function ...' + sql);
        // call sql query from postreSQL
        Driverblockreport.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in driver block ...');
                console.log(err);
                return cb(err);
            }
            console.log('Driver block for cust function ...' + JSON.stringify(result));
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Driverblockreport.remoteMethod(
        'driverBlockForCustomer', {
            accepts: [{
                arg: 'customerId',
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
                arg: 'remark',
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


    Driverblockreport.driverUnblockForCustomer = function(id, cb ) {


 var sql = 'delete from driver_block_report where id ='+id;

        console.log('Driver unBlock function ...' + sql);
        // call sql query from postreSQL
        Driverblockreport.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in driver block ...');
                console.log(err);
                return cb(err);
            }
            console.log('Driver unblock for cust function ...' + JSON.stringify(result));
            cb(err, result);
        });

    };


    Driverblockreport.remoteMethod(
        'driverUnblockForCustomer', {
            accepts: [{
                arg: 'id',
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
