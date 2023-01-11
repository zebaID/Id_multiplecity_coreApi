module.exports = function(Company2CustomerBills) {
Company2CustomerBills.getCompany2CustomerBills = function(company2CustomerId, fromDate, ToDate, cb) {
    // sql query
    var sql = 'select company2_customer_bills.id, company2_customer_id, conuser_id, bill_date, bill_from_date, bill_to_date, total, sub_total, company2_customer_bills.remark as note, cgst, sgst, status, company2_customer_bills.bill_type from company2_customer_bills, company2_customer_details where company2_customer_details.id = company2_customer_bills.company2_customer_id and company2_customer_details.id = '+company2CustomerId +' and company2_customer_bills.bill_date >= \'' + fromDate + '\' and company2_customer_bills.bill_date <= \'' + ToDate + '\'';

    // call sql query from postreSQL
    Company2CustomerBills.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver list to allocate duty ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2CustomerBills.remoteMethod(
    'getCompany2CustomerBills', {
      accepts: [{
                arg: 'company2CustomerId',
                type: 'string',
                required: true
            },{
                arg: 'fromDate',
                type: 'string',
                required: true
            },{
                arg: 'ToDate',
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
  Company2CustomerBills.getCompany2CustomerBillsById = function(company2CustomerBillId, cb) {
    // sql query
    var sql = 'select company2_customer_bills.id, company2_customer_id, conuser_id, bill_date, bill_from_date, bill_to_date, total, sub_total, company2_customer_bills.remark as note, cgst, sgst, status, company2_customer_bills.bill_type from company2_customer_bills, company2_customer_details where company2_customer_details.id = company2_customer_bills.company2_customer_id and company2_customer_bills.id = '+company2CustomerBillId;

    // call sql query from postreSQL
    Company2CustomerBills.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver list to allocate duty ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2CustomerBills.remoteMethod(
    'getCompany2CustomerBillsById', {
      accepts: [{
                arg: 'company2CustomerBillId',
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
