module.exports = function(OtherJobsRequest) {

    OtherJobsRequest.applyOtherJob = function(otherJobsId, otherUserId, userId, remark, cb) {
        // sql query
        var sql = 'select * from apply_other_job(' + otherJobsId + ' ,' + otherUserId + ',' + userId +',\''+remark+'\')';
        console.log('apply job function ...' + sql);
        
        OtherJobsRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in apply job ...');
                console.log(err);
                return cb(err);
            } else {
                cb(err, result);
               /* var sql1 = 'select cu.first_name, cu.last_name, cu.mobile_number, b.reporting_date, b.reporting_time from con_users cu,driver_details cd, bookings b where cu.id = cd.conuser_id and cd.id = b.driver_id and b.id = \'' + bookingId + '\'';

                Invoices.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                    if (err) {
                        console.log('error in fetching customer data ...');
                        console.log(err);
                        return cb(err);
                    } else {
                        console.log('driver data ...' + JSON.stringify(result1));
                        var reportingDate = result1[0].reporting_date.getDate() + '-' + (result1[0].reporting_date.getMonth() + 1) + '-' + result1[0].reporting_date.getFullYear();
                        var reportingTime = result1[0].reporting_time;
                        var drvName = result1[0].first_name + ' ' + result1[0].last_name;
                        var drvMobile = result1[0].mobile_number;
                        var drvMsg = 'Dear ' + drvName + ',%0aIndian Drivers received payment for Booking ID:' + bookingId + ' Dated on ' + reportingDate + ' @' + reportingTime + '. you can leave now. For queries, please reach us on 020-69400400 or info@indian-drivers.com.';
                        sendMessage(drvMobile, drvMsg);
                    }
                });
                console.log('online payment success ...' + JSON.stringify(result));
                cb(err, result);*/
            }
        });
    };

    //Remote method to get provider of email

    OtherJobsRequest.remoteMethod(
        'applyOtherJob', {
            accepts: [{
                arg: 'otherJobsId',
                type: 'string',
                required: true
            },
            {
                arg: 'otherUserId',
                type: 'string',
                required: true
            },
            {
                arg: 'userId',
                type: 'string',
                required: true
            },
            {
                arg: 'remark',
                type: 'string',
                required: false
            }
            ],
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

    
     OtherJobsRequest.checkOtherjobApplyValidations = function(otherJobsId, MobileNumber, cb) {
        // sql query
        var sql = 'select * from check_otherjob_apply_validations(' + otherJobsId +',\''+MobileNumber+'\')';
        console.log('apply job function ...' + sql);
        
        OtherJobsRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in apply job ...');
                console.log(err);
                return cb(err);
            } else {
                cb(err, result);
               /* var sql1 = 'select cu.first_name, cu.last_name, cu.mobile_number, b.reporting_date, b.reporting_time from con_users cu,driver_details cd, bookings b where cu.id = cd.conuser_id and cd.id = b.driver_id and b.id = \'' + bookingId + '\'';

                Invoices.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                    if (err) {
                        console.log('error in fetching customer data ...');
                        console.log(err);
                        return cb(err);
                    } else {
                        console.log('driver data ...' + JSON.stringify(result1));
                        var reportingDate = result1[0].reporting_date.getDate() + '-' + (result1[0].reporting_date.getMonth() + 1) + '-' + result1[0].reporting_date.getFullYear();
                        var reportingTime = result1[0].reporting_time;
                        var drvName = result1[0].first_name + ' ' + result1[0].last_name;
                        var drvMobile = result1[0].mobile_number;
                        var drvMsg = 'Dear ' + drvName + ',%0aIndian Drivers received payment for Booking ID:' + bookingId + ' Dated on ' + reportingDate + ' @' + reportingTime + '. you can leave now. For queries, please reach us on 020-69400400 or info@indian-drivers.com.';
                        sendMessage(drvMobile, drvMsg);
                    }
                });
                console.log('online payment success ...' + JSON.stringify(result));
                cb(err, result);*/
            }
        });
    };

    //Remote method to get provider of email

    OtherJobsRequest.remoteMethod(
        'checkOtherjobApplyValidations', {
            accepts: [{
                arg: 'otherJobsId',
                type: 'string',
                required: true
            },
            {
                arg: 'MobileNumber',
                type: 'string',
                required: false
            }
            ],
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
OtherJobsRequest.OtherJobRequestDataByJobId = function(jobId, cb) {
        // sql query
        var sql = 'select ojr.id, ojr.other_jobs_id, ojr.other_user_id, ojr.remark, ojr.created_by, ojr.created_date,ojr.status,ojr.created_by_name,u.first_name,u.last_name,u.mobile_number,u.address from other_jobs_request ojr, other_user ou, con_users u where ojr.other_user_id = ou.id and ou.con_user_id = u.id and ojr.other_jobs_id = ' + jobId + ' order by ojr.created_date DESC';
        console.log('apply job function ...' + sql);
        
        OtherJobsRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in apply job ...');
                console.log(err);
                return cb(err);
            } else {
                cb(err, result);
                
            }
        });
    };

    //Remote method to get provider of email

    OtherJobsRequest.remoteMethod(
        'OtherJobRequestDataByJobId', {
            accepts: [{
                arg: 'jobId',
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
