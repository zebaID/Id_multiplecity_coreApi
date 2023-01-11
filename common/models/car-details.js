module.exports = function(CarDetails) {



 CarDetails.driverCarDetails=function(driverId,carName,carVariant,carType,carCategory,carInsuranceCompany,engineNo,chassisNo,carRegistartionNumber,manufacturingDate,vehiclePassingDate,rcInsuranceCopyDocumented,pvDate,permitExpiryDate,kmCovered,remark,createdBy,cb)
{
        // sql query
        
        var sql = 'SELECT * from create_car_driver('+driverId + ',\'' + carName + '\',\'' + carVariant + '\',\'' + carType + '\',\'' + carCategory + '\',\'' + carInsuranceCompany + '\',\'' + engineNo + '\',\'' + chassisNo + '\',\'' + carRegistartionNumber + '\',\'' + manufacturingDate + '\',\'' + vehiclePassingDate + '\',' + rcInsuranceCopyDocumented + ',\'' + pvDate + '\',\'' + permitExpiryDate + '\',\'' + kmCovered + '\',\'' + remark + '\',\'' + createdBy+ '\')';
            console.log(sql);
       
        CarDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    CarDetails.remoteMethod(
        'driverCarDetails', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            },
            {
                arg: 'carName',
                type: 'string',
                required: true
            },
            {
                arg: 'carVariant',
                type: 'string',
                required: true
            },
            {
                arg: 'carType',
                type: 'string',
                required: true
            },
            {
                arg: 'carCategory',
                type: 'string',
                required: true
            },
            {
                arg: 'carInsuranceCompany',
                type: 'string',
                required: true
            },
            {
                arg: 'engineNo',
                type: 'string',
                required: true
            },
            {
                arg: 'chassisNo',
                type: 'string',
                required: true
            },
            {
                arg: 'carRegistartionNumber',
                type: 'string',
                required: true
            },
            {
                arg: 'manufacturingDate',
                type: 'string',
                required: true
            },
            {
                arg: 'vehiclePassingDate',
                type: 'string',
                required: true
            },
            {
                arg: 'rcInsuranceCopyDocumented',
                type: 'string',
                required: true
            },
            {
                arg: 'pvDate',
                type: 'string',
                required: true
            },
            {
                arg: 'permitExpiryDate',
                type: 'string',
                required: true
            },{
                arg: 'kmCovered',
                type: 'string',
                required: true
            },
            {
                arg: 'remark',
                type: 'string',
                required: true
            },
            {
                arg: 'createdBy',
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




