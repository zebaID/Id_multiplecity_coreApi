var rest = require('restler');
module.exports = function(BookingInvoiceHeads) {
    // function to calculate fare
      BookingInvoiceHeads.calculateFare = function(carType, isRoundTrip, isOutstation, actualReportingDate, actualReportingTime, actualReleivingDate, actualReleivingTime, distanceBetweenPickupAndDrop, pickupLat, pickupLng, dropLat, dropLng, operationCityId, cb) {
        // sql query
        var returnTravelTime = 0;
       

// var pickupLat =0; 
// var  pickupLng =0;
// var  dropLat =0;
// var dropLng=0; 
   console.log('returnTravelTime ' + JSON.stringify(returnTravelTime));

                var sql = 'select invoice_head_id as "invoiceHeadId", invoice_head_name as "invoiceHeadName", invoice_sub_head_id as "invoiceSubHeadId", invoice_sub_head_name as "invoiceSubHeadName", amount, return_travel_time_inminutes from calculate_fare(\'' + carType + '\', ' + isRoundTrip + ', ' + isOutstation + ', \'' + actualReportingDate + '\', \'' + actualReportingTime + '\', \'' + actualReleivingDate + '\', \'' + actualReleivingTime + '\', \'' + distanceBetweenPickupAndDrop + '\', ' + pickupLat + ', ' + pickupLng + ', ' + dropLat + ', ' + dropLng + ',' + returnTravelTime + ',' + operationCityId+ ') where amount <> 0';

                console.log('fare matrix' + sql);
                // call sql query from postreSQL
                BookingInvoiceHeads.app.datasources.postgres.connector.query(sql, function(err, result) {
                    if (err) {
                        console.log('Error calculating fare ...');
                        console.log(err);
                        return cb(err);
                    }
                    console.log('fare matrix result' + JSON.stringify(result));
                    cb(err, result);
                });
            

    };

    //Remote method to calculate fare

    BookingInvoiceHeads.remoteMethod(
        'calculateFare', {
            accepts: [{
                arg: 'carType',
                type: 'string',
                required: true
            }, {
                arg: 'isRoundTrip',
                type: 'string',
                required: true
            }, {
                arg: 'isOutstation',
                type: 'string',
                required: true
            }, {
                arg: 'actualReportingDate',
                type: 'string',
                required: true
            }, {
                arg: 'actualReportingTime',
                type: 'string',
                required: true
            }, {
                arg: 'actualReleivingDate',
                type: 'string',
                required: true
            }, {
                arg: 'actualReleivingTime',
                type: 'string',
                required: true
            }, {
                arg: 'distanceBetweenPickupAndDrop',
                type: 'string',
                required: true
            }, {
                arg: 'pickupLat',
                type: 'string',
                required: true
            }, {
                arg: 'pickupLng',
                type: 'string',
                required: true
            }, {
                arg: 'dropLat',
                type: 'string',
                required: true
            }, {
                arg: 'dropLng',
                type: 'string',
                required: true
            }, {
                arg: 'operationCityId',
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
