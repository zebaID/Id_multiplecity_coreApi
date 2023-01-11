module.exports = function(DriverJobDetails) {

 DriverJobDetails.createNewJob = function(customerId, area, carType, dutyHours, dutyType, createdBy, clientId, weeklyOff, dutyTime, outstationDays, driverAge, drivingExp, carName, clientSalary, driverSalary, role, other,location, cb) {
        if(weeklyOff == '' || weeklyOff == undefined){
            weeklyOff = null;
        }
        if(other == '' || other == undefined){
            other = null;
        }
        // sql query
        var sql = 'select * from create_new_job(' + customerId + ', \'' + area + '\', \'' + carType + '\', ' + dutyHours + ', \'' + dutyType + '\', ' + createdBy + ', '+ clientId +', \'' + weeklyOff + '\', \'' + dutyTime + '\', \''+ outstationDays +'\', \''+ driverAge +'\', \'' + drivingExp + '\', \'' + carName + '\', \'' + clientSalary + '\', \'' + driverSalary + '\', \'' + role + '\', \'' + other + '\', \'' + location + '\')';


        // call sql query from postreSQL
        DriverJobDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating new job ...');
                console.log(err);
                return cb(err);
            } else {
                cb(err, result);
            }

        });

    };

    //Remote method to get provider of email

    DriverJobDetails.remoteMethod(
        'createNewJob', {
            accepts: [{
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'area',
                type: 'string',
                required: true
            }, {
                arg: 'carType',
                type: 'string',
                required: true
            }, {
                arg: 'dutyHours',
                type: 'string',
                required: true
            }, {
                arg: 'dutyType',
                type: 'string',
                required: true
            }, {
                arg: 'createdBy',
                type: 'string',
                required: true
            },{
                arg: 'clientId',
                type: 'string',
                required: true
            },{
                arg: 'weeklyOff',
                type: 'string',
                required: false
            },{
                arg: 'dutyTime',
                type: 'string',
                required: true
            },{
                arg: 'outstationDays',
                type: 'string',
                required: true
            },{
                arg: 'driverAge',
                type: 'string',
                required: true
            },{
                arg: 'drivingExp',
                type: 'string',
                required: true
            },{
                arg: 'carName',
                type: 'string',
                required: true
            },{
                arg: 'clientSalary',
                type: 'string',
                required: true
            },{
                arg: 'driverSalary',
                type: 'string',
                required: true
            },{
                arg: 'role',
                type: 'string',
                required: true
            },{
                arg: 'other',
                type: 'string',
                required: false
            },
            {
               arg: 'location',
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

    DriverJobDetails.getDriverJobReport = function(fromDate, ToDate, operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and d.created_date >= (TIMESTAMP \'' + fromDate + '\') and d.created_date < (TIMESTAMP  \'' + ToDate + '\' ::date + \'1 day\'::interval) order by d.created_date DESC';
    } else {
      var sql = 'select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and d.created_date >= (TIMESTAMP \'' + fromDate + '\') and d.created_date < (TIMESTAMP  \'' + ToDate + '\' ::date + \'1 day\'::interval) and d.location = \'' + operationCity + '\' order by d.created_date DESC';
    }

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverJobDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverJobDetails.remoteMethod(
    'getDriverJobReport', {
      accepts: [{
          arg: 'fromDate',
          type: 'string',
          required: true
        },
        {
          arg: 'ToDate',
          type: 'string',
          required: true
        },
        {
          arg: 'operationCity',
          type: 'string',
          required: true
        }
      ],
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


DriverJobDetails.getDriverJobOpenReport = function(operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.first_name, u.last_name, u.mobile_number, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and d.status=\'Open\' order by d.created_date DESC';
    } else {
      var sql = 'select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.first_name, u.last_name, u.mobile_number, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and d.status=\'Open\' and d.location= \'' + operationCity + '\' order by d.created_date DESC';
    }

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverJobDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverJobDetails.remoteMethod(
    'getDriverJobOpenReport', {
      accepts: [{
          arg: 'operationCity',
          type: 'string',
          required: true
        }
      ],
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
 

  //Remote method to get provider of email

   
DriverJobDetails.getDriverJobOnArea = function(Area, operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and  d.area ilike \'%\' || \'' + Area + '\' || \'%\' order by d.created_date DESC';
    } else {
      var sql = 'select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and  d.area ilike \'%\' || \'' + Area + '\' || \'%\' and d.location = \'' + operationCity + '\' order by d.created_date DESC';
    }

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverJobDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverJobDetails.remoteMethod(
    'getDriverJobOnArea', {
      accepts: [{
          arg: 'Area',
          type: 'string',
          required: true
        },{
          arg: 'operationCity',
          type: 'string',
          required: true
        }
      ],
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
 DriverJobDetails.getCustomerJob = function(operationCity, cb) {
    // sql query
     var sql = 'select * from get_customers_job(\'' + operationCity + '\')';

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverJobDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverJobDetails.remoteMethod(
    'getCustomerJob', {
      accepts: [{
          arg: 'operationCity',
          type: 'string',
          required: true
        }
      ],
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
  DriverJobDetails.getDriverJobReportByOepenedDate = function(from_date, to_date, operationCity, cb) {
    // sql query
    // if (operationCity === 'All') {
    //   var sql = 'select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.first_name, u.last_name, u.mobile_number, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and d.opened_date >= (TIMESTAMP  \'' + from_date + '\') and d.opened_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) order by d.created_date DESC';
    // } else {
    //   var sql = 'select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.first_name, u.last_name, u.mobile_number, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and d.location= \'' + operationCity + '\' and d.opened_date >= (TIMESTAMP  \'' + from_date + '\') and d.opened_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) order by d.created_date DESC';
    // }
    if (operationCity === 'All'){
      var sql='select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.first_name, u.last_name, u.mobile_number, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and d.opened_date >= \'' + from_date + '\'::date and d.opened_date <= \'' + to_date + '\'::date + 1 order by d.created_date DESC';
    }else{
      var sql='select d.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.first_name, u.last_name, u.mobile_number, u.email, d.client_id, d.status, d.area, d.car_type,d.duty_hours,d.duty_type, d.created_date, d.created_by, d.created_by_name, d.weekly_off, d.duty_time, d.outstation_days, d.driver_age, d.driving_experience, d.vehicle_name, d.client_salary, d. driver_salary,d.role,d.other,d.location from driver_job_details d, customer_details c, con_users u where u.id=c.conuser_id and c.id=d.customer_id and d.location= \'' + operationCity + '\' and d.opened_date >= \'' + from_date + '\'::date and d.opened_date <= \'' + to_date + '\'::date + 1 order by d.created_date DESC';
    }
   
    

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverJobDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverJobDetails.remoteMethod(
    'getDriverJobReportByOepenedDate', {
      accepts: [{
    
        arg: 'from_date',

        type: 'string',

        required: false

      }, {

        arg: 'to_date',

        type: 'string',

        required: false

      },{
          arg: 'operationCity',
          type: 'string',
          required: true
        }
      ],
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
