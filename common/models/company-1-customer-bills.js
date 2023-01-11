module.exports = function(Company1CustomerBills) {

	Company1CustomerBills.generateCustomerBills = function(customerId, billFromDate, billTodate, grandTotal, userId, subTotal, cgst, sgst, status, companyName, salaryChargedAmount, overtimeAmount, outstationAmount, nightStayAmount, extraDayAmount, adminCharge, salaryChargedQuantity, overtimeQuantity, outstationQuantity, nightStayQuantity, extraDayQuantity, reverseCharge, adminChargeRate, adminChargeUnit, advanceAmount, netAmount, remark, cb) {
        // sql query
        var sql = 'select * from generate_customer_bills(' + customerId + ', \'' + billFromDate + '\', \'' + billTodate + '\', \''+ grandTotal +'\', '+ userId +', \''+ subTotal +'\', \''+ cgst +'\', \''+ sgst +'\', \''+ status +'\', \''+ companyName +'\', \''+ salaryChargedAmount +'\', \''+ overtimeAmount +'\', \''+ outstationAmount +'\', \''+ nightStayAmount +'\', \''+ extraDayAmount +'\', \''+ adminCharge +'\', \''+ salaryChargedQuantity +'\', \''+ overtimeQuantity +'\', \''+ outstationQuantity +'\', \''+ nightStayQuantity +'\', \''+ extraDayQuantity +'\',\''+ reverseCharge +'\', \''+ adminChargeRate +'\', \''+ adminChargeUnit +'\', \''+ advanceAmount +'\', \''+ netAmount +'\', \''+ remark +'\')';

        console.log('Bill generate function ...' + sql);
        // call sql query from postreSQL
        Company1CustomerBills.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error generating bills ...');
                console.log(err);
                return cb(err);
            }
            console.log('Generate bill result ...' + JSON.stringify(result));
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Company1CustomerBills.remoteMethod(
        'generateCustomerBills', {
            accepts: [{
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'billFromDate',
                type: 'string',
                required: false
            }, {
                arg: 'billTodate',
                type: 'string',
                required: false
            }, {
                arg: 'grandTotal',
                type: 'string',
                required: false
            }, {
                arg: 'userId',
                type: 'string',
                required: false
            }, {
                arg: 'subTotal',
                type: 'string',
                required: false
            }, {
                arg: 'cgst',
                type: 'string',
                required: false
            }, {
                arg: 'sgst',
                type: 'string',
                required: false
            }, {
                arg: 'status',
                type: 'string',
                required: false
            }, {
                arg: 'companyName',
                type: 'string',
                required: false
            }, {
                arg: 'salaryChargedAmount',
                type: 'string',
                required: false
            }, {
                arg: 'overtimeAmount',
                type: 'string',
                required: false
            }, {
                arg: 'outstationAmount',
                type: 'string',
                required: false
            }, {
                arg: 'nightStayAmount',
                type: 'string',
                required: false
            }, {
                arg: 'extraDayAmount',
                type: 'string',
                required: false
            }, {
                arg: 'adminCharge',
                type: 'string',
                required: false
            }, {
                arg: 'salaryChargedQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'overtimeQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'outstationQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'nightStayQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'extraDayQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'reverseCharge',
                type: 'string',
                required: false
            }, {
                arg: 'adminChargeRate',
                type: 'string',
                required: false
            }, {
                arg: 'adminChargeUnit',
                type: 'string',
                required: false
            }, {
                arg: 'advanceAmount',
                type: 'string',
                required: false
            }, {
                arg: 'netAmount',
                type: 'string',
                required: false
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
    Company1CustomerBills.generateCustomerMultipleBills = function(customerId, billFromDate, billTodate, grandTotal, userId, subTotal, cgst, sgst, status, companyName, salaryChargedAmount, overtimeAmount, outstationAmount, nightStayAmount, extraDayAmount, adminCharge, salaryChargedQuantity, overtimeQuantity, outstationQuantity, nightStayQuantity, extraDayQuantity, reverseCharge, adminChargeRate, adminChargeUnit, advanceAmount, netAmount, remark, driverId, company2driverId, cb) {
        // sql query
        var sql = 'select * from generate_customer_multiplebills(' + customerId + ', \'' + billFromDate + '\', \'' + billTodate + '\', \''+ grandTotal +'\', '+ userId +', \''+ subTotal +'\', \''+ cgst +'\', \''+ sgst +'\', \''+ status +'\', \''+ companyName +'\', \''+ salaryChargedAmount +'\', \''+ overtimeAmount +'\', \''+ outstationAmount +'\', \''+ nightStayAmount +'\', \''+ extraDayAmount +'\', \''+ adminCharge +'\', \''+ salaryChargedQuantity +'\', \''+ overtimeQuantity +'\', \''+ outstationQuantity +'\', \''+ nightStayQuantity +'\', \''+ extraDayQuantity +'\',\''+ reverseCharge +'\', \''+ adminChargeRate +'\', \''+ adminChargeUnit +'\', \''+ advanceAmount +'\', \''+ netAmount +'\', \''+ remark +'\','+ driverId +','+ company2driverId +')';

        console.log('Bill generate function ...' + sql);
        // call sql query from postreSQL
        Company1CustomerBills.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error generating bills ...');
                console.log(err);
                return cb(err);
            }
            console.log('Generate bill result ...' + JSON.stringify(result));
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Company1CustomerBills.remoteMethod(
        'generateCustomerMultipleBills', {
            accepts: [{
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'billFromDate',
                type: 'string',
                required: false
            }, {
                arg: 'billTodate',
                type: 'string',
                required: false
            }, {
                arg: 'grandTotal',
                type: 'string',
                required: false
            }, {
                arg: 'userId',
                type: 'string',
                required: false
            }, {
                arg: 'subTotal',
                type: 'string',
                required: false
            }, {
                arg: 'cgst',
                type: 'string',
                required: false
            }, {
                arg: 'sgst',
                type: 'string',
                required: false
            }, {
                arg: 'status',
                type: 'string',
                required: false
            }, {
                arg: 'companyName',
                type: 'string',
                required: false
            }, {
                arg: 'salaryChargedAmount',
                type: 'string',
                required: false
            }, {
                arg: 'overtimeAmount',
                type: 'string',
                required: false
            }, {
                arg: 'outstationAmount',
                type: 'string',
                required: false
            }, {
                arg: 'nightStayAmount',
                type: 'string',
                required: false
            }, {
                arg: 'extraDayAmount',
                type: 'string',
                required: false
            }, {
                arg: 'adminCharge',
                type: 'string',
                required: false
            }, {
                arg: 'salaryChargedQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'overtimeQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'outstationQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'nightStayQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'extraDayQuantity',
                type: 'string',
                required: false
            }, {
                arg: 'reverseCharge',
                type: 'string',
                required: false
            }, {
                arg: 'adminChargeRate',
                type: 'string',
                required: false
            }, {
                arg: 'adminChargeUnit',
                type: 'string',
                required: false
            }, {
                arg: 'advanceAmount',
                type: 'string',
                required: false
            }, {
                arg: 'netAmount',
                type: 'string',
                required: false
            }, {
                arg: 'remark',
                type: 'string',
                required: false
            },{
                arg: 'driverId',
                type: 'string',
                required: true
            },{
                arg: 'company2driverId',
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

Company1CustomerBills.generateCustomerOtherBills = function(customerId, billFromDate, billTodate, grandTotal, userId, subTotal, cgst, sgst, companyName, reverseCharge, advanceAmount, netAmount, itemId, amount, remark, cb) {
        // sql query
        var sql = 'select * from generate_customer_other_bills(' + customerId + ', \'' + billFromDate + '\', \'' + billTodate + '\', \'' + grandTotal + '\', ' + userId + ', \'' + subTotal + '\', \'' + cgst + '\', \'' + sgst + '\', \'' + companyName + '\', \'' + reverseCharge + '\', \'' + advanceAmount + '\', \'' + netAmount + '\', ' + itemId + ', \'' + amount + '\', \'' + remark + '\')';

        console.log('Other bill generate function ...' + sql);
        // call sql query from postreSQL
        Company1CustomerBills.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error generating other bills ...');
                console.log(err);
                return cb(err);
            }
            console.log('Generate other bill result ...' + JSON.stringify(result));
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Company1CustomerBills.remoteMethod(
        'generateCustomerOtherBills', {
            accepts: [{
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'billFromDate',
                type: 'string',
                required: true
            }, {
                arg: 'billTodate',
                type: 'string',
                required: true
            }, {
                arg: 'grandTotal',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
                type: 'string',
                required: true
            }, {
                arg: 'subTotal',
                type: 'string',
                required: true
            }, {
                arg: 'cgst',
                type: 'string',
                required: true
            }, {
                arg: 'sgst',
                type: 'string',
                required: true
            }, {
                arg: 'companyName',
                type: 'string',
                required: true
            }, {
                arg: 'reverseCharge',
                type: 'string',
                required: true
            }, {
                arg: 'advanceAmount',
                type: 'string',
                required: true
            }, {
                arg: 'netAmount',
                type: 'string',
                required: true
            }, {
                arg: 'itemId',
                type: 'string',
                required: true
            }, {
                arg: 'amount',
                type: 'string',
                required: true
            },{
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


};
