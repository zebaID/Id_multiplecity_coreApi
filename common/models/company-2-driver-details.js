'use strict';

module.exports = function(Company2DriverDetails) {
 Company2DriverDetails.assignDirector = function(company2CustomerId,customerId, cb) {
    // sql query
     
     var sql='insert into company2_driver_details (company2_customer_id,customer_id) values(\'' + company2CustomerId + '\',\'' + customerId + '\')' ;  


     
    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };
  //Remote method to get provider of email

  Company2DriverDetails.remoteMethod(
    'assignDirector', {
      accepts: [{
          arg: 'company2CustomerId',
          type: 'string',
          required: true
        },
        {
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
        verb: 'get'
      }
    }
  );


Company2DriverDetails.assignDriverToBillingCustomer = function(customerId,driverId,driverCycle,dutyHours,createdBy,reportingDate, cb) {
    // sql query
    var sql = 'select * from assign_driver_to_billing_customer(\'' + customerId + '\',\'' + driverId + '\',\'' + driverCycle + '\',\'' + dutyHours + '\',\'' + createdBy + '\',\'' + reportingDate + '\')';

    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2DriverDetails.remoteMethod(
    'assignDriverToBillingCustomer', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true
      },{
        arg: 'driverId',
        type: 'string',
        required: true
      },{
        arg: 'driverCycle',
        type: 'string',
        required: true
      },{
        arg: 'dutyHours',
        type: 'string',
        required: true
      },{
        arg: 'createdBy',
        type: 'string',
        required: true
      },{
        arg: 'reportingDate',
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


   Company2DriverDetails.getAppointedDriverDetails = function(company2CustomerId, cb) {
    // sql query
     
     var sql='select dd.id as id,CONCAT(cu.first_name || \'\' ||cu.last_name) as driver_name from con_users cu ,driver_details dd ,company2_driver_details cd where dd.id= cd.driver_id and dd.conuser_id = cu.id  and cd.company2_customer_id = \'' + company2CustomerId + '\'';  


     
    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  Company2DriverDetails.remoteMethod(
    'getAppointedDriverDetails', {
      accepts: [{
          arg: 'company2CustomerId',
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

    Company2DriverDetails.getAppointedCustomerDetails = function(driverId, cb) {
    // sql query
   

     var sql='select CONCAT(cu.first_name || \'\' ||cu.last_name) as customer_name,ad.description as description,ad.doj,ad.dol,ad.left_reasons,ad.status as status from appointed_driver_historical_data ad,company2_customer_details cc,con_users cu where ad.driver_id = \'' + driverId + '\' and  ad.company2_customer_id = cc.id and cc.conuser_id = cu.id';

     
    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  Company2DriverDetails.remoteMethod(
    'getAppointedCustomerDetails', {
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

   Company2DriverDetails.validateAppointedDriver = function(driverId, cb) {
    // sql query
    var sql = 'select * from validate_appointed_driver(\'' + driverId + '\')';

    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2DriverDetails.remoteMethod(
    'validateAppointedDriver', {
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

Company2DriverDetails.updateAppointDriverDetails = function(customerId,driverId,dutyHours,weeklyOff,otRate,nsaRate,edRate,monthlySalary,driverCycle,reportingDate,osaRate,updatedBy , cb) {
    // sql query

    var sql = 'select * from update_appoint_driver_deatils(\'' + customerId + '\',\'' + driverId + '\',\'' + dutyHours + '\',\'' + weeklyOff + '\',\'' + otRate + '\',\'' + nsaRate + '\',\'' + edRate + '\',\'' + monthlySalary + '\',\'' + driverCycle + '\',\'' + reportingDate + '\',\'' + osaRate + '\',\'' + updatedBy + '\' )';
console.log(sql);
    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2DriverDetails.remoteMethod(
    'updateAppointDriverDetails', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true
      },{
        arg: 'driverId',
        type: 'string',
        required: true
      },{
        arg: 'dutyHours',
        type: 'string',
        required: true
      },{
        arg: 'weeklyOff',
        type: 'string',
        required: true
      },{
        arg: 'otRate',
        type: 'string',
        required: true
      },{
        arg: 'nsaRate',
        type: 'string',
        required: true
      },{
        arg: 'edRate',
        type: 'string',
        required: true
      },{
        arg: 'monthlySalary',
        type: 'string',
        required: true
      },{
        arg: 'driverCycle',
        type: 'string',
        required: true
      },{
        arg: 'reportingDate',
        type: 'string',
        required: true
      },{
        arg: 'osaRate',
        type: 'string',
        required: true
      },{
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
        verb: 'get'
      }
    }
  );

  Company2DriverDetails.getBillingDriverHistoryDetails = function(company2CustomerId, cb) {
    // sql query
     
       
     var sql ='select add.driver_id as driverId,CONCAT(cu.first_name || \'\' ||cu.last_name) as driver_name ,add.left_reasons,add.doj,add.dol,add.status,add.description from driver_details dd,con_users cu,appointed_driver_historical_data add where dd.id = add.driver_id and dd.conuser_id = cu.id and add.company2_customer_id = \'' + company2CustomerId + '\''; 

     
    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  Company2DriverDetails.remoteMethod(
    'getBillingDriverHistoryDetails', {
      accepts: [{
          arg: 'company2CustomerId',
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

  Company2DriverDetails.removeAppointDriver = function(customerId,driverId,dol,reason,updatedBy , cb) {
    // sql query
    var sql = 'select * from remove_driver_to_billing_customer2(\'' + customerId + '\',\'' + driverId + '\',\'' + dol + '\',\'' + reason + '\',\'' + updatedBy + '\')';

    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2DriverDetails.remoteMethod(
    'removeAppointDriver', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true
      },{
        arg: 'driverId',
        type: 'string',
        required: true
      },{
        arg: 'dol',
        type: 'string',
        required: true
      },{
        arg: 'reason',
        type: 'string',
        required: true
      },{
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
        verb: 'get'
      }
    }
  );
Company2DriverDetails.removeDriver = function(customerId,driverId,dol,reason,updatedBy , cb) {
    // sql query
    var sql = 'select * from remove_driver_from_billing(\'' + customerId + '\',\'' + driverId + '\',\'' + dol + '\',\'' + reason + '\',\'' + updatedBy + '\')';

    // call sql query from postreSQL
    Company2DriverDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2DriverDetails.remoteMethod(
    'removeDriver', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true
      },{
        arg: 'driverId',
        type: 'string',
        required: true
      },{
        arg: 'dol',
        type: 'string',
        required: true
      },{
        arg: 'reason',
        type: 'string',
        required: true
      },{
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
        verb: 'get'
      }
    }
  );



  
};
