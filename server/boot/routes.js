module.exports = function(app) {
var path=require("path");
var fcm = require('fcm-notification');
var FCM = new fcm('/usr/id-multiple-city-core-api/server/privatekey.json');
var credentials = require('/usr/id-multiple-city-core-api/server/boot/credentials.json');
var multer = require('multer');

var http = require('http');
    var rest = require('restler');
    var consts = require('../consts');
    const Youtube = require('youtube-api');
    const fs = require('fs');
    const open = require('open');
    var User = app.models.ConUsers;
    var AccessToken = app.models.AccessToken;

    var server = http.createServer();
    var io = require('socket.io')(server);

    server.listen(3200);

    var baseURL = consts.SERVER_URL + '/api';
    var emailId = consts.EMAIL_ID;
    var password = consts.PASSWORD;

    //reset the user's pasword
    app.post('/reset-password', function(req, res, next) {
        console.log('reset-password called');
        if (!req.body.accessToken) return res.sendStatus(401);

        //verify passwords match
        if (!req.body.password || !req.body.confirmation || req.body.password !== req.body.confirmation) {
            return res.sendStatus(400, new Error('Passwords do not match'));
        }

        AccessToken.findById(req.body.accessToken, function(err, accessToken) {
            if (err) return res.sendStatus(404);

            User.findById(accessToken.userId, function(err, user) {
                if (err) return res.sendStatus(404);
                user.updateAttribute('password', req.body.password, function(err, user) {
                    if (err) return res.sendStatus(404);
                    console.log('> password reset processed successfully');
                    return res.sendStatus(200);
                });
            });
        });
    });
     //multer setup
        var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/idmypotlee/public_html/server/boot/uploads')
  },
  filename: function (req, file, cb) {
    console.log('file');
    
    /*console.log(req.file.originalname);*/

     cb( null, 'file'+req.body.value1+'.mp4');
  }
});

 
var upload = multer({ storage: storage });
var oAuth = Youtube.authenticate({
        type:'oauth',
        client_id:credentials.web.client_id,
        client_secret:credentials.web.client_secret,
        redirect_url: credentials.web.redirect_uris[0]
    });

app.post('/uploadfile', upload.single('file'), (req, res, next) => {
  const file = req.file
 // console.log(req.file.originalname);
  const {title,description} = req.body;
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }else{
    console.log(req.body.value1);
    console.log('upload successfull');

    /*open(oAuth.generateAuthUrl({
        access_type:'offline',
        scope:'https://www.googleapis.com/auth/youtube.upload',
        state: req.body.value1
    }))*/
    //console.log(oAuth);
    console.log('upload successfull');
          var sql;

        sql = 'update driver_details set interview_status =\'Done\' where id = ' + req.body.value1;

        console.log('sql query : ' + sql);
        //console.log(JSON.stringify(result));

        app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in analysis transactionjob...');
                console.log(err);
                return err;

        
            }

            console.log('saved  : ' + JSON.stringify(result));

           //io.sockets.emit('analysis_result_socket_' + result, result);
            


        });


  }
    res.send(file)
  
});

app.post('/saveyoutubeurlindatabase', function(req, res) {
        var sql;

        sql = 'update driver_details set interview_link = \'' + req.body.link + '\' where id = ' + req.body.driver_id;

        console.log('sql query : ' + sql);
        //console.log(JSON.stringify(result));

        app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in analysis transactionjob...');
                console.log(err);
                return err;

        
            }

            console.log('saved  : ' + JSON.stringify(result));

           //io.sockets.emit('analysis_result_socket_' + result, result);
            


        });


    });


app.get('/oauth2callback', function(req,res){
    res.send("hi");
    
//     console.log(req.length);
//     var state = JSON.parse(req.query.state);

//     console.log('state');
//     //console.log(state);
//     oAuth.getToken(req.query.code, (err, tokens) =>{
//         if(err){
//             console.log(err);
//             return
//         }
//         /*const tokens = { access_token:
//    'ya29.a0AfH6SMAH8j_9GWfBGoWSPvy7h5BIq4SL8lpb1jTteBW0gugnlZV8qN2gkGhy2xbOBl7o8Rc2csFkqWLZBQZLsZHY-KdcjSKembizzUJzOZV6dPIJjmuHuN0gTUrGV_HsnuplfYxgVdOPCfdGz3NLMkpOmY44z-qNvIsO',
//   scope: 'https://www.googleapis.com/auth/youtube.upload',
//   token_type: 'Bearer',
//   expiry_date: 1592543821747 };
//         console.log('token');
//         console.log(tokens);*/
//         console.log('token');
//         console.log(tokens);
//         oAuth.setCredentials(tokens);


//          Youtube.videos.insert({
//             resource: {
//                 // Video title and description
//                 snippet: {
//                     title: "Indian Drivers"+state
//                   , description: "Driver Interview"+state
//                 }
//                 // I don't want to spam my subscribers
//               , status: {
//                     privacyStatus: "private"
//                 }
//             }
//             // This is for the callback function
//           , part: "snippet,status"
 
//             // Create the readable stream to upload the video
//           , media: {
//                 body: fs.createReadStream("/usr/id-multiple-city-core-api/server/boot/uploads/file.mp4")
//             }
//         }, (err, data) => {
//             console.log("Done.");
            
//             if(err){
//                 console.log(err);
//             }else{
//                 res.send(data);
//                 var link = 'https://www.youtube.com/watch?v=' +data.id;
//                  /*var sql;

//         sql = 'update driver_details set interview_link = \'' + link + '\' where id = ' + state;

//         console.log('sql query : ' + sql);
//         //console.log(JSON.stringify(result));

//         app.datasources.postgres.connector.query(sql, function(err, result) {
//             if (err) {
//                 console.log('Error in analysis transactionjob...');
//                 console.log(err);
//                 return err;
//             }

//             console.log('saved  : ' + JSON.stringify(result));

//            //io.sockets.emit('analysis_result_socket_' + result, result);
            


//         });*/
//             }

//    /*         fs.unlink('D:/Personal/Local server Project/Indian_Drivers_Rest_Api/server/boot/uploads/file.mp4', (err) => {
//   if (err) throw err;
//   console.log('uploads was deleted');
// });*/
            
//         })
//     })

//     //console.log(res);
});

    app.get('/transactionJob', function(req, res) {
        var sql;

        sql = 'select * from invoices where booking_id in(select id from bookings where status = \'On Duty\') and invoice_type = \'a\'';

        console.log('sql query : ' + sql);
        //console.log(JSON.stringify(result));

        app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error fetching invoices...');
                console.log(err);
                return err;
            }

            console.log('result : ' + JSON.stringify(result));

            if (result.length <= 0) {
                res.send('No Data Found');
                return false;
            }

            var currDate = new Date();

            console.log('*********Current Date is**********' + currDate);

            var d1, m1, y1;
            var currTime;

            if (currDate.getDate() < 9) {
                d1 = '0' + currDate.getDate();
            } else {
                d1 = currDate.getDate();
            }

            if (currDate.getMonth() < 9) {
                m1 = '0' + currDate.getMonth();
                m1 = Number(m1) + 1;
            } else {
                m1 = currDate.getMonth();
                m1 = Number(m1) + 1;
            }

            y1 = currDate.getFullYear();

            currTime = currDate.getHours() + ':' + currDate.getMinutes();

            currDate = y1 + '/' + m1 + '/' + d1;

            console.log('Current date and Time ' + currDate + ':' + currTime);

            for (var i = 0; i < result.length; i++) {

                //var rptDate = new Date(result[i].reporting_date);
                var rptDate = new Date(result[i].reporting_date);

                
                if (rptDate.getDate() < 9) {
                    d1 = '0' + rptDate.getDate();
                } else {
                    d1 = rptDate.getDate();
                }

                if (rptDate.getMonth() < 9) {
                    m1 = rptDate.getMonth() + 1;
                } else {
                    m1 = rptDate.getMonth() + 1;
                }

                y1 = rptDate.getFullYear();

                rptDate = y1 + '/' + m1 + '/' + d1;

                console.log('Reporting date and time ' + rptDate);

                
                    // send the result over the socket for that booking
                        sql = 'select driver_lat as "lat", driver_long as "lng", total_amount as "amount", booking_id as "bookingId" from update_invoice_details_for_cronjob(' + result[i].id + ',' + result[i].booking_id + ',\'' + result[i].car_type + '\',' + result[i].is_round_trip + ',' + result[i].is_outstation + ',\'' + rptDate + '\',\'' + result[i].reporting_time + '\',\'' + currDate + '\',\'' + currTime + '\',\'' + result[i].pickup_location + '\',' + result[i].pickup_lat + ',' + result[i].pickup_long + ',\'' + result[i].drop_location + '\',' + result[i].drop_lat + ',' + result[i].drop_long + ',' + result[i].created_by + ')';

                        //sql = 'select * from update_invoice_details(' + result[i].id + ',' + result[i].booking_id + ',\'' + result[i].car_type + '\',' + result[i].is_round_trip + ',' + result[i].is_outstation + ',\'' + rptDate + '\',\'' + result[i].reporting_time + '\',\'' + currDate + '\',\'' + currTime + '\',\'' + result[i].pickup_location + '\',' + result[i].pickup_lat + ',' + result[i].pickup_long + ',\'' + result[i].drop_location + '\',' + result[i].drop_lat + ',' + result[i].drop_long + ',' + result[i].created_by + ')';

                        console.log('Insert sql : ' + sql);

                        app.datasources.postgres.connector.query(sql, function(err, response) {
                            if (err) {
                                console.log('Error inserting transaction ...');
                                console.log(err);
                                return err;
                            }
                            console.log('response is transactionjob: ' + JSON.stringify(response));
                            
                          //  io.sockets.emit('curent_booking_socket_' + response[0].bookingId, response);
                            
                        });
                  
                

            }

            res.send('Details updated successfully.');


        });

    });
  
 app.post('/getDriverAppLiveVersion', function(req, res) {
       //console.log('Update drivers Geolocation');
       res.send('9813');
         });

 app.post('/getCustomerAppLiveVersion', function(req, res) {
       //console.log('Update drivers Geolocation');
       res.send('1007');
         });

app.post('/push', function(req, res) { 

            var Tokens = req.body.token;
            var msg = req.body.msg;

                var message = {
                      data: {
                        title : 'Indian Drivers',
                        body : msg,
                        style: 'inbox',
                        soundname: 'default',
                        summaryText: 'There are %n% notifications from Indian Drivers',
                        vibrationPattern: '[2000, 1000, 500, 500]'
                      }
                    };
            FCM.sendToMultipleToken(message, Tokens, function(err, response) {
           // FCM.send(message, function(err, response) {
                if(err){
                    console.log('error found', err);
                }else {
                    console.log('response here', response);
                }
                res.send(response);
            });

            
                  // 
         });




    
  
    app.post('/cronJobForAdminApp', function(req, res) {

        var driver = null;
        var booking = null;
        var status1 = 'On Duty';
        var status4 = 'Line Up';
        var driverStatus = 'Active';
        var obj = [];
        var sql = 'select conuser_id, driver_details.id as "driver_id", driver_details.is_luxury,cu.first_name, cu.last_name, cu.mobile_number, cu.address, ' +
            'bookings.reporting_date, bookings.id as "booking_id", bookings.status,bookings.start_off_duty, bookings.car_type,' +
            'cu.address_lat,cu.address_long, bookings.reporting_date from ' +
            'driver_details full join bookings on ((driver_details.id=bookings.driver_id ' +
            'and current_date = bookings.reporting_date)  or ' +
            '(driver_details.id=bookings.driver_id and (bookings.status = \'' + status1 + '\' ' +
            'or bookings.status = \'' + status4 + '\') ) ) ' +
            ', con_users cu ' +
            'where cu.id = conuser_id and cu.status = \'' + driverStatus + '\'';

        console.log('Query is ' + sql);

        app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error inserting transaction ...');
                console.log(err);
                return err;
            }
            console.log('****Output is:****' +
                JSON.stringify(result));

            driver = result;

            var status2 = 'New Booking';
            var status3 = 'Line Up';
            var status5 = 'Done';

            var sql = 'select driver_details.id as driver_id, bookings.reporting_date, bookings.car_type,' +
                'bookings.id, bookings.status,bookings.start_off_duty, ' +
                'bookings.driver_id, bookings.from_lat,bookings.from_long from ' +
                'driver_details right join bookings  on (driver_details.id =  bookings.driver_id ' +
                'and bookings.reporting_date <= current_date) where ' +
                '(bookings.status = \'' + status2 + '\' or bookings.status = \'' + status3 + '\' or bookings.status = \'' + status5 + '\')';
            console.log('Query is ' + sql);

            app.datasources.postgres.connector.query(sql, function(err, result) {
                if (err) {
                    console.log('Error inserting transaction ...');
                    console.log(err);
                    return err;
                }
                console.log('++++++Booking is:+++++' +
                    JSON.stringify(result));
                //io.sockets.emit('adminAppSocket', result);
                booking = result;
                obj = [{
                    "driver": driver,
                    "booking": booking
                }];
                res.send(obj);

            });

        });

    });

    app.post('/updateInvoiceOnStartAndOffDuty', function(req, res) {
        var requestFrom = req.body.requestFrom;
        var bookingId = req.body.bookingId;
        var distanceBetweenPickupAndDrop=req.body.distanceBetweenPickupAndDrop;
        var status = 'Cancelled';

        var sql1 = 'select * from bookings where status  = \'' + status + '\' and id = ' + bookingId;
        console.log(sql1);

        app.datasources.postgres.connector.query(sql1, function(err, result) {
            if (err) {
                console.log('Error fetching invoices...');
                console.log(err);
                return err;
            }

            console.log('result : ' + JSON.stringify(result));

            if (result.length > 0) {
                res.send('Duty is Cancelled');
            } else {

                var sql;

                sql = 'select * from invoices where booking_id  = ' + bookingId;

                console.log('sql query : ' + sql);


                app.datasources.postgres.connector.query(sql, function(err, result) {
                    if (err) {
                        console.log('Error fetching invoices...');
                        console.log(err);
                        return err;
                    }

                    console.log('result : ' + JSON.stringify(result));


                    if (result.length <= 0) {
                        res.send('No Data Found');
                        return false;
                    }

                    var currDate = new Date();
                    var d1, m1, y1;
                    var currTime;

                    if (currDate.getDate() < 9) {
                        d1 = '0' + currDate.getDate();
                    } else {
                        d1 = currDate.getDate();
                    }

                    if (currDate.getMonth() < 9) {
                        m1 = '0' + currDate.getMonth();
                        m1 = Number(m1) + 1;
                    } else {
                        m1 = currDate.getMonth();
                        m1 = Number(m1) + 1;
                    }

                    y1 = currDate.getFullYear();

                    currTime = currDate.getHours() + ':' + currDate.getMinutes();

                    currDate = y1 + '/' + m1 + '/' + d1;

                    console.log('Current date and Time ' + currDate + ':' + currTime);

                    if (requestFrom === 'ADMIN_OFF') {
                        currDate = req.body.offDutyDate;
                        currTime = req.body.offDutyTime;

                        console.log('Current date and Time If request From Admin' + currDate + ':' + currTime);
                    }

                    for (var i = 0; i < result.length; i++) {

                        var rptDate = new Date(result[i].reporting_date);
                        var invoiceId = result[i].id;
                        var bId = result[i].booking_id;
                        var carType = result[i].car_type;
                        var isRoundTrip = result[i].is_round_trip;
                        var isOutstation = result[i].is_outstation;
                        var rptTime = result[i].reporting_time;
                        var pickLocation = result[i].pickup_location;
                        var pickLat = result[i].pickup_lat;
                        var pickLong = result[i].pickup_long;
                        var dropLocation = result[i].drop_location;
                        var dropLat = result[i].drop_lat;
                        var dropLong = result[i].drop_long;
                        var createdBy = result[i].created_by;
                        // if(requestFrom === 'ADMIN_START'){
                        //     currDate = result[i].releaving_date;
                        //     currTime = result[i].releaving_time;
                        // }else if(requestFrom === 'DRIVER_START'){
                        //     currDate = result[i].releaving_date;
                        //     currTime = result[i].releaving_time;
                        // }
                        if (rptDate.getDate() < 9) {
                            d1 = '0' + rptDate.getDate();
                        } else {
                            d1 = rptDate.getDate();
                        }

                        if (rptDate.getMonth() < 9) {
                            m1 = rptDate.getMonth() + 1;
                        } else {
                            m1 = rptDate.getMonth() + 1;
                        }

                        y1 = rptDate.getFullYear();

                        rptDate = y1 + '/' + m1 + '/' + d1;
                        var returnTravelTime = 0;
                        console.log('Reporting date and time ' + rptDate);

                        // send the result over the socket for that booking
                        //sql = 'select invoice_head_id as "invoiceHeadId", invoice_head_name as "invoiceHeadName", amount, booking_id as "bookingId" from update_invoice_details(' + result[i].id + ',' + result[i].booking_id + ',\'' + result[i].car_type + '\',' + result[i].is_round_trip + ',' + result[i].is_outstation + ',\'' + rptDate + '\',\'' + result[i].reporting_time + '\',\'' + currDate + '\',\'' + currTime + '\',\'' + result[i].pickup_location + '\',' + result[i].pickup_lat + ',' + result[i].pickup_long + ',\'' + result[i].drop_location + '\',' + result[i].drop_lat + ',' + result[i].drop_long + ',' + result[i].created_by + ')';
                                    returnTravelTime = 0;
                                
                                console.log('returnTravelTime ' + JSON.stringify(returnTravelTime));

                                sql = 'select total_amount as "amount", booking_id as "bookingId" from update_invoice_details(' + invoiceId + ',' + bId + ',\'' + carType + '\',' + isRoundTrip + ',' + isOutstation + ',\'' + rptDate + '\',\'' + rptTime + '\',\'' + currDate + '\',\'' + currTime + '\',\'' + pickLocation + '\',' + pickLat + ',' + pickLong + ',\'' + dropLocation + '\',' + dropLat + ',' + dropLong + ',' + createdBy + ',' + returnTravelTime + ',' + distanceBetweenPickupAndDrop +')';

                                console.log('Insert sql : ' + sql);

                                app.datasources.postgres.connector.query(sql, function(err, response) {
                                    if (err) {
                                        console.log('Error inserting transaction ...');
                                        console.log(err);
                                        return err;
                                    }
                                    console.log('response : ' + JSON.stringify(response));

                                   // response[0].lat = 0;
                                   // response[0].lng = 0;
                                    io.sockets.emit('curent_booking_socket_' + response[0].bookingId, response);
                                    console.log('Booking Id' + response[0].bookingId + 'Object' + JSON.stringify(result));
                                    res.send(response);
                                });
                            

                    }

                 //   res.send('Details updated successfully.');


                });

            }
        });

    });

    app.get('/transactionJobForAnalysis', function() {
        var sql;

        sql = 'select * from data_analysis_function()';

        console.log('sql query : ' + sql);
        //console.log(JSON.stringify(result));

        app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in analysis transactionjob...');
                console.log(err);
                return err;
            }

            console.log('analysis result : ' + JSON.stringify(result));

           io.sockets.emit('analysis_result_socket_' + result, result);
            


        });


    });

     app.get('/transactionJobForAnalysisAurangabad', function() {
        var sql;

        sql = 'select * from data_analysis_function_aurangabad()';

        app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in analysis transactionjob...');
                console.log(err);
                return err;
            }

            //console.log('analysis result : ' + JSON.stringify(result));

           io.sockets.emit('analysis_result_socket_' + result, result);
            


        });

    });

};
