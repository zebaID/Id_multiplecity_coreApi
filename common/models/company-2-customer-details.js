module.exports = function(Company2CustomerDetails) {

  Company2CustomerDetails.createBillingAttendanceCustomer = function(firstName, lastName, mobileNumber, email, address, agreementNumber, landline, contactPersonName, contactPersonEmail, vehicleName, vehicleType, gstnNumber, hsaNumber, adminCharge, agreementStartDate, agreementEndDate, userId, adminChargeType, contactPerson2Name, contactPerson2Email,contactPerson2MobileNumber, cb) {

        var sql = 'select * from create_billing_attendance_customer(\'' + firstName + '\', \'' + lastName + '\', \'' + mobileNumber + '\', \'' + email + '\', \'' + address + '\', ' + agreementNumber + ', \'' + landline + '\', \'' + contactPersonName + '\', \'' + contactPersonEmail + '\', \'' + vehicleName + '\', \'' + vehicleType + '\', \'' + gstnNumber + '\', \'' + hsaNumber + '\' , ' + adminCharge + ', \'' + agreementStartDate + '\', \'' + agreementEndDate + '\',' + userId + ', \'' + adminChargeType + '\', \'' +contactPerson2Name+ '\', \'' +contactPerson2Email+ '\', \'' +contactPerson2MobileNumber+ '\')';
console.log(sql);
        Company2CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating billing customer ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });



    };

    Company2CustomerDetails.remoteMethod(
        'createBillingAttendanceCustomer', {
            accepts: [{
                arg: 'firstName',
                type: 'string',
                required: true
            }, {
                arg: 'lastName',
                type: 'string',
                required: true
            }, {
                arg: 'mobileNumber',
                type: 'string',
                required: true
            }, {
                arg: 'email',
                type: 'string',
                required: true
            }, {
                arg: 'address',
                type: 'string',
                required: true
            }, {
                arg: 'agreementNumber',
                type: 'string',
                required: true
            }, {
                arg: 'landline',
                type: 'string',
                required: false
            }, {
                arg: 'contactPersonName',
                type: 'string',
                required: true
            }, {
                arg: 'contactPersonEmail',
                type: 'string',
                required: true
            }, {
                arg: 'vehicleName',
                type: 'string',
                required: true
            }, {
                arg: 'vehicleType',
                type: 'string',
                required: true
            }, {
                arg: 'gstnNumber',
                type: 'string',
                required: true
            }, {
                arg: 'hsaNumber',
                type: 'string',
                required: false
            }, {
                arg: 'adminCharge',
                type: 'string',
                required: true
            }, {
                arg: 'agreementStartDate',
                type: 'string',
                required: true
            }, {
                arg: 'agreementEndDate',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
                type: 'string',
                required: true
            }, {
                arg: 'adminChargeType',
                type: 'string',
                required: true
            },{
                arg: 'contactPerson2Name',
                type: 'string',
                required: false
            }, {
                arg: 'contactPerson2Email',
                type: 'string',
                required: false
            }, {
                arg: 'contactPerson2MobileNumber',
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

    Company2CustomerDetails.createBillingCustomerMDrivers = function(firstName, lastName, mobileNumber, email, address, agreementNumber, landline, contactPersonName, contactPersonEmail, vehicleName, vehicleType, gstnNumber, hsaNumber, agreementStartDate, agreementEndDate, userId, contactPerson2Name, contactPerson2Email,contactPerson2MobileNumber,billType, cb) {

var sql = 'select * from create_billing_customer_for_mdrivers(\'' + firstName + '\', \'' + lastName + '\', \'' + mobileNumber + '\', \'' + email + '\', \'' + address + '\', ' + agreementNumber + ', \'' + landline + '\', \'' + contactPersonName + '\', \'' + contactPersonEmail + '\', \'' + vehicleName + '\', \'' + vehicleType + '\', \'' + gstnNumber + '\', \'' + hsaNumber + '\' , \'' + agreementStartDate + '\', \'' + agreementEndDate + '\',' + userId + ', \'' +contactPerson2Name+ '\', \'' +contactPerson2Email+ '\', \'' +contactPerson2MobileNumber+ '\',\'' +billType+ '\')';
console.log(sql);
Company2CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
if (err) {
console.log('Error creating billing customer ...');
console.log(err);
return cb(err);
}
cb(err, result);
});



};

Company2CustomerDetails.remoteMethod(
'createBillingCustomerMDrivers', {
accepts: [{
arg: 'firstName',
type: 'string',
required: true
}, {
arg: 'lastName',
type: 'string',
required: true
}, {
arg: 'mobileNumber',
type: 'string',
required: true
}, {
arg: 'email',
type: 'string',
required: true
}, {
arg: 'address',
type: 'string',
required: true
}, {
arg: 'agreementNumber',
type: 'string',
required: true
}, {
arg: 'landline',
type: 'string',
required: false
}, {
arg: 'contactPersonName',
type: 'string',
required: true
}, {
arg: 'contactPersonEmail',
type: 'string',
required: true
}, {
arg: 'vehicleName',
type: 'string',
required: true
}, {
arg: 'vehicleType',
type: 'string',
required: true
}, {
arg: 'gstnNumber',
type: 'string',
required: true
}, {
arg: 'hsaNumber',
type: 'string',
required: false
}, {
arg: 'agreementStartDate',
type: 'string',
required: true
}, {
arg: 'agreementEndDate',
type: 'string',
required: true
}, {
arg: 'userId',
type: 'string',
required: true
},{
arg: 'contactPerson2Name',
type: 'string',
required: false
}, {
arg: 'contactPerson2Email',
type: 'string',
required: false
}, {
arg: 'contactPerson2MobileNumber',
type: 'string',
required: false
}, {
arg: 'billType',
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
	Company2CustomerDetails.getCompany2Customers = function(cb) {
    // sql query
    var sql = 'select cd.id, concat(cu.first_name || \' \' || cu.last_name) as name, cu.mobile_number, cd.contact_person_name from con_users cu, company2_customer_details cd where cu.id = cd.conuser_id';

    // call sql query from postreSQL
    Company2CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver list to allocate duty ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2CustomerDetails.remoteMethod(
    'getCompany2Customers', {
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
   Company2CustomerDetails.addAppointDriver = function(customerId,driverName,driverId,driverHours,weeklyOff,otRate,nsaRate,edRate,monthlySalary,driverCycle,appointedDate,osaRate,createdBy,directorId, cb) {
    // sql query
    var sql = 'select * from assign_driver_to_billing_customer2(\'' + customerId + '\',\'' + driverName + '\',\'' + driverId + '\',\'' + driverHours + '\',\'' + weeklyOff + '\',\'' + otRate + '\',\'' + nsaRate + '\',\'' + edRate + '\',\'' + monthlySalary + '\',\'' + driverCycle + '\',\'' + appointedDate + '\',\'' + osaRate + '\',\'' + createdBy + '\',\'' + directorId + '\' )';

    // call sql query from postreSQL
    Company2CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2CustomerDetails.remoteMethod(
    'addAppointDriver', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true
      },{
        arg: 'driverName',
        type: 'string',
        required: true
      },{
        arg: 'driverId',
        type: 'string',
        required: true
      },{
        arg: 'driverHours',
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
        arg: 'appointedDate',
        type: 'string',
        required: true
      },{
        arg: 'osaRate',
        type: 'string',
        required: true
      },{
        arg: 'createdBy',
        type: 'string',
        required: true
      },{
        arg: 'directorId',
        type:'string',
        required:true
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

  Company2CustomerDetails.AppointDriverforBilling = function(customerId,driverName,driverId,driverHours,weeklyOff,otRate,nsaRate,edRate,monthlySalary,driverCycle,appointedDate,osaRate,createdBy,adminCharge, adminChargeType, cb) {
    // sql query
    var sql = 'select * from apoint_driver_to_billing_customer(' + customerId + ',\'' + driverName + '\',' + driverId + ',' + driverHours + ',\'' + weeklyOff + '\',' + otRate + ',' + nsaRate + ',' + edRate + ',' + monthlySalary + ',' + driverCycle + ',\'' + appointedDate + '\',' + osaRate + ',' + createdBy + ','+ adminCharge +',\'' + adminChargeType + '\')';

    // call sql query from postreSQL
    Company2CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2CustomerDetails.remoteMethod(
    'AppointDriverforBilling', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true
      },{
        arg: 'driverName',
        type: 'string',
        required: true
      },{
        arg: 'driverId',
        type: 'string',
        required: true
      },{
        arg: 'driverHours',
        type: 'string',
        required: true
      },{
        arg: 'weeklyOff',
        type: 'string',
        required: false
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
        arg: 'appointedDate',
        type: 'string',
        required: true
      },{
        arg: 'osaRate',
        type: 'string',
        required: true
      },{
        arg: 'createdBy',
        type: 'string',
        required: true
      },{
        arg: 'adminCharge',
        type: 'string',
        required: true
      },{
        arg: 'adminChargeType',
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
Company2CustomerDetails.getCompany2CustomerDetails = function(company2CustomerId, cb) {
    // sql query
    var sql = 'select company2_customer_details.id, conuser_id, concat(first_name || \' \' || last_name) as name, email, address, mobile_number, company2_customer_details.created_date, company2_customer_details.bill_type from company2_customer_details, con_users where company2_customer_details.conuser_id = con_users.id and company2_customer_details.id ='+ company2CustomerId;

    // call sql query from postreSQL
    Company2CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver list to allocate duty ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Company2CustomerDetails.remoteMethod(
    'getCompany2CustomerDetails', {
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


};
