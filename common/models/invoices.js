var consts = require('../../server/consts');
var rest = require('restler');
module.exports = function(Invoices) {

    Invoices.postOnlinePayment = function(bookingId, cb) {
        // sql query
        var sql = 'select * from post_online_payment(\'' + bookingId + '\')';
        console.log('post online payment function ...' + sql);
        // call sql query from postreSQL
        Invoices.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in online payment ...');
                console.log(err);
                return cb(err);
            } else {
                var sql1 = 'select cu.first_name, cu.last_name, cu.mobile_number, b.reporting_date, b.reporting_time from con_users cu,driver_details cd, bookings b where cu.id = cd.conuser_id and cd.id = b.driver_id and b.id = \'' + bookingId + '\'';

                Invoices.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                    if (err) {
                        console.log('error in fetching customer data ...');
                        console.log(err);
                        return cb(err);
                    } else {
                        console.log('driver data ...' + JSON.stringify(result1));
                        var reportingDate = result1[0].reporting_date.getDate() + '-' + (result1[0].reporting_date.getMonth() + 1) + '-' + result1[0].reporting_date.getFullYear();
                        var reportingTime = result1[0].reporting_time;
                        var drvName = result1[0].first_name + ' ' + result1[0].last_name;
                        var drvMobile = result1[0].mobile_number;
                        var drvMsg = 'Dear ' + drvName + ',%0aIndian Drivers received payment for Booking ID:' + bookingId + ' Dated on ' + reportingDate + ' @' + reportingTime + '. you can leave now. For queries, please reach us on 020-69400400 or info@indian-drivers.com.';
                        sendMessage(drvMobile, drvMsg);
                    }
                });
                console.log('online payment success ...' + JSON.stringify(result));
                cb(err, result);
            }
        });
    };

    //Remote method to get provider of email

    Invoices.remoteMethod(
        'postOnlinePayment', {
            accepts: [{
                arg: 'bookingId',
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

function sendMessage(mobileNumber, msg) {
        console.log('entered **************');
        var data = "";
        data += "username=msgs-driver";
        data += "&password=driver";
        data += "&type=0";
        data += "&dlr=1";
        data += "&destination=" + mobileNumber;
        data += "&source=INDRIV";
        data += "&sender=INDRIV";
        data += "&message=" + msg;
        var url = consts.SMS_URL + data;
        console.log('url = ' + url);
        rest.post(url)
            .on('complete', function(smsResponse, smsError) {
                console.log('SMS response : ' + JSON.stringify(smsResponse));
                //console.log('SMS error : ' + JSON.stringify(smsError));
                //cb(null,smsResponse);
            });
    };

};
