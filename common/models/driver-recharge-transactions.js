module.exports = function(DriverRechargeTransactions) {
	
DriverRechargeTransactions.driverRechargeOnline = function(transactionId, cb) {
        // sql query
        var sql = 'select * from driver_recharge_online(' + transactionId + ')';

        // call sql query from postreSQL
        DriverRechargeTransactions.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver current duty ...');
                console.log(err);
                return cb(err);
            }else{
                var sql1 = 'select cu.first_name, cu.last_name, cu.mobile_number, dr.amount from con_users cu,driver_details dd, driver_recharge_transactions dr where cu.id = dd.conuser_id and dd.id = dr.driver_id and dr.id = \'' + transactionId + '\'';

                DriverRechargeTransactions.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                    if (err) {
                        console.log('error in fetching driver data ...');
                        console.log(err);
                        return cb(err);
                    } else {
                         var ConUsers = DriverRechargeTransactions.app.models.ConUsers;
                        console.log('driver data ...' + JSON.stringify(result1));
                        var drvName = result1[0].first_name + ' ' + result1[0].last_name;
                        var drvMobile = result1[0].mobile_number;
                        var amount = result1[0].amount;
                        var drvMsg = 'Dear ' + drvName + ',%0aRs.' + amount + ' credited in you Indian Drivers account. For queries, please reach us on 020-69400400.';
                        ConUsers.sendSMS(drvMobile, drvMsg, cb);
                    }
                });
                console.log('online payment success ...' + JSON.stringify(result));
                 
            }
        });

    };

    //Remote method to get provider of email

    DriverRechargeTransactions.remoteMethod(
        'driverRechargeOnline', {
            accepts: [{
                arg: 'transactionId',
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
    
    
     DriverRechargeTransactions.updateTransaction = function(id, orderID, status, amount, updatedDate,updatedBy,cb) {
        // sql query
        var sql =  'update driver_recharge_transactions set status=\'' + status + '\', order_id=\'' + orderID + '\'  WHERE id=' + id + '';
        

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error verifying account email ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    DriverRechargeTransactions.remoteMethod(
        'updateTransaction', {
           accepts: [{
            arg: 'id',
            type: 'string',
            required: true
          }, {
            arg: 'orderID',
            type: 'string',
            required: true
          }, {
            arg: 'status',
            type: 'string',
            required: true
          }, {
            arg: 'amount',
            type: 'string',
            required: true
          }, {
            arg: 'updatedDate',
            type: 'string',
            required: true
          }, {
            arg: 'updatedBy',
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
