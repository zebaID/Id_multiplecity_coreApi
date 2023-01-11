module.exports = function(DriverDetails) {
DriverDetails.getDrivers = function(operationCity, cb) {
    // sql query
    var sql = 'select * from get_drivers(\'' + operationCity + '\')';

    // call sql query from postreSQL
    DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver list to allocate duty ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  DriverDetails.remoteMethod(
    'getDrivers', {
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

   DriverDetails.getDriverDetail = function(address, status, operationCity, cb) {
        // sql query
       // var sql = 'select * from get_driver_details(\''+address+'\', \''+status+'\', \''+operationCity+'\')';
        if(operationCity === 'All'){
          if(status === 'All'){
            var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id, driver_details.driver_status  from con_users, driver_details, driver_account where con_users.id = driver_details.conuser_id and driver_details.id = driver_account.driver_id and con_users.address ilike \'%\' || \''+address+'\' || \'%\' group by driver_details.id,con_users.id, driver_account.balance';
          }else{
            var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name ,mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id, driver_details.driver_status from con_users, driver_details, driver_account where con_users.id = driver_details.conuser_id and driver_details.id = driver_account.driver_id and con_users.address ilike \'%\' || \''+address+'\' || \'%\' and status = \''+status+'\' group by driver_details.id,con_users.id, driver_account.balance';
          }
        }else{
          if(status === 'All'){
            var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name, mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id, driver_details.driver_status from con_users, driver_details, driver_account where con_users.id = driver_details.conuser_id and driver_details.id = driver_account.driver_id and con_users.address ilike \'%\' || \''+address+'\' || \'%\' and operation_city = \''+operationCity+'\' group by driver_details.id,con_users.id, driver_account.balance';
          }else{
            var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id, driver_details.driver_status from con_users, driver_details, driver_account where con_users.id = driver_details.conuser_id and driver_details.id = driver_account.driver_id and con_users.address ilike \'%\' || \''+address+'\' || \'%\' and status = \''+status+'\' and operation_city = \''+operationCity+'\' group by driver_details.id,con_users.id, driver_account.balance';
          }
        }
        // call sql query from postreSQL
        DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver details ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    DriverDetails.remoteMethod(
        'getDriverDetail', {
            accepts: [{
                arg: 'address',
                type: 'string',
                required: true
            },{
                arg: 'status',
                type: 'string',
                required: true
            },{
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
 DriverDetails.getPvExpiryDrivers = function(fromDate, ToDate, operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id from con_users right join driver_details on con_users.id = driver_details.conuser_id left join driver_account on driver_details.id = driver_account.driver_id where driver_details.pv_expiry_date >= \'' + fromDate + '\' and driver_details.pv_expiry_date <= \'' + ToDate + '\' group by driver_details.id,con_users.id, driver_account.balance';
    } else {
      var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id from con_users right join driver_details on con_users.id=driver_details.conuser_id left join driver_account on driver_details.id=driver_account.driver_id where driver_details.pv_expiry_date >= \'' + fromDate + '\' and driver_details.pv_expiry_date <= \'' + ToDate + '\' and con_users.operation_city = \'' + operationCity + '\' group by driver_details.id,con_users.id, driver_account.balance';
    }

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverDetails.remoteMethod(
    'getPvExpiryDrivers', {
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

   

 DriverDetails.getDLExpiryDrivers = function(fromDate, ToDate, operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id from con_users right join driver_details on con_users.id=driver_details.conuser_id left join driver_account on driver_details.id=driver_account.driver_id where driver_details.license_date >= \'' + fromDate + '\' and driver_details.license_date <= \'' + ToDate + '\' group by driver_details.id,con_users.id, driver_account.balance';
    } else {
      var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id from con_users right join driver_details on con_users.id=driver_details.conuser_id left join driver_account on driver_details.id=driver_account.driver_id where driver_details.license_date >= \'' + fromDate + '\' and driver_details.license_date <= \'' + ToDate + '\' and con_users.operation_city = \'' + operationCity + '\' group by driver_details.id,con_users.id, driver_account.balance';
    }
    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });
  };
  //Remote method to get provider of email
  DriverDetails.remoteMethod(
    'getDLExpiryDrivers', {
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

  DriverDetails.getOtherCityDrivers = function(fromDate, ToDate, operationCity, cb) {
    // sql query
     var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id, status, con_users.created_date from con_users right join driver_details on con_users.id=driver_details.conuser_id left join driver_account on driver_details.id=driver_account.driver_id where driver_details.created_date >= (TIMESTAMP \'' + fromDate + '\') and driver_details.created_date < (TIMESTAMP  \'' + ToDate + '\' ::date + \'1 day\'::interval) and con_users.operation_city = \'' + operationCity + '\' group by driver_details.id,con_users.id, driver_account.balance';

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverDetails.remoteMethod(
    'getOtherCityDrivers', {
      accepts: [{
          arg: 'fromDate',
          type: 'string',
          required: true
        },{
          arg: 'ToDate',
          type: 'string',
          required: true
        },{
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

   DriverDetails.getOtherCityDriversVehicle = function(fromDate, ToDate, operationCity, vehicle, cb) {
    // sql query
     var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id, status, con_users.created_date from con_users right join driver_details on con_users.id=driver_details.conuser_id left join driver_account on driver_details.id=driver_account.driver_id where driver_details.created_date >= (TIMESTAMP \'' + fromDate + '\') and driver_details.created_date < (TIMESTAMP  \'' + ToDate + '\' ::date + \'1 day\'::interval) and con_users.operation_city = \'' + operationCity + '\' and driver_details.vehicle = \'' + vehicle + '\' group by driver_details.id,con_users.id, driver_account.balance';

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverDetails.remoteMethod(
    'getOtherCityDriversVehicle', {
      accepts: [{
          arg: 'fromDate',
          type: 'string',
          required: true
        },{
          arg: 'ToDate',
          type: 'string',
          required: true
        },{
          arg: 'operationCity',
          type: 'string',
          required: true
        },{
          arg: 'vehicle',
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

   DriverDetails.getOtherCityDriversLocation = function(fromDate, ToDate, operationCity, location, cb) {
    // sql query
     var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id, status, con_users.created_date from con_users right join driver_details on con_users.id=driver_details.conuser_id left join driver_account on driver_details.id=driver_account.driver_id where driver_details.created_date >= (TIMESTAMP \'' + fromDate + '\') and driver_details.created_date < (TIMESTAMP  \'' + ToDate + '\' ::date + \'1 day\'::interval) and con_users.operation_city = \'' + operationCity + '\' and con_users.address ilike \'%\' || \'' + location + '\' || \'%\' group by driver_details.id,con_users.id, driver_account.balance';

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverDetails.remoteMethod(
    'getOtherCityDriversLocation', {
      accepts: [{
          arg: 'fromDate',
          type: 'string',
          required: true
        },{
          arg: 'ToDate',
          type: 'string',
          required: true
        },{
          arg: 'operationCity',
          type: 'string',
          required: true
        },{
          arg: 'location',
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
   DriverDetails.getOtherCityDriversVehivleLocation = function(fromDate, ToDate, operationCity, vehicle, location, cb) {
    // sql query
     var sql = 'select concat(first_name || \' \' || last_name || \'(\' || mobile_number || \')\') as name , mobile_number as contact_no, address, coalesce(driver_account.balance, 0) as balance, tr_date , nt_date, is_luxury, driver_details.id as id, status, con_users.created_date from con_users right join driver_details on con_users.id=driver_details.conuser_id left join driver_account on driver_details.id=driver_account.driver_id where driver_details.created_date >= (TIMESTAMP \'' + fromDate + '\') and driver_details.created_date < (TIMESTAMP  \'' + ToDate + '\' ::date + \'1 day\'::interval) and con_users.operation_city = \'' + operationCity + '\' and driver_details.vehicle = \'' + vehicle + '\' and con_users.address ilike \'%\' || \'' + location + '\' || \'%\' group by driver_details.id,con_users.id, driver_account.balance';

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverDetails.remoteMethod(
    'getOtherCityDriversVehivleLocation', {
      accepts: [{
          arg: 'fromDate',
          type: 'string',
          required: true
        },{
          arg: 'ToDate',
          type: 'string',
          required: true
        },{
          arg: 'operationCity',
          type: 'string',
          required: true
        },{
          arg: 'vehicle',
          type: 'string',
          required: true
        },{
          arg: 'location',
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

DriverDetails.getDriverCarDetails = function(driverId, cb) {
    // sql query
     
     var sql='select  car_registration_no,car_name from driver_details,con_users,car_owner,car_details where driver_details.id = (\'' + driverId + '\') and con_users.id = driver_details.conuser_id and con_users.id = car_owner.con_user_id and car_owner.car_detail_id = car_details.id';  


     
    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverDetails.remoteMethod(
    'getDriverCarDetails', {
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
        verb: 'get'
      }
    }
  );


};
