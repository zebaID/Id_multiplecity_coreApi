module.exports = function(DriverJobRequest) {
DriverJobRequest.applyDriverJob = function(jobId, driverId, userId, remark, cb) {
        // sql query
        var sql = 'select * from apply_driver_job(' + jobId + ' ,' + driverId + ',' + userId +',\''+remark+'\')';
        console.log('apply job function ...' + sql);
        
        DriverJobRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
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

    DriverJobRequest.remoteMethod(
        'applyDriverJob', {
            accepts: [{
                arg: 'jobId',
                type: 'string',
                required: true
            },
            {
                arg: 'driverId',
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

    DriverJobRequest.DriverJobStatus = function(driverId, cb) {
        // sql query
        var sql = 'select count(*) from driver_job_request where driver_id ='+ driverId + ' and status = \'Appointed\'';

       //var sql = 'select(0)';
        console.log('apply job function ...' + sql);
        
        DriverJobRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
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

    DriverJobRequest.remoteMethod(
        'DriverJobStatus', {
            accepts: [{
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
                verb: 'post'
            }
        }
    );
    DriverJobRequest.DriverJobRequestCheck = function(driverId, jobId, status, cb) {
        // sql query
        var sql = 'select * from check_driver_job_request_status(\'' + driverId + '\', \'' + jobId + '\', \'' + status + '\')';
        console.log('apply job function ...' + sql);
        
        DriverJobRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
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

    DriverJobRequest.remoteMethod(
        'DriverJobRequestCheck', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            },{
                arg: 'jobId',
                type: 'string',
                required: true
            },{
                arg: 'status',
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

     DriverJobRequest.DriverJobRequestDataByJobId = function(jobId, cb) {
        // sql query
        var sql = 'select djr.id, djr.driver_job_id, djr.driver_id, djr.remark, djr.created_by, djr.created_date, djr.created_by_name ,djr.status, dd.license_date, dd.bdate, u.first_name,u.last_name,u.mobile_number,u.address from driver_job_request djr, driver_details dd, con_users u where djr.driver_id = dd.id and dd.conuser_id = u.id and djr.driver_job_id = ' + jobId + ' order by djr.created_date DESC';
        console.log('apply job function ...' + sql);
        
        DriverJobRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
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

    DriverJobRequest.remoteMethod(
        'DriverJobRequestDataByJobId', {
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
