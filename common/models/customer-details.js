module.exports = function(CustomerDetails) {

    CustomerDetails.searchCustomers = function(from_date, to_date, status, operationCity, cb) {

console.log(from_date);
console.log(to_date);
console.log(status);
console.log(operationCity);

    if (operationCity === 'All') {

       if ((from_date !== undefined || from_date !== '' || from_date !== null) && (to_date !== undefined || to_date !== '' || to_date !== null) && (status === undefined || status === '' || status === null)){
      
      var sql = 'select cu.id as conuser_id, cd.id as customer_id, cu.first_name, cu.last_name, cu.email, cu.address as landmark, cu.address_line_2 as address, cu.mobile_number, cu.user_device, cu.otp, cu.status, cu.created_date, cd.customer_type, cd.remark, cu.operation_city from con_users cu, customer_details cd where cu.id = cd.conuser_id and cu.created_date >= (TIMESTAMP  \'' + from_date + '\' ) and cu.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval)';

       }
       else if ((status !== undefined || status !== '' || status !== null) && (from_date !== undefined || from_date !== '' || from_date !== null) && (to_date !== undefined || to_date !== '' || to_date !== null) && status !== 'All'){
      var sql = 'select cu.id as conuser_id, cd.id as customer_id, cu.first_name, cu.last_name, cu.email, cu.address as landmark, cu.address_line_2 as address, cu.mobile_number, cu.user_device, cu.otp, cu.status, cu.created_date, cd.customer_type, cd.remark, cu.operation_city from con_users cu, customer_details cd where cu.id = cd.conuser_id and cu.created_date >= (TIMESTAMP \'' + from_date + '\' ) and cu.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) and cu.status = \'' + status + '\'';

      }else if((status ==='All') && (from_date !== undefined || from_date !== '' || from_date !== null) && (to_date !== undefined || to_date !== '' || to_date !== null)){
      var sql = 'select cu.id as conuser_id, cd.id as customer_id, cu.first_name, cu.last_name, cu.email, cu.address as landmark, cu.address_line_2 as address, cu.mobile_number, cu.user_device, cu.otp, cu.status, cu.created_date, cd.customer_type, cd.remark, cu.operation_city from con_users cu, customer_details cd where cu.id = cd.conuser_id and cu.created_date >= (TIMESTAMP \'' + from_date + '\' ) and cu.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval)';

      } 
  } else {
       
        if ((from_date !== undefined || from_date !== '' || from_date !== null) && (to_date !== undefined || to_date !== '' || to_date !== null) && (status === undefined || status === '' || status === null)){
     
     
     var sql = 'select cu.id as conuser_id, cd.id as customer_id, cu.first_name, cu.last_name, cu.email, cu.address as landmark, cu.address_line_2 as address, cu.mobile_number, cu.user_device, cu.otp, cu.status, cu.created_date, cd.customer_type, cd.remark, cu.operation_city from con_users cu, customer_details cd where cu.id = cd.conuser_id and cu.created_date >= (TIMESTAMP \'' + from_date + '\') and cu.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) and cu.operation_city =\''+ operationCity +'\'';

       }
       else if ((status !== undefined || status !== '' || status !== null) && (from_date !== undefined || from_date !== '' || from_date !== null) && (to_date !== undefined || to_date !== '' || to_date !== null) && status !== 'All'){

         var sql = 'select cu.id as conuser_id, cd.id as customer_id, cu.first_name, cu.last_name, cu.email, cu.address as landmark, cu.address_line_2 as address, cu.mobile_number, cu.user_device, cu.otp, cu.status, cu.created_date, cd.customer_type, cd.remark, cu.operation_city from con_users cu, customer_details cd where cu.id = cd.conuser_id and cu.created_date >= (TIMESTAMP \'' + from_date + '\') and cu.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) and cu.status = \'' + status + '\' and cu.operation_city =\''+ operationCity +'\''; 
      
      console.log('Query1 Sucess...');
      }else if((status ==='All') && (from_date !== undefined || from_date !== '' || from_date !== null) && (to_date !== undefined || to_date !== '' || to_date !== null)){
      var sql = 'select cu.id as conuser_id, cd.id as customer_id, cu.first_name, cu.last_name, cu.email, cu.address as landmark, cu.address_line_2 as address, cu.mobile_number, cu.user_device, cu.otp, cu.status, cu.created_date, cd.customer_type, cd.remark, cu.operation_city from con_users cu, customer_details cd where cu.id = cd.conuser_id and cu.created_date >= (TIMESTAMP \'' + from_date + '\') and cu.created_date < (TIMESTAMP  \'' + to_date + '\' ::date + \'1 day\'::interval) and cu.operation_city =\''+ operationCity +'\'';
       console.log('Query2 Sucess...');
      } 
  }
CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {

      if (err) {

        console.log('Error getting driver transaction ...');

        console.log(err);

        return cb(err);

      }

      cb(err, result);

    });

  };
 
  CustomerDetails.remoteMethod(

    'searchCustomers', {

      accepts: [{

        arg: 'from_date',

        type: 'string',

        required: true

      }, {

        arg: 'to_date',

        type: 'string',

        required: true

      }, {

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


  CustomerDetails.getCustomers = function(operationCity, cb) {
    // sql query
    var sql = 'select * from get_customers(\'' + operationCity + '\')';

    // call sql query from postreSQL
    CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver list to allocate duty ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  CustomerDetails.remoteMethod(
    'getCustomers', {
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
