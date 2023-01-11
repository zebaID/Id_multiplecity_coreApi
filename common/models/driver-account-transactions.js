module.exports = function(DriverAccountTransactions) {

  DriverAccountTransactions.getDriverTransaction = function(operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select dt.account_id, da.driver_id, cu.first_name, cu.last_name, dt.description, dt.amount, dt.created_date, dt.transaction_status from driver_account_transactions dt, driver_account da, driver_details dd ,  con_users cu where dt.account_id = da.id and da.driver_id = dd.id and dd.conuser_id = cu.id and dt.created_date > (TIMESTAMP \'today\')';
    } else {


      var sql = 'select dt.account_id, da.driver_id, cu.first_name, cu.last_name, dt.description, dt.amount, dt.created_date, dt.transaction_status from driver_account_transactions dt, driver_account da, driver_details dd ,  con_users cu where dt.account_id = da.id and cu.operation_city = \'' + operationCity + '\' and da.driver_id = dd.id and dd.conuser_id = cu.id and dt.created_date > (TIMESTAMP \'today\')';
    }
    // call sql query from postreSQL
    DriverAccountTransactions.app.datasources.postgres.connector.query(sql, function(err, result) {
      console.log(result);
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverAccountTransactions.remoteMethod(
    'getDriverTransaction', {
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

  DriverAccountTransactions.getDriverTransactionHistory = function(fromDate, ToDate, operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select dt.account_id, da.driver_id, cu.first_name, cu.last_name, dt.description, dt.amount, dt.created_date, dt.transaction_status from driver_account_transactions dt, driver_account da, driver_details dd ,  con_users cu where dt.account_id = da.id and da.driver_id = dd.id and dd.conuser_id = cu.id and dt.created_date >= (TIMESTAMP \'' + fromDate + '\') and dt.created_date < (TIMESTAMP  \'' + ToDate + '\' ::date + \'1 day\'::interval)';
    } else {
      var sql = 'select dt.account_id, da.driver_id, cu.first_name, cu.last_name, dt.description, dt.amount, dt.created_date, dt.transaction_status from driver_account_transactions dt, driver_account da, driver_details dd ,  con_users cu where dt.account_id = da.id and cu.operation_city = \'' + operationCity + '\' and da.driver_id = dd.id and dd.conuser_id = cu.id and dt.created_date >= (TIMESTAMP \'' + fromDate + '\') and dt.created_date < (TIMESTAMP  \'' + ToDate + '\' ::date + \'1 day\'::interval)';
    }

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    DriverAccountTransactions.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  DriverAccountTransactions.remoteMethod(
    'getDriverTransactionHistory', {
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
};
