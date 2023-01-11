var consts = require('../../server/consts');
var rest = require('restler');
module.exports = function(PermanentDriverRequest) {

    PermanentDriverRequest.createPermanentDriverRequest = function(customerId, cb) {
        // sql query
        var sql = 'select * from create_permanent_driver_request(\'' + customerId + '\')';


        // call sql query from postreSQL
        PermanentDriverRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating permanent driver request ...');
                console.log(err);
                return cb(err);
            } else {
                console.log('permanent driver request result ...' + JSON.stringify(result));

                var ConUsers = PermanentDriverRequest.app.models.ConUsers;
                var mobileNumber = result[0].create_permanent_driver_request;
                var msg = 'We have received your call back request. Our monthly driver representatives will contact you shortly. For queries kindly contact 02069400400 or info@indian-drivers.com.'

                ConUsers.sendSMS(mobileNumber, msg, cb);

                //cb(err, result);
            }

        });

    };

    //Remote method to get provider of email

    PermanentDriverRequest.remoteMethod(
        'createPermanentDriverRequest', {
            accepts: [{
                arg: 'customerId',
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

    PermanentDriverRequest.createPermanentDriverRequestNew = function(customerId, createdBy, remark, cb) {
        // sql query
        var sql = 'select * from create_permanent_driver_request_new(\'' + customerId + '\', \'' + createdBy + '\', \'' + remark + '\')';


        // call sql query from postreSQL
        PermanentDriverRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating permanent driver request ...');
                console.log(err);
                return cb(err);
            } else {
                console.log('permanent driver request result ...' + JSON.stringify(result));
                if (result[0].create_permanent_driver_request_new === '0') {

                    var sql1 = 'select cu.mobile_number as mobile_number, cu.first_name as first_name, cu.last_name as last_name, cu.address_line_2 as address from con_users cu, customer_details cd where cu.id = cd.conuser_id and cd.id =  \'' + customerId + '\'';

                    PermanentDriverRequest.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                        if (err) {
                            console.log('error in fetching customer data ...');
                            console.log(err);
                            return cb(err);
                        } else {
                            console.log('customer data: ' + JSON.stringify(result1));
                            //cb(err, result);
                            var sql2 = 'SELECT CONCAT  (cus.first_name, \' \', cus.last_name) as created_by_name FROM con_users cus where cus.id = \'' + createdBy + '\'';

                            PermanentDriverRequest.app.datasources.postgres.connector.query(sql2, function(err, result2) {
                                if (err) {
                                    console.log('error in fetching customer data ...');
                                    console.log(err);
                                    return cb(err);
                                } else {
                                    console.log('createdBy data: ' + JSON.stringify(result2));

                                    //var ConUsers = PermanentDriverRequest.app.models.ConUsers;
                                    var mobileNumber = result1[0].mobile_number;
                                    var custName = result1[0].first_name + ' ' + result1[0].last_name;
                                    var address = result1[0].address;
                                    var createdByName = result2[0].created_by_name;

                                    var msg1 = 'The ' + custName + ' (' + mobileNumber + '), (' + address + ') has requested for monthly driver - ' + createdByName + '.';
                                    var numbers = '9225513111';

                                    var data = "";

                                    data += "username=msgs-driver";
                                    data += "&password=driver";
                                    data += "&type=0";
                                    data += "&dlr=1";
                                    data += "&destination=" + numbers;
                                    data += "&source=INDRIV";
                                    data += "&sender=INDRIV";
                                    data += "&message=" + msg1;

                                    var url = consts.SMS_URL + data;
                                    console.log('url = ' + url);

                                    rest.post(url)
                                        .on('complete', function(smsResponse, smsError) {
                                            console.log('Send SMS successfully to ID : ' + JSON.stringify(smsResponse));
                                            //console.log('SMS error : ' + JSON.stringify(smsError));
                                            //cb(null,smsResponse);

                                            var msg = 'Thank you Mr. ' + custName + ' for your Monthly Driver request, Our Representative will contact you shortly. %0a%0aRegards%0aTeam - Indian Drivers%0a02069400400%0ainfo@indian-drivers.com'
                                            var data = "";

                                            data += "username=msgs-driver";
                                            data += "&password=driver";
                                            data += "&type=0";
                                            data += "&dlr=1";
                                            data += "&destination=" + result1[0].mobile_number;
                                            data += "&source=INDRIV";
                                            data += "&sender=INDRIV";
                                            data += "&message=" + msg;

                                            var url1 = consts.SMS_URL + data;
                                            console.log('url1 = ' + url1);

                                            rest.post(url1)
                                                .on('complete', function(smsResponse, smsError) {
                                                    console.log('Send SMS successfully to ID : ' + JSON.stringify(smsResponse));
                                                    //console.log('SMS error : ' + JSON.stringify(smsError));
                                                    //cb(null,smsResponse);
                                                    cb(err, result);
                                                });
                                        });

                                    
                                }
                            });
                        }
                    });

                } else {
                    cb(err, result);
                }

                //ConUsers.sendSMS(numbers, msg1, cb);

                //cb(err, result);
            }

        });

    };

    //Remote method to get provider of email

    PermanentDriverRequest.remoteMethod(
        'createPermanentDriverRequestNew', {
            accepts: [{
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'createdBy',
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

     PermanentDriverRequest.createPermanentDriverRequestNewBoth = function(customerId, createdBy, remark, carType, dutyHours, salaryBudget, naturOfDuty,  weeklyOff, cb) {
        // sql query
        var sql = 'select * from create_permanent_driver_request_new_both(\'' + customerId + '\', \'' + createdBy + '\', \'' + remark + '\',\'' + carType + '\',' + dutyHours + ', \'' + salaryBudget + '\', \'' + naturOfDuty + '\', \'' + weeklyOff + '\')';

        PermanentDriverRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating permanent driver request ...');
                console.log(err);
                return cb(err);
            } else {
                if (result[0].create_permanent_driver_request_new_both === '0') {

                    var sql1 = 'select cu.mobile_number as mobile_number, cu.first_name as first_name, cu.last_name as last_name, cu.address_line_2 as address from con_users cu, customer_details cd where cu.id = cd.conuser_id and cd.id =  \'' + customerId + '\'';

                    PermanentDriverRequest.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                        if (err) {
                            console.log('error in fetching customer data ...');
                            console.log(err);
                            return cb(err);
                        } else {
                            var sql2 = 'SELECT CONCAT  (cus.first_name, \' \', cus.last_name) as created_by_name FROM con_users cus where cus.id = \'' + createdBy + '\'';

                            PermanentDriverRequest.app.datasources.postgres.connector.query(sql2, function(err, result2) {
                                if (err) {
                                    console.log('error in fetching customer data ...');
                                    console.log(err);
                                    return cb(err);
                                } else {
                                     if (createdBy === '2') {
                                              var mobileNumber = result1[0].mobile_number;
                                    var custName = result1[0].first_name + ' ' + result1[0].last_name;
                                    var address = result1[0].address;
                                    var createdByName = result2[0].created_by_name;
                                    var msg1 = 'The ' + custName + ' (' + mobileNumber + '), (' + address + ') has requested for monthly driver - ' + createdByName + '.';
                                    var numbers = '9225513111';
                                    var data = "";

                                    data += "username=msgs-driver";
                                    data += "&password=driver";
                                    data += "&type=0";
                                    data += "&dlr=1";
                                    data += "&destination=" + numbers;
                                    data += "&source=INDRIV";
                                    data += "&sender=INDRIV";
                                    data += "&message=" + msg1;

                                    var url = consts.SMS_URL + data;
                                    rest.post(url)
                                        .on('complete', function(smsResponse, smsError) {

                                            var msg = 'Thank you Mr. ' + custName + ' for your Monthly Driver request, Our Representative will contact you shortly. %0a%0aRegards%0aTeam - Indian Drivers%0a02067641000%0ainfo@indian-drivers.com.'
                                            var data = "";

                                            data += "username=msgs-driver";
                                            data += "&password=driver";
                                            data += "&type=0";
                                            data += "&dlr=1";
                                            data += "&destination=" + result1[0].mobile_number;
                                            data += "&source=INDRIV";
                                            data += "&sender=INDRIV";
                                            data += "&message=" + msg;

                                            var url1 = consts.SMS_URL + data;
                                            rest.post(url1)
                                                .on('complete', function(smsResponse, smsError) {
                                                    cb(err, result);
                                                });
                                        });      

                                            }else{
                                                var mobileNumber = result1[0].mobile_number;
                                    var custName = result1[0].first_name + ' ' + result1[0].last_name;
                                    var address = result1[0].address;
                                    var createdByName = result2[0].created_by_name;
                                    
                                               var msg = 'Thank you Mr. ' + custName + ' for your Monthly Driver request, Our Representative will contact you shortly. %0a%0aRegards%0aTeam - Indian Drivers%0a02067641000%0ainfo@indian-drivers.com.'
                                            var data = "";

                                            data += "username=msgs-driver";
                                            data += "&password=driver";
                                            data += "&type=0";
                                            data += "&dlr=1";
                                            data += "&destination=" + result1[0].mobile_number;
                                            data += "&source=INDRIV";
                                            data += "&sender=INDRIV";
                                            data += "&message=" + msg;

                                            var url1 = consts.SMS_URL + data;
                                            rest.post(url1)
                                                .on('complete', function(smsResponse, smsError) {
                                                    cb(err, result);
                                                });  
                                            }
                                    
                                }
                            });
                        }
                    });

                } else {
                    cb(err, result);
                }
            }

        });

    };

    //Remote method to get provider of email

   PermanentDriverRequest.remoteMethod(
        'createPermanentDriverRequestNewBoth', {
            accepts: [{
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'createdBy',
                type: 'string',
                required: true
            }, {
                arg: 'remark',
                type: 'string',
                required: false
            } , {
                arg: 'carType',
                type: 'string',
                required: false
            }, {
                arg: 'dutyHours',
                type: 'string',
                required: false
            }, {
                arg: 'salaryBudget',
                type: 'string',
                required: false
            }, {
                arg: 'naturOfDuty',
                type: 'string',
                required: false
            }, {
                arg: 'weeklyOff',
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
    PermanentDriverRequest.createPermanentDriver = function(customerId, createdBy, remark, carType, dutyHours, salaryBudget, naturOfDuty,  weeklyOff, operationCity, cb) {
        // sql query
        weeklyOff = weeklyOff.replace(/["']/g, "");
        var sql = 'select * from create_permanent_driver(\'' + customerId + '\', \'' + createdBy + '\', \'' + remark + '\',\'' + carType + '\',' + dutyHours + ', \'' + salaryBudget + '\', \'' + naturOfDuty + '\', \'' + weeklyOff + '\',\'' + operationCity + '\')';

        PermanentDriverRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating permanent driver request ...');
                console.log(err);
                return cb(err);
            } else {
                if (result[0].create_permanent_driver === '0') {

                    var sql1 = 'select cu.mobile_number as mobile_number, cu.first_name as first_name, cu.last_name as last_name, cu.address_line_2 as address from con_users cu, customer_details cd where cu.id = cd.conuser_id and cd.id =  \'' + customerId + '\'';

                    PermanentDriverRequest.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                        if (err) {
                            console.log('error in fetching customer data ...');
                            console.log(err);
                            return cb(err);
                        } else {
                            var sql2 = 'SELECT CONCAT  (cus.first_name, \' \', cus.last_name) as created_by_name FROM con_users cus where cus.id = \'' + createdBy + '\'';

                            PermanentDriverRequest.app.datasources.postgres.connector.query(sql2, function(err, result2) {
                                if (err) {
                                    console.log('error in fetching customer data ...');
                                    console.log(err);
                                    return cb(err);
                                } else {
                                            if (createdBy === '2') {
                                              var mobileNumber = result1[0].mobile_number;
                                    var custName = result1[0].first_name + ' ' + result1[0].last_name;
                                    var address = result1[0].address;
                                    var createdByName = result2[0].created_by_name;
                                    var msg1 = 'The ' + custName + ' (' + mobileNumber + '), (' + address + ') has requested for monthly driver - ' + createdByName + '.';
                                    var numbers = '9225513111';
                                    var data = "";

                                    data += "username=msgs-driver";
                                    data += "&password=driver";
                                    data += "&type=0";
                                    data += "&dlr=1";
                                    data += "&destination=" + numbers;
                                    data += "&source=INDRIV";
                                    data += "&sender=INDRIV";
                                    data += "&message=" + msg1;

                                    var url = consts.SMS_URL + data;
                                    rest.post(url)
                                        .on('complete', function(smsResponse, smsError) {

                                            var msg = 'Thank you Mr. ' + custName + ' for your Monthly Driver request, Our Representative will contact you shortly. %0a%0aRegards%0aTeam - Indian Drivers%0a02067641000%0ainfo@indian-drivers.com.'
                                            var data = "";

                                            data += "username=msgs-driver";
                                            data += "&password=driver";
                                            data += "&type=0";
                                            data += "&dlr=1";
                                            data += "&destination=" + result1[0].mobile_number;
                                            data += "&source=INDRIV";
                                            data += "&sender=INDRIV";
                                            data += "&message=" + msg;

                                            var url1 = consts.SMS_URL + data;
                                            rest.post(url1)
                                                .on('complete', function(smsResponse, smsError) {
                                                    cb(err, result);
                                                });
                                        });      

                                            }else{
                                                var mobileNumber = result1[0].mobile_number;
                                    var custName = result1[0].first_name + ' ' + result1[0].last_name;
                                    var address = result1[0].address;
                                    var createdByName = result2[0].created_by_name;
                                    
                                               var msg = 'Thank you Mr. ' + custName + ' for your Monthly Driver request, Our Representative will contact you shortly. %0a%0aRegards%0aTeam - Indian Drivers%0a02067641000%0ainfo@indian-drivers.com.'
                                            var data = "";

                                            data += "username=msgs-driver";
                                            data += "&password=driver";
                                            data += "&type=0";
                                            data += "&dlr=1";
                                            data += "&destination=" + result1[0].mobile_number;
                                            data += "&source=INDRIV";
                                            data += "&sender=INDRIV";
                                            data += "&message=" + msg;

                                            var url1 = consts.SMS_URL + data;
                                            rest.post(url1)
                                                .on('complete', function(smsResponse, smsError) {
                                                    cb(err, result);
                                                });  
                                            }
                                   

                                    
                                }
                            });
                        }
                    });

                } else {
                    cb(err, result);
                }
            }

        });

    };

    //Remote method to get provider of email

   PermanentDriverRequest.remoteMethod(
        'createPermanentDriver', {
            accepts: [{
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'createdBy',
                type: 'string',
                required: true
            }, {
                arg: 'remark',
                type: 'string',
                required: false
            } , {
                arg: 'carType',
                type: 'string',
                required: false
            }, {
                arg: 'dutyHours',
                type: 'string',
                required: false
            }, {
                arg: 'salaryBudget',
                type: 'string',
                required: false
            }, {
                arg: 'naturOfDuty',
                type: 'string',
                required: false
            }, {
                arg: 'weeklyOff',
                type: 'string',
                required: false
            }, {
                arg: 'operationCity',
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


 PermanentDriverRequest.createPermanentDriverForAdmin = function(customerId, createdBy, remark, carType, dutyHours, salaryBudget, naturOfDuty,  weeklyOff, operationCity,nextFollowUpDate, cb) {
        // sql query
        var sql = 'select * from create_permanent_driver_for_admin(\'' + customerId + '\', \'' + createdBy + '\', \'' + remark + '\',\'' + carType + '\',' + dutyHours + ', \'' + salaryBudget + '\', \'' + naturOfDuty + '\', \'' + weeklyOff + '\',\'' + operationCity + '\',\'' +nextFollowUpDate+ '\')';

        PermanentDriverRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating permanent driver request ...');
                console.log(err);
                return cb(err);
            } else {
                if (result[0].create_permanent_driver === '0') {

                    var sql1 = 'select cu.mobile_number as mobile_number, cu.first_name as first_name, cu.last_name as last_name, cu.address_line_2 as address from con_users cu, customer_details cd where cu.id = cd.conuser_id and cd.id =  \'' + customerId + '\'';

                    PermanentDriverRequest.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                        if (err) {
                            console.log('error in fetching customer data ...');
                            console.log(err);
                            return cb(err);
                        } else {
                            var sql2 = 'SELECT CONCAT  (cus.first_name, \' \', cus.last_name) as created_by_name FROM con_users cus where cus.id = \'' + createdBy + '\'';

                            PermanentDriverRequest.app.datasources.postgres.connector.query(sql2, function(err, result2) {
                                if (err) {
                                    console.log('error in fetching customer data ...');
                                    console.log(err);
                                    return cb(err);
                                } else {
                                            if (createdBy === '2') {
                                              var mobileNumber = result1[0].mobile_number;
                                    var custName = result1[0].first_name + ' ' + result1[0].last_name;
                                    var address = result1[0].address;
                                    var createdByName = result2[0].created_by_name;
                                    var msg1 = 'The ' + custName + ' (' + mobileNumber + '), (' + address + ') has requested for monthly driver - ' + createdByName + '.';
                                    var numbers = '9225513111';
                                    var data = "";

                                    data += "username=msgs-driver";
                                    data += "&password=driver";
                                    data += "&type=0";
                                    data += "&dlr=1";
                                    data += "&destination=" + numbers;
                                    data += "&source=INDRIV";
                                    data += "&sender=INDRIV";
                                    data += "&message=" + msg1;

                                    var url = consts.SMS_URL + data;
                                    rest.post(url)
                                        .on('complete', function(smsResponse, smsError) {

                                            var msg = 'Thank you Mr. ' + custName + ' for your Monthly Driver request, Our Representative will contact you shortly. %0a%0aRegards%0aTeam - Indian Drivers%0a02067641000%0ainfo@indian-drivers.com.'
                                            var data = "";

                                            data += "username=msgs-driver";
                                            data += "&password=driver";
                                            data += "&type=0";
                                            data += "&dlr=1";
                                            data += "&destination=" + result1[0].mobile_number;
                                            data += "&source=INDRIV";
                                            data += "&sender=INDRIV";
                                            data += "&message=" + msg;

                                            var url1 = consts.SMS_URL + data;
                                            rest.post(url1)
                                                .on('complete', function(smsResponse, smsError) {
                                                    cb(err, result);
                                                });
                                        });      

                                            }else{
                                                var mobileNumber = result1[0].mobile_number;
                                    var custName = result1[0].first_name + ' ' + result1[0].last_name;
                                    var address = result1[0].address;
                                    var createdByName = result2[0].created_by_name;
                                    
                                               var msg = 'Thank you Mr. ' + custName + ' for your Monthly Driver request, Our Representative will contact you shortly. %0a%0aRegards%0aTeam - Indian Drivers%0a02067641000%0ainfo@indian-drivers.com.'
                                            var data = "";

                                            data += "username=msgs-driver";
                                            data += "&password=driver";
                                            data += "&type=0";
                                            data += "&dlr=1";
                                            data += "&destination=" + result1[0].mobile_number;
                                            data += "&source=INDRIV";
                                            data += "&sender=INDRIV";
                                            data += "&message=" + msg;

                                            var url1 = consts.SMS_URL + data;
                                            rest.post(url1)
                                                .on('complete', function(smsResponse, smsError) {
                                                    cb(err, result);
                                                });  
                                            }
                                   

                                    
                                }
                            });
                        }
                    });

                } else {
                    cb(err, result);
                }
            }

        });

    };

    //Remote method to get provider of email

   PermanentDriverRequest.remoteMethod(
        'createPermanentDriverForAdmin', {
            accepts: [{
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'createdBy',
                type: 'string',
                required: true
            }, {
                arg: 'remark',
                type: 'string',
                required: false
            } , {
                arg: 'carType',
                type: 'string',
                required: false
            }, {
                arg: 'dutyHours',
                type: 'string',
                required: false
            }, {
                arg: 'salaryBudget',
                type: 'string',
                required: false
            }, {
                arg: 'naturOfDuty',
                type: 'string',
                required: false
            }, {
                arg: 'weeklyOff',
                type: 'string',
                required: false
            }, {
                arg: 'operationCity',
                type: 'string',
                required: false
            },
             {
                arg: 'nextFollowUpDate',
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


    PermanentDriverRequest.searchMonthlyDrivers=function(from_date, to_date, status, operationCity,cb){

// sql query - 1st by normal
console.log(from_date);
console.log(to_date);
console.log(status);
console.log(operationCity);

if (operationCity === 'All') {
     if ((from_date !== 'nil') && (to_date !== 'nil') && (status === 'nil'))
        {
            console.log('Query5 Sucess...');
           var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date, pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and pdr.created_date >= (TIMESTAMP  \'' + from_date + '\') and pdr.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval)';
        }
         else if ((status !== 'nil') && (from_date !== 'nil') && (to_date !== 'nil'))
         {
            console.log('Query6 Sucess...');
                if(status !== 'All'){
               var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date, pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status, pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and pdr.status = \'' + status + '\' and  pdr.created_date >= (TIMESTAMP  \'' + from_date + '\') and pdr.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval)'; 
                }
                else{
                var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date, pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and  pdr.created_date >= (TIMESTAMP  \'' + from_date + '\') and pdr.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval)'; 
                }
        }
         else if((status !=='nil') && (from_date === 'nil') && (to_date === 'nil'))
        {console.log('Query7 Sucess...');
             if(status === 'All'){
                var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date,pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id';
             }else{
               var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date,pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and pdr.status = \'' + status + '\''; 
              }
        } 


 }
 else {
       
        if ((from_date !== 'nil') && (to_date !== 'nil') && (status === 'nil'))
        {
            console.log('Query5 Sucess...');
           var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date,pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and pdr.created_date >= (TIMESTAMP  \'' + from_date + '\') and pdr.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) and cu.operation_city =\''+ operationCity +'\'';
        }
         else if ((status !== 'nil') && (from_date !== 'nil') && (to_date !== 'nil'))
         {
            console.log('Query6 Sucess...');
                if(status !== 'All'){
               var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date,pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and pdr.status = \'' + status + '\' and  pdr.created_date >= (TIMESTAMP  \'' + from_date + '\') and pdr.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) and cu.operation_city =\''+ operationCity +'\''; 
                }
                else{
                var sql='select cu.id as conuser_id, pdr.id , pdr.next_follow_up_date,pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and  pdr.created_date >= (TIMESTAMP  \'' + from_date + '\') and pdr.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) and cu.operation_city =\''+ operationCity +'\''; 
                }
        }
         else if((status !=='nil') && (from_date === 'nil') && (to_date === 'nil'))
        {console.log('Query7 Sucess...');
             if(status === 'All'){
                var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date,pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and cu.operation_city =\''+ operationCity +'\'';
             }else{
               var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date,pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and pdr.status = \'' + status + '\' and cu.operation_city =\''+ operationCity +'\''; 
              }
        }
    }
   PermanentDriverRequest.app.datasources.postgres.connector.query(sql, function(err, result) {

      if (err) {

        console.log('Error getting driver transaction ...');

        console.log(err);

        return cb(err);

      }

      cb(err, result);

  });

 };

  
  
  //Remote method to get provider of email

 PermanentDriverRequest.remoteMethod(

    'searchMonthlyDrivers', {

      accepts: [{

        arg: 'from_date',

        type: 'string',

        required: false

      }, {

        arg: 'to_date',

        type: 'string',

        required: false

      }, {

        arg: 'status',

        type: 'string',

        required: false

      },{

        arg: 'operationCity',

        type: 'string',

        required: false

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
  PermanentDriverRequest.searchMonthlyDriversNFD=function(from_date, to_date, operationCity,cb){

    // sql query - 1st by normal
    console.log(from_date);
    console.log(to_date);
    console.log(operationCity);
    
    if (operationCity === 'All') {
         if ((from_date !== 'nil') && (to_date !== 'nil'))
            {
                console.log('Query5 Sucess...');
               var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date, pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and pdr.next_follow_up_date >= (TIMESTAMP  \'' + from_date + '\') and pdr.next_follow_up_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval)';
            }
                      
     }
     else {
           
            if ((from_date !== 'nil') && (to_date !== 'nil'))
            {
                console.log('Query5 Sucess...');
               var sql='select cu.id as conuser_id, pdr.id, pdr.next_follow_up_date,pdr.created_date, cd.id as customer_id, first_name, middle_name,last_name,email,mobile_number,address,address_line_2,pdr.status,pdr.remark,pdr.created_by,created_by_name,car_type,duty_hours,weekly_off,salary_budget ,nature_of_duty from con_users as cu,customer_details as cd,permanent_driver_request as pdr where cu.id=cd.conuser_id and cd.id =pdr.customer_id and pdr.next_follow_up_date >= (TIMESTAMP  \'' + from_date + '\') and pdr.next_follow_up_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) and cu.operation_city =\''+ operationCity +'\'';
            }  
        }
       PermanentDriverRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
    
          if (err) {
    
            console.log('Error getting driver transaction ...');
    
            console.log(err);
    
            return cb(err);
    
          }
    
          cb(err, result);
    
      });
    
     };
    
      
      
      //Remote method to get provider of email
    
     PermanentDriverRequest.remoteMethod(
    
        'searchMonthlyDriversNFD', {
    
          accepts: [{
    
            arg: 'from_date',
    
            type: 'string',
    
            required: false
    
          }, {
    
            arg: 'to_date',
    
            type: 'string',
    
            required: false
    
          }, {
    
            arg: 'operationCity',
    
            type: 'string',
    
            required: false
    
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
    


     PermanentDriverRequest.getPermanentDriverRequest = function(operationCity, cb) {
        // sql quer
        if(operationCity === 'All'){
         var sql = 'SELECT id, customer_id, (select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') from con_users, customer_details where customer_details.id = permanent_driver_request.customer_id and customer_details.conuser_id = con_users.id limit 1) as customer_name, status, created_by_name, remark, (select concat(address || \' \' || address_line_2) from con_users where id = permanent_driver_request.customer_id limit 1) as address, created_date, car_type, duty_hours, weekly_off, salary_budget, nature_of_duty FROM permanent_driver_request WHERE  created_date >= current_date - interval \'3 days\' order by created_date DESC';   
     }else{
        var sql = 'SELECT permanent_driver_request.id, permanent_driver_request.customer_id, ((select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') from con_users, customer_details where customer_details.id = permanent_driver_request.customer_id and customer_details.conuser_id = con_users.id limit 1) as customer_name, permanent_driver_request.status, created_by_name, remark, (select concat(address || \' \' || address_line_2) from con_users where id = permanent_driver_request.customer_id limit 1) as address, permanent_driver_request.created_date, car_type, duty_hours, weekly_off, salary_budget, nature_of_duty FROM permanent_driver_request, con_users, customer_details WHERE  permanent_driver_request.customer_id = customer_details.id and customer_details.conuser_id = con_users.id and permanent_driver_request.created_date >= current_date - interval \'3 days\' and con_users.operation_city = \'operationCity\' order by created_date DESC';
     }
         

        // call sql query from postreSQL
        PermanentDriverRequest.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    PermanentDriverRequest.remoteMethod(
        'getPermanentDriverRequest', {
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
