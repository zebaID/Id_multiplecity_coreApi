module.exports = function(Company1CustomerDetails) {

    Company1CustomerDetails.createBillingCustomer = function(firstName, lastName, mobileNumber, email, address, agreementNumber, landline, contactPersonName, contactPersonEmail, vehicleName, vehicleType, gstnNumber, hsaNumber, dutyHours, weeklyOff, monthlySalary, otRate, osaRate, nsaRate, edRate, adminCharge, companyName, agreementStartDate, agreementEndDate, userId, adminChargeType, driverName, cb) {

        var sql = 'select * from create_billing_customer(\'' + firstName + '\', \'' + lastName + '\', \'' + mobileNumber + '\', \'' + email + '\', \'' + address + '\', ' + agreementNumber + ', \'' + landline + '\', \'' + contactPersonName + '\', \'' + contactPersonEmail + '\', \'' + vehicleName + '\', \'' + vehicleType + '\', \'' + gstnNumber + '\', \'' + hsaNumber + '\',' + dutyHours + ', \'' + weeklyOff + '\', ' + monthlySalary + ', ' + otRate + ', ' + osaRate + ', ' + nsaRate + ', ' + edRate + ', ' + adminCharge + ', \'' + companyName + '\' , \'' + agreementStartDate + '\', \'' + agreementEndDate + '\',' + userId + ', \'' + adminChargeType + '\', \'' + driverName + '\')';

        Company1CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating billing customer ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });



    };

    Company1CustomerDetails.remoteMethod(
        'createBillingCustomer', {
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
                arg: 'dutyHours',
                type: 'string',
                required: true
            }, {
                arg: 'weeklyOff',
                type: 'string',
                required: false
            }, {
                arg: 'monthlySalary',
                type: 'string',
                required: true
            }, {
                arg: 'otRate',
                type: 'string',
                required: true
            }, {
                arg: 'osaRate',
                type: 'string',
                required: true
            }, {
                arg: 'nsaRate',
                type: 'string',
                required: true
            }, {
                arg: 'edRate',
                type: 'string',
                required: true
            }, {
                arg: 'adminCharge',
                type: 'string',
                required: true
            }, {
                arg: 'companyName',
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
            }, {
                arg: 'driverName',
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

    Company1CustomerDetails.createExistingBillingCustomer = function(conuserId, agreementNumber, landline, contactPersonName, contactPersonEmail, vehicleName, vehicleType, gstnNumber, hsaNumber, dutyHours, weeklyOff, monthlySalary, otRate, osaRate, nsaRate, edRate, adminCharge, companyName, agreementStartDate, agreementEndDate, userId, adminChargeType, driverName, cb) {

        var sql = 'select * from create_existing_billing_customer(' + conuserId + ',' + agreementNumber + ', \'' + landline + '\', \'' + contactPersonName + '\', \'' + contactPersonEmail + '\', \'' + vehicleName + '\', \'' + vehicleType + '\', \'' + gstnNumber + '\', \'' + hsaNumber + '\',' + dutyHours + ', \'' + weeklyOff + '\', ' + monthlySalary + ', ' + otRate + ', ' + osaRate + ', ' + nsaRate + ', ' + edRate + ', ' + adminCharge + ', \'' + companyName + '\' , \'' + agreementStartDate + '\', \'' + agreementEndDate + '\',' + userId + ', \'' + adminChargeType + '\', \'' + driverName + '\')';

        Company1CustomerDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating billing customer ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });



    };

    Company1CustomerDetails.remoteMethod(
        'createExistingBillingCustomer', {
            accepts: [{
                arg: 'conuserId',
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
                arg: 'dutyHours',
                type: 'string',
                required: true
            }, {
                arg: 'weeklyOff',
                type: 'string',
                required: false
            }, {
                arg: 'monthlySalary',
                type: 'string',
                required: true
            }, {
                arg: 'otRate',
                type: 'string',
                required: true
            }, {
                arg: 'osaRate',
                type: 'string',
                required: true
            }, {
                arg: 'nsaRate',
                type: 'string',
                required: true
            }, {
                arg: 'edRate',
                type: 'string',
                required: true
            }, {
                arg: 'adminCharge',
                type: 'string',
                required: true
            }, {
                arg: 'companyName',
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
            }, {
                arg: 'driverName',
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
