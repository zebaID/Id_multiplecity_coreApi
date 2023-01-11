var rest = require('restler');
var consts = require('../../server/consts');

module.exports = function(Bookings) {

    Bookings.getAllDrivers = function(bookingDate, bookingId, limit, start, radius, cb) {
        // sql query
        var sql = 'SELECT "conUserId", "driverId","firstName","middleName", "lastName","status","deviceId","deviceName",  latitude, longitude,  CAST(distance AS DECIMAL(10,2)) as "distance" ' +
            'FROM ( ' +
            'SELECT z.id as "conUserId", ' +
            'd.id as "driverId", ' +
            'z.first_name as "firstName", z.middle_name as "middleName", ' +
            'z.last_name as "lastName", ' +
            'cb.driverStatus as "driverStatus", ' +
            'COALESCE(cb.driverStatus,\'idle\') as "status", ' +
            'COALESCE(ud.deviceId,null) as "deviceId", ' +
            'COALESCE(ud.deviceName,null) as "deviceName", ' +
            'z.address_lat as latitude, z.address_long as longitude, ' +
            ' p.radius, ' +
            'p.distance_unit ' +
            '* DEGREES(ACOS(COS(RADIANS(p.latpoint)) ' +
            '* COS(RADIANS(z.address_lat)) ' +
            '* COS(RADIANS(p.longpoint - z.address_long)) ' +
            ' +SIN(RADIANS(p.latpoint)) ' +
            '* SIN(RADIANS(z.address_lat)))) AS distance ' +
            'FROM driver_details AS d ' +
            'left join(select \'busy\'::text as driverStatus, driver_id from bookings where start_off_duty = false  and driver_id <> 0 and to_char(booking_date,\'dd/MM/yyyy\') = \'' + bookingDate + '\')cb on(cb.driver_id = d.id) ' +
            ' , con_users AS z ' +
            'left join(select device_id as deviceId,device_type as deviceName,conuser_id from user_devices )ud on(ud.conuser_id = z.id) ' +
            ' JOIN ( ' +
            'SELECT  (select from_lat as latitude from bookings where id = ' + bookingId + ' ) AS latpoint, ' +
            ' (select from_long as longitude from bookings where id = ' + bookingId + ' ) AS longpoint, ' +
            ' ' + radius + ' AS radius, 111.045 AS distance_unit ' +
            ') AS p ON 1=1 ' +
            'WHERE z.id = d.conuser_id and ' +
            'z.address_lat ' +
            'BETWEEN p.latpoint  - (p.radius / p.distance_unit) ' +
            'AND p.latpoint  + (p.radius / p.distance_unit) ' +
            'AND z.address_long ' +
            'BETWEEN p.longpoint - (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint)))) ' +
            'AND p.longpoint + (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint)))) ' +

            'group by "conUserId","driverId","firstName","middleName", "lastName","deviceId","deviceName", cb.driverStatus, "status" ,z.address_lat, z.address_long,p.radius,distance)as d ' +
            'WHERE distance <= radius and status = \'idle\' ' +
            'ORDER BY  distance asc ' +
            'LIMIT  ' + limit + ' ' +
            'OFFSET   (' + start + ' - 1); ';


        console.log('Error getting bookings ...' + sql);

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'getAllDrivers', {
            accepts: [{
                arg: 'bookingDate',
                type: 'string',
                required: true
            }, {
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'limit',
                type: 'string',
                required: true
            }, {
                arg: 'start',
                type: 'string',
                required: true
            }, {
                arg: 'radius',
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

    Bookings.getAllBookings = function(cb) {
        // sql query
        var sql = '(select b.id as "bookingId",b.customer_id as "customerId",b.booking_date as "bookingDate", b.reporting_date as "reportingDate", ' +
            'b.reporting_time as "reportingTime", b.from_lat as "latitude", b.from_long as "longitude", b.is_outstation as "isOutstation",  ' +
            'driver_id as "bookingDriverId", b.status as "status", car_type as "carType", is_round_trip as "isRoundTrip", dd.id as "driverId", ' +
            'b.pick_address as "pickAddress",b.drop_address as "dropAddress", ' +
            'dd.is_luxury as "isLuxury", cu.first_name ||cu.last_name as "driverName",cu.mobile_number as "driverContact", ' +
            'cu.address as "driverAddress",cu.address_lat as "addressLat",cu.address_long as "addressLong"  ' +
            'from bookings b , driver_details dd, con_users cu ' +
            'where reporting_date = current_date ' +
            ' and b.driver_id = dd.id ' +
            ' and dd.conuser_id = cu.id  and b.status =  \'Line Up\' ' +
            ') ' +
            'Union ( ' +
            'select b.id as "bookingId",b.customer_id as "customerId",b.booking_date as "bookingDate", b.reporting_date as "reportingDate",  ' +
            ' b.reporting_time as "reportingTime", b.from_lat as "latitude", b.from_long as "longitude", b.is_outstation as "isOutstation", ' +
            ' driver_id as "bookingDriverId", b.status as "status", car_type as "carType", is_round_trip as "isRoundTrip", null,  ' +
            ' b.pick_address as "pickAddress",b.drop_address as "dropAddress",  ' +
            ' null, null,null,  ' +
            ' null,null,null ' +
            ' from bookings b  ' +
            ' where reporting_date = current_date ' +
            ' and b.status = \'New Booking\'  ' +
            ')  ' +
            'UNION ' +
            '( ' +
            'select null,null,null, null, ' +
            'null, null, null, null,  ' +
            'dd.id as "bookingDriverId", null, null, null, dd.id,  ' +
            'null,null,null,  ' +
            'cu.first_name ||\'  \' || cu.last_name as "driverName",cu.mobile_number as "driverContact",  ' +
            'cu.address as "driverAddress",cu.address_lat as "addressLat",cu.address_long as "addressLong"  ' +
            'from driver_details dd , con_users cu  ' +
            'where dd.conuser_id = cu.id and dd.id not in ( ' +
            'select driver_id from bookings where reporting_date = current_date and status =  \'Line Up\'   ' +
            '  ) )';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'getAllBookings', {

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
      Bookings.getBookings = function(operationCity, cb) {
        // sql quer
        if(operationCity === 'All'){
       var sql = 'SELECT id, customer_name, car_type, is_outstation as duty_type, trip_type, concat(landmark || \' \' || pick_address) as reporting_location, status, driver_name, rate_count, reporting_date, reporting_time, driver_share, id_share, payment_method, driver_id, role_id FROM bookings WHERE  reporting_date >= current_date - interval \' 1 day\' order by reporting_date DESC';
   }else{
      var sql = 'SELECT id, customer_name, car_type, is_outstation as duty_type, trip_type, concat(landmark || \' \' || pick_address) as reporting_location, status, driver_name, rate_count, reporting_date, reporting_time, driver_share, id_share, payment_method, driver_id, role_id FROM bookings WHERE  reporting_date >= current_date - interval \' 1 day\' and operation_city = \'' + operationCity + '\'order by reporting_date DESC';
   } 

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'getBookings', {
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
    Bookings.getInvitedBooking = function(driverId, cb) {
        // sql query
        var sql = 'select * from bookings as b,booking_invites as bi where bi.driver_id = ' + driverId + ' ' +
            'and bi.status = \'Invited\' and bi.booking_id = b.id and cast(b.reporting_date as date) = cast(now() as date)';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'getInvitedBooking', {
            accepts: [{
                arg: 'driverId',
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

  Bookings.createNewBooking = function(carType, isRoundTrip, isOutstation, reportingDate, reportingTime, releivingDate, releivingTime, releavingDuration, landmark, pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, cityName, cityLat, cityLng, totalAmount, customerId, userId, paymentMethod, operationCity, dutyBasis, extraCharges,distanceBetweenPickupAndDrop, cb) {

       
        var dLat;
        var dLong;
        var cLat;
      var cLong;
         var pickAddress1 = pickupAddress;
        pickAddress1 = pickAddress1.replace(/, Maharashtra/g, '');
        pickAddress1 = pickAddress1.replace(/, India/g, '');
        console.log('pickAddress1' + JSON.stringify(pickAddress1));
            var city = operationCity;
        var dropAddress1 = dropAddress;
        dropAddress1 = dropAddress1.replace(/, Maharashtra/g, '');
        dropAddress1 = dropAddress1.replace(/, India/g, '');
        console.log('dropAddress1' + JSON.stringify(dropAddress1));

                        // dropLat =  0;
                      //  dropLng =  0;
                                   //  cityLat = 0;
                                  //  cityLng =0;

                               
                        var returnTravelTime = 0;
                                 console.log('returnTravelTime ' + JSON.stringify(returnTravelTime));

                                
 


                                var sql = 'select * from create_booking(\'' + carType + '\', ' + isRoundTrip + ', ' + isOutstation + ', \'' + reportingDate + '\', \'' + reportingTime + '\', \'' + releivingDate + '\', \'' + releivingTime + '\', ' + releavingDuration + ', \'' + landmark + '\', \'' + pickAddress1 + '\', ' + pickupLat + ', ' + pickupLng + ', \'' + dropAddress1 + '\', ' + dropLat + ', ' + dropLng + ', \'' + cityName + '\', ' + cityLat + ', ' + cityLng + ', ' + totalAmount + ', ' + customerId + ', ' + userId + ', \'' + paymentMethod + '\',' + returnTravelTime + ', \'' + city + '\', \'' + dutyBasis + '\', ' + extraCharges + ', ' + distanceBetweenPickupAndDrop + ')';

                                // call sql query from postreSQL
                                Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
                                    if (err) {
                                        console.log('Error creating new booking ...');
                                        console.log(err);
                                        return cb(err);
                                    } else {

                                        if(result[0].create_booking !== 'undefined'){
                                             var sql1 = 'select cd.customer_type, cu.first_name, cu.last_name, cu.mobile_number from con_users cu,customer_details cd where cd.conuser_id = cu.id and cd.id = '+ customerId +'';
                                        Bookings.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                                            if (err) {
                                                console.log('Error selecting customer type ...');
                                                console.log(err);
                                                return cb(err);
                                            } else {
                                                console.log('customer type: ' +JSON.stringify(result1));
                                                console.log('booking result: ' +JSON.stringify(result));
                                                var bId = parseInt(result[0].create_booking);
                                                console.log('booking Id: ' +bId);

                                                if(result1[0].customer_type === null){
                                                    var c_type = 'O';
                                                }else{
  
                                                    var c_type = result1[0].customer_type;
                                                }

                                                 var customer_name = result1[0].first_name + ' ' + result1[0].last_name;
                                                var contact_number = result1[0].mobile_number;
                                                var msg = 'Dear' + customer_name + ',%0a Pls update your phonebook with new number 020-67641000 Team, Indian Drivers.'
                                                //sendMessage(contact_number, msg);

                                                    if (city ==='Aurangabad'){
                                                            
                                                            var contactNumber = '9225585100';
                                                     var msg = 'Booking ID' + bId +'is created by customer in Aurangabad location';
                                                        sendMessage(contactNumber , msg);
                                                        }


                                                var sql2 = 'update bookings set trip_type = \''+ c_type +'\' where id = '+ bId +'';
                                                Bookings.app.datasources.postgres.connector.query(sql2, function(err, result2) {
                                                    if (err) {
                                                        console.log('Error updating new booking ...');
                                                        console.log(err);
                                                        return cb(err);
                                                    } else {

                                               
                                                        cb(err, result);
                                                        c
                                                    }
                                                });
                                                //cb(err, result);
                                            }
                                        });

                                        } 
                                       

                                    }


                                });

 

        //});

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'createNewBooking', {
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
                arg: 'reportingDate',
                type: 'string',
                required: true
            }, {
                arg: 'reportingTime',
                type: 'string',
                required: true
            }, {
                arg: 'releivingDate',
                type: 'string',
                required: true
            }, {
                arg: 'releivingTime',
                type: 'string',
                required: true
            }, {
                arg: 'releavingDuration',
                type: 'string',
                required: true
            }, {
                arg: 'landmark',
                type: 'string',
                required: false
            }, {
                arg: 'pickupAddress',
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
                arg: 'dropAddress',
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
                arg: 'cityName',
                type: 'string',
                required: true
            }, {
                arg: 'cityLat',
                type: 'string',
                required: true
            }, {
                arg: 'cityLng',
                type: 'string',
                required: true
            }, {
                arg: 'totalAmount',
                type: 'string',
                required: true
            }, {
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
                type: 'string',
                required: true
            }, {
                arg: 'paymentMethod',
                type: 'string',
                required: false
            }, {
                arg: 'operationCity',
                type: 'string',
                required: false
            }, {
                arg: 'dutyBasis',
                type: 'string',
                required: false
            }, {
                arg: 'extraCharges',
                type: 'string',
                required: false
            }, {
                arg: 'distanceBetweenPickupAndDrop',
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

        Bookings.createNewBookingPromocode = function(carType, isRoundTrip, isOutstation, reportingDate, reportingTime, releivingDate, releivingTime, releavingDuration, landmark, pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, cityName, cityLat, cityLng, totalAmount, customerId, userId, paymentMethod, operationCity, promoCode, cb) {
console.log('createNewBooking1');
       
        var dLat;
        var dLong;
        var cLat;
        var cLong;
         var pickAddress1 = pickupAddress;
        pickAddress1 = pickAddress1.replace(/, Maharashtra/g, '');
        pickAddress1 = pickAddress1.replace(/, India/g, '');
        console.log('pickAddress1' + JSON.stringify(pickAddress1));
            var city = operationCity;
        var dropAddress1 = dropAddress;
        dropAddress1 = dropAddress1.replace(/, Maharashtra/g, '');
        dropAddress1 = dropAddress1.replace(/, India/g, '');
        console.log('dropAddress1' + JSON.stringify(dropAddress1));

                         dropLat =  0;
                        dropLng =  0;
                                     cityLat = 0;
                                    cityLng =0;

                               
                        var returnTravelTime = 0;
                                 console.log('returnTravelTime ' + JSON.stringify(returnTravelTime));

                                
 


                                var sql = 'select * from create_booking_promocode(\'' + carType + '\', ' + isRoundTrip + ', ' + isOutstation + ', \'' + reportingDate + '\', \'' + reportingTime + '\', \'' + releivingDate + '\', \'' + releivingTime + '\', ' + releavingDuration + ', \'' + landmark + '\', \'' + pickAddress1 + '\', ' + pickupLat + ', ' + pickupLng + ', \'' + dropAddress1 + '\', ' + dropLat + ', ' + dropLng + ', \'' + cityName + '\', ' + cityLat + ', ' + cityLng + ', ' + totalAmount + ', ' + customerId + ', ' + userId + ', \'' + paymentMethod + '\',' + returnTravelTime + ', \'' + city + '\', \'' + promoCode + '\')';

                                // call sql query from postreSQL
                                Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
                                    if (err) {
                                        console.log('Error creating new booking ...');
                                        console.log(err);
                                        return cb(err);
                                    } else {

                                        if(result[0].create_booking_promocode !== 'undefined'){
                                             var sql1 = 'select cd.customer_type, cu.first_name, cu.last_name, cu.mobile_number from con_users cu,customer_details cd where cd.conuser_id = cu.id and cd.id = '+ customerId +'';
                                        Bookings.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                                            if (err) {
                                                console.log('Error selecting customer type ...');
                                                console.log(err);
                                                return cb(err);
                                            } else {
                                                console.log('customer type: ' +JSON.stringify(result1));
                                                console.log('booking result: ' +JSON.stringify(result));
                                                var bId = parseInt(result[0].create_booking_promocode);
                                                console.log('booking Id: ' +bId);

                                                if(result1[0].customer_type === null){
                                                    var c_type = 'O';
                                                }else{
  
                                                    var c_type = result1[0].customer_type;
                                                }

                                                 var customer_name = result1[0].first_name + ' ' + result1[0].last_name;
                                                var contact_number = result1[0].mobile_number;
                                                var msg = 'Dear' + customer_name + ',%0a Pls update your phonebook with new number 020-67641000 Team, Indian Drivers.'
                                                //sendMessage(contact_number, msg);

                                                    if (city ==='Aurangabad'){
                                                            
                                                            var contactNumber = '9225585100';
                                                     var msg = 'Booking ID' + bId +'is created by customer in Aurangabad location';
                                                        sendMessage(contactNumber , msg);
                                                        }


                                                var sql2 = 'update bookings set trip_type = \''+ c_type +'\' where id = '+ bId +'';
                                                Bookings.app.datasources.postgres.connector.query(sql2, function(err, result2) {
                                                    if (err) {
                                                        console.log('Error updating new booking ...');
                                                        console.log(err);
                                                        return cb(err);
                                                    } else {

                                               
                                                        cb(err, result);
                                                        
                                                    }
                                                });
                                                //cb(err, result);
                                            }
                                        });

                                        } 
                                       

                                    }


                                });

 

        //});

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'createNewBookingPromocode', {
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
                arg: 'reportingDate',
                type: 'string',
                required: true
            }, {
                arg: 'reportingTime',
                type: 'string',
                required: true
            }, {
                arg: 'releivingDate',
                type: 'string',
                required: true
            }, {
                arg: 'releivingTime',
                type: 'string',
                required: true
            }, {
                arg: 'releavingDuration',
                type: 'string',
                required: true
            }, {
                arg: 'landmark',
                type: 'string',
                required: false
            }, {
                arg: 'pickupAddress',
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
                arg: 'dropAddress',
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
                arg: 'cityName',
                type: 'string',
                required: true
            }, {
                arg: 'cityLat',
                type: 'string',
                required: true
            }, {
                arg: 'cityLng',
                type: 'string',
                required: true
            }, {
                arg: 'totalAmount',
                type: 'string',
                required: true
            }, {
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
                type: 'string',
                required: true
            }, {
                arg: 'paymentMethod',
                type: 'string',
                required: false
            }, {
                arg: 'operationCity',
                type: 'string',
                required: false
            }, {
                arg: 'promoCode',
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

   Bookings.newCustomerCreateBooking = function(email, firstName, middleName, lastName, mobileNumber, status, addressLandmark, address, addressLat, addressLong, userId, carType, isRoundTrip, isOutstation, reportingDate, reportingTime, releivingDate, releivingTime, releavingDuration, pickupLandmark, pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, cityName, cityLat, cityLng, totalAmount, userId1, paymentMethod, remark, tripType, operationCity, dutyBasis, extraCharges, distance,cb) {

   /* var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + pickupAddress + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    var mapUrl1 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + dropAddress + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    var mapUrl2 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    
   */ var dLat=0;
    var dLong=0;
    var cLat=0;
    var cLong=0;
    var result = [];
    var result1 = [];
    var result2 = [];
     

        var pickAddress1 = pickupAddress;
        pickAddress1 = pickAddress1.replace(/, Maharashtra/g, '');
        pickAddress1 = pickAddress1.replace(/, India/g, '');
        var dropAddress1 = dropAddress;
        dropAddress1 = dropAddress1.replace(/, Maharashtra/g, '');
        dropAddress1 = dropAddress1.replace(/, India/g, '');
        
             // dropLat =  0;
               // dropLng =  0;



                    // cityLat = 0;
                   // cityLng = 0;
                   
                var returnTravelTime = 0;
                var city = operationCity;
                     var ConUsers = Bookings.app.models.ConUsers;

                    var sql = 'select * from new_customer_create_booking(\'' + email + '\', \'' + firstName + '\', \'' + middleName + '\', \'' + lastName + '\', \'' + mobileNumber + '\', \'' + status + '\', \'' + addressLandmark + '\', \'' + address + '\', ' + addressLat + ', ' + addressLong + ',' + userId + ',\'' + carType + '\', ' + isRoundTrip + ', ' + isOutstation + ', \'' + reportingDate + '\', \'' + reportingTime + '\', \'' + releivingDate + '\', \'' + releivingTime + '\', ' + releavingDuration + ', \'' + pickupLandmark + '\', \'' + pickAddress1 + '\', ' + pickupLat + ', ' + pickupLng + ', \'' + dropAddress1 + '\', ' + dropLat + ', ' + dropLng + ', \'' + cityName + '\', ' + cityLat + ', ' + cityLng + ', ' + totalAmount + ', ' + userId1 + ', \'' + paymentMethod + '\', \'' + remark + '\',' + returnTravelTime + ', \'' + tripType + '\',\'' + city + '\',\'' + dutyBasis + '\' ,' + extraCharges +' ,' + distance + ')';

                    // call sql query from postreSQL
                    Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
                      if (err) {
                        console.log('Error creating new booking ...');
                        console.log(err);
                        return cb(err);
                      } else {
                        cb(err, result);


                      }

                    });


   };

  Bookings.remoteMethod(
    'newCustomerCreateBooking', {
      accepts: [{
        arg: 'email',
        type: 'string',
        required: true
      }, {
        arg: 'firstName',
        type: 'string',
        required: true
      }, {
        arg: 'middleName',
        type: 'string',
        required: false
      }, {
        arg: 'lastName',
        type: 'string',
        required: true
      }, {
        arg: 'mobileNumber',
        type: 'string',
        required: true
      }, {
        arg: 'status',
        type: 'string',
        required: true
      }, {
        arg: 'addressLandmark',
        type: 'string',
        required: false
      }, {
        arg: 'address',
        type: 'string',
        required: true
      }, {
        arg: 'addressLat',
        type: 'string',
        required: true
      }, {
        arg: 'addressLong',
        type: 'string',
        required: true
      }, {
        arg: 'userId',
        type: 'string',
        required: true
      }, {
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
        arg: 'reportingDate',
        type: 'string',
        required: true
      }, {
        arg: 'reportingTime',
        type: 'string',
        required: true
      }, {
        arg: 'releivingDate',
        type: 'string',
        required: true
      }, {
        arg: 'releivingTime',
        type: 'string',
        required: true
      }, {
        arg: 'releavingDuration',
        type: 'string',
        required: true
      }, {
        arg: 'pickupLandmark',
        type: 'string',
        required: false
      }, {
        arg: 'pickupAddress',
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
        arg: 'dropAddress',
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
        arg: 'cityName',
        type: 'string',
        required: true
      }, {
        arg: 'cityLat',
        type: 'string',
        required: true
      }, {
        arg: 'cityLng',
        type: 'string',
        required: true
      }, {
        arg: 'totalAmount',
        type: 'string',
        required: true
      }, {
        arg: 'userId1',
        type: 'string',
        required: true
      }, {
        arg: 'paymentMethod',
        type: 'string',
        required: false
      }, {
        arg: 'remark',
        type: 'string',
        required: false
      }, {
        arg: 'tripType',
        type: 'string',
        required: false
      }, {
        arg: 'operationCity',
        type: 'string',
        required: false
      }, {
        arg: 'dutyBasis',
        type: 'string',
        required: false
        }, {
        arg: 'extraCharges',
        type: 'string',
        required: false
        }, {
        arg: 'distance',
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


    Bookings.createBookingForAdmin = function(carType, isRoundTrip, isOutstation, reportingDate, reportingTime, releivingDate, releivingTime, releavingDuration, landmark, pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, cityName, cityLat, cityLng, totalAmount, customerId, userId, paymentMethod, remark, tripType, operationCity, dutyBasis, extraCharges, distance, cb) {
    var dLat;
    var dLong;
    var cLat;
    var cLong;
   // var result1 = [];
   // var result2 = [];

    var pickAddress1 = pickupAddress;
    pickAddress1 = pickAddress1.replace(/, Maharashtra/g, '');
    pickAddress1 = pickAddress1.replace(/, India/g, '');
    var dropAddress1 = dropAddress;
    dropAddress1 = dropAddress1.replace(/, Maharashtra/g, '');
    dropAddress1 = dropAddress1.replace(/, India/g, '');

            // dropLat =0;//dLat = mapData.results[0].geometry.location.lat;
           // dropLng = 0;//dLong = mapData.results[0].geometry.location.lng;

                    // cityLat = 0;
                   // cityLng = 0; 
            var returnTravelTime = 0;
            
          var city = operationCity; //Ahmed added for testing purpose.

          console.log("CITY:"+ city);
                 var sql = 'select * from create_booking_for_admin(\'' + carType + '\', ' + isRoundTrip + ', ' + isOutstation + ', \'' + reportingDate + '\', \'' + reportingTime + '\', \'' + releivingDate + '\', \'' + releivingTime + '\', ' + releavingDuration + ', \'' + landmark + '\', \'' + pickAddress1 + '\', ' + pickupLat + ', ' + pickupLng + ', \'' + dropAddress1 + '\', ' + dropLat + ', ' + dropLng + ', \'' + cityName + '\', ' + cityLat + ', ' + cityLng + ', ' + totalAmount + ', ' + customerId + ', ' + userId + ', \'' + paymentMethod + '\', \'' + remark + '\',' + returnTravelTime + ', \'' + tripType + '\', \'' + city + '\',\'' + dutyBasis + '\',' + extraCharges + ',' + distance + ')';

                Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
                  if (err) {
                    console.log('Error creating new booking ...');
                    console.log(err);
                    return cb(err);
                  }
                  cb(err, result);
                });
   

  };


  Bookings.remoteMethod(
    'createBookingForAdmin', {
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
        arg: 'reportingDate',
        type: 'string',
        required: true
      }, {
        arg: 'reportingTime',
        type: 'string',
        required: true
      }, {
        arg: 'releivingDate',
        type: 'string',
        required: true
      }, {
        arg: 'releivingTime',
        type: 'string',
        required: true
      }, {
        arg: 'releavingDuration',
        type: 'string',
        required: true
      }, {
        arg: 'landmark',
        type: 'string',
        required: false
      }, {
        arg: 'pickupAddress',
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
        arg: 'dropAddress',
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
        arg: 'cityName',
        type: 'string',
        required: true
      }, {
        arg: 'cityLat',
        type: 'string',
        required: true
      }, {
        arg: 'cityLng',
        type: 'string',
        required: true
      }, {
        arg: 'totalAmount',
        type: 'string',
        required: true
      }, {
        arg: 'customerId',
        type: 'string',
        required: true
      }, {
        arg: 'userId',
        type: 'string',
        required: true
      }, {
        arg: 'paymentMethod',
        type: 'string',
        required: false
      }, {
        arg: 'remark',
        type: 'string',
        required: false
      }, {
        arg: 'tripType',
        type: 'string',
        required: false
      }, {
        arg: 'operationCity',
        type: 'string',
        required: false
      }, {
        arg: 'dutyBasis',
        type: 'string',
        required: false
    }, {
        arg: 'extraCharges',
        type: 'string',
        required: false
    }, {
        arg: 'distance',
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


  Bookings.websiteCustomerCreateBooking = function(email, firstName, middleName, lastName, mobileNumber, status, addressLandmark, address, addressLat, addressLong, userId, carType, isRoundTrip, isOutstation, reportingDate, reportingTime, releivingDate, releivingTime, releavingDuration, pickupLandmark, pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, cityName, cityLat, cityLng, totalAmount, userId1, paymentMethod, remark, tripType, operationCity, dutyBasis, extraCharges, cb) {

   /* var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + pickupAddress + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    var mapUrl1 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + dropAddress + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    var mapUrl2 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    
   */
  /* var result = [];
      var ConUsers = Bookings.app.models.ConUsers;
       var CustomerDetails = ConUsers.app.models.CustomerDetails;
    var UserRoles = ConUsers.app.models.UserRoles;
   ConUsers.create({
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            username: mobileNumber,
            password: mobileNumber,
            email: email,
            address: addressLandmark,
            addressLine2: address,
            addressLat: addressLat,
            addressLong: addressLong,
            createdBy: userId,
            status: status,
            operationCity: operationCity

          },
          function(err, newConUser) {
            result.push(newConUser);
            if (newConUser != null) {
              CustomerDetails.create({
                conuserId: newConUser.id,
                createdBy: userId,
                customerType: 'O'
              }, function(custErr, custData) {

                result.push(custData);
                if (custData != null) {

                }

                UserRoles.create({
                  conuserId: newConUser.id,
                  roleId: 2,
                  createdBy: userId
                }, function(roleErr, roleData) {

                    
                  
                  //cb(roleErr, result);
                });
              });
            } else {
              cb(err);
            }
          });*/

   var dLat=0;
    var dLong=0;
    var cLat=0;
    var cLong=0;
    var result = [];
    var result1 = [];
    var result2 = [];
    var sql_count = 'select exists(select mobile_number from con_users c, customer_details cd where c.id = cd.conuser_id and c.mobile_number =\'' + mobileNumber + '\')';
    var sql1 = 'select cd.id from con_users c, customer_details cd where c.id = cd.conuser_id and c.mobile_number =\'' + mobileNumber + '\''; 
     

        var pickAddress1 = pickupAddress;
        pickAddress1 = pickAddress1.replace(/, Maharashtra/g, '');
        pickAddress1 = pickAddress1.replace(/, India/g, '');
        var dropAddress1 = dropAddress;
        dropAddress1 = dropAddress1.replace(/, Maharashtra/g, '');
        dropAddress1 = dropAddress1.replace(/, India/g, '');
        
              dropLat =  0;
                dropLng =  0;



                     cityLat = 0;
                    cityLng = 0;
                   
                var returnTravelTime = 0;
                var city = operationCity;
                     

                    var sql = 'select * from new_customer_create_booking(\'' + email + '\', \'' + firstName + '\', \'' + middleName + '\', \'' + lastName + '\', \'' + mobileNumber + '\', \'' + status + '\', \'' + addressLandmark + '\', \'' + address + '\', ' + addressLat + ', ' + addressLong + ',' + userId + ',\'' + carType + '\', ' + isRoundTrip + ', ' + isOutstation + ', \'' + reportingDate + '\', \'' + reportingTime + '\', \'' + releivingDate + '\', \'' + releivingTime + '\', ' + releavingDuration + ', \'' + pickupLandmark + '\', \'' + pickAddress1 + '\', ' + pickupLat + ', ' + pickupLng + ', \'' + dropAddress1 + '\', ' + dropLat + ', ' + dropLng + ', \'' + cityName + '\', ' + cityLat + ', ' + cityLng + ', ' + totalAmount + ', ' + userId1 + ', \'' + paymentMethod + '\', \'' + remark + '\',' + returnTravelTime + ', \'' + tripType + '\',\'' + city + '\',\'' + dutyBasis + '\' ,' + extraCharges + ')';
                        Bookings.app.datasources.postgres.connector.query(sql_count, function(err, result) {
                      if (err) {
                        console.log('Error creating new booking ...');
                        console.log(err);
                        return cb(err);
                      } else {
                         console.log('result creating new booking ...'+JSON.stringify(result));
                        if(result[0].exists === true){
                                Bookings.app.datasources.postgres.connector.query(sql1, function(err, result) {
                      if (err) {
                        console.log('Error creating new booking ...');
                        console.log(err);
                        return cb(err);
                      } else {
                        console.log('result creating new booking ...'+JSON.stringify(result));
                        if(result[0].id !== undefined){
                            console.log('result creating new booking ...'+JSON.stringify(parseInt(result[0].id)));
                            var customer_id = result[0].id;
                          var sqlexist = 'select * from create_booking_for_admin(\'' + carType + '\', ' + isRoundTrip + ', ' + isOutstation + ', \'' + reportingDate + '\', \'' + reportingTime + '\', \'' + releivingDate + '\', \'' + releivingTime + '\', ' + releavingDuration + ', \'' + addressLandmark + '\', \'' + pickAddress1 + '\', ' + pickupLat + ', ' + pickupLng + ', \'' + dropAddress1 + '\', ' + dropLat + ', ' + dropLng + ', \'' + cityName + '\', ' + cityLat + ', ' + cityLng + ', ' + totalAmount + ', ' + customer_id + ', ' + userId + ', \'' + paymentMethod + '\', \'' + remark + '\',' + returnTravelTime + ', \'' + tripType + '\', \'' + city + '\',\'' + dutyBasis + '\',' + extraCharges + ')';   
                            console.log('result creating new booking ...'+JSON.stringify(sqlexist));
                            Bookings.app.datasources.postgres.connector.query(sqlexist, function(err, result) {
                      if (err) {
                        console.log('Error creating new booking ...');
                        console.log(err);
                        return cb(err);
                      } else {
                        cb(err, result);


                      }

                    });

                        } 
                        //cb(err, result);


                      }

                    });

                        }else{
                             Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
                      if (err) {
                        console.log('Error creating new booking ...');
                        console.log(err);
                        return cb(err);
                      } else {


                        cb(err, result);


                      }

                    });
                        }
                        //cb(err, result);


                      }

                    });
                    // call sql query from postreSQL
                    

   };

  Bookings.remoteMethod(
    'websiteCustomerCreateBooking', {
      accepts: [{
        arg: 'email',
        type: 'string',
        required: true
      }, {
        arg: 'firstName',
        type: 'string',
        required: true
      }, {
        arg: 'middleName',
        type: 'string',
        required: false
      }, {
        arg: 'lastName',
        type: 'string',
        required: true
      }, {
        arg: 'mobileNumber',
        type: 'string',
        required: true
      }, {
        arg: 'status',
        type: 'string',
        required: true
      }, {
        arg: 'addressLandmark',
        type: 'string',
        required: false
      }, {
        arg: 'address',
        type: 'string',
        required: true
      }, {
        arg: 'addressLat',
        type: 'string',
        required: true
      }, {
        arg: 'addressLong',
        type: 'string',
        required: true
      }, {
        arg: 'userId',
        type: 'string',
        required: true
      }, {
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
        arg: 'reportingDate',
        type: 'string',
        required: true
      }, {
        arg: 'reportingTime',
        type: 'string',
        required: true
      }, {
        arg: 'releivingDate',
        type: 'string',
        required: true
      }, {
        arg: 'releivingTime',
        type: 'string',
        required: true
      }, {
        arg: 'releavingDuration',
        type: 'string',
        required: true
      }, {
        arg: 'pickupLandmark',
        type: 'string',
        required: false
      }, {
        arg: 'pickupAddress',
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
        arg: 'dropAddress',
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
        arg: 'cityName',
        type: 'string',
        required: true
      }, {
        arg: 'cityLat',
        type: 'string',
        required: true
      }, {
        arg: 'cityLng',
        type: 'string',
        required: true
      }, {
        arg: 'totalAmount',
        type: 'string',
        required: true
      }, {
        arg: 'userId1',
        type: 'string',
        required: true
      }, {
        arg: 'paymentMethod',
        type: 'string',
        required: false
      }, {
        arg: 'remark',
        type: 'string',
        required: false
      }, {
        arg: 'tripType',
        type: 'string',
        required: false
      }, {
        arg: 'operationCity',
        type: 'string',
        required: false
      }, {
        arg: 'dutyBasis',
        type: 'string',
        required: false
        }, {
        arg: 'extraCharges',
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
  
    Bookings.getFavAddress = function(customerId, cb) {

        var sql = 'select distinct (pick_address),from_lat,From_Long from bookings where customer_id = ' + customerId + ' limit 5 ';

        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting favourite address ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };


    Bookings.remoteMethod(
        'getFavAddress', {
            accepts: [{
                arg: 'customerId',
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

    Bookings.getDriverInvites = function(driverId, cb) {

        var sql = 'select * from get_driver_invites(' + driverId + ')';
        console.log('getting invited sql ...' + sql);
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting invited driver ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };


    Bookings.remoteMethod(
        'getDriverInvites', {
            accepts: [{
                arg: 'driverId',
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
    Bookings.getDriverInvitesTomorrow = function(driverId, cb) {

        var sql = 'select * from get_driver_invites_tomorrow(' + driverId + ')';
        console.log('getting invited sql ...' + sql);
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting invited driver ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };


    Bookings.remoteMethod(
        'getDriverInvitesTomorrow', {
            accepts: [{
                arg: 'driverId',
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
    Bookings.getDriverDuties = function(driverId, cb) {
        // sql query
        var sql = 'select * from get_driver_duties(' + driverId + ')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting assigned driver bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'getDriverDuties', {
            accepts: [{
                arg: 'driverId',
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

    Bookings.acceptDuty = function(driverId, bookingId, oldDriverId, cb) {
        // sql query
        var sql = 'select * from accept_duty(\'' + driverId + '\', \'' + bookingId + '\',\'' + oldDriverId + '\' )';

        console.log('Duty  Accept function ...' + sql);
        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error accepting duty ...');
                console.log(err);
                return cb(err);
            }
            console.log('Duty Accept function ...' + JSON.stringify(result));
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'acceptDuty', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            }, {
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'oldDriverId',
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

    Bookings.cancelBooking = function(bookingId, cancellationId, cancellationReason, cb) {
        var sql1 = 'select * from bookings where id = \''+bookingId+'\'';
         Bookings.app.datasources.postgres.connector.query(sql1, function(err, result1) {

            if (err) {

                console.log('error in cancel duty ...');

                console.log(err);

                return cb(err);

            } else {
                //console.log('booking status ...' + JSON.stringify(result1));

                if(result1[0].status== 'Line Up'){
                    console.log('booking status ...' + JSON.stringify(result1));
                    console.log(result1[0].status);
                    console.log(result1[0].id);
                     console.log(result1[0].driver_id);
                      var sql2 = 'select cu.first_name as firstName, cu.last_name as lastName, cu.mobile_number as mobileNumber from con_users cu,driver_details dd where cu.id = dd.conuser_id and dd.id = \'' + result1[0].driver_id + '\'';
        //var sql = 'select * from cancel_booking(\'' + bookingId + '\', \'' + cancellationId + '\', \'' + cancellationReason + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql2, function(err, result2) {
            if (err) {
                console.log('error in cancel bookings ...');
                console.log(err);
                return cb(err);
            }else{
                console.log('driver details ...' + JSON.stringify(result2));
                 var drvName = result2[0].firstname + ' ' + result2[0].lastname;
                                var drvFirstName = result2[0].firstname;
                                var drvMobile = result2[0].mobilenumber;
                                var drvMsg =' Please note, Your allocated booking ID ' + bookingId + ' has been canceled.'+'\n'+'Indian Drivers'; 

// 'Hi ' + drvFirstName + ',%0aYou have cancelled the duty allocated to you Booking Id:' + bookingId + '. For queries, please reach us on 020-6 or info@indian-drivers.com';
                                sendMessage(drvMobile, drvMsg);
            }
            
        });
                }

        // sql query
       
        var sql = 'select * from cancel_booking(\'' + bookingId + '\', \'' + cancellationId + '\', \'' + cancellationReason + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in cancel bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    }
});
};

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'cancelBooking', {
            accepts: [{
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'cancellationId',
                type: 'string',
                required: true
            }, {
                arg: 'cancellationReason',
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


    Bookings.cancelBookingForAdmin = function(bookingId, cancellationId, cancellationReason, userId, cb) {
        // // sql query
        // var sql = 'select * from cancel_booking_for_admin(\'' + bookingId + '\', \'' + cancellationId + '\', \'' + cancellationReason + '\')';

        // // call sql query from postreSQL
        // Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
        //     if (err) {
        //         console.log('error in cancel bookings ...');
        //         console.log(err);
        //         return cb(err);
        //     }
        //     cb(err, result);
        // });
         var sql1 = 'select * from bookings where id = \''+bookingId+'\'';
         Bookings.app.datasources.postgres.connector.query(sql1, function(err, result1) {

            if (err) {

                console.log('error in cancel duty ...');

                console.log(err);

                return cb(err);

            } else {
                //console.log('booking status ...' + JSON.stringify(result1));

                if(result1[0].status== 'Line Up'){
                    console.log('booking status ...' + JSON.stringify(result1));
                    // console.log(result1[0].status);
                    // console.log(result1[0].id);
                    //  console.log(result1[0].driver_id);
                      
        //var sql = 'select * from cancel_booking(\'' + bookingId + '\', \'' + cancellationId + '\', \'' + cancellationReason + '\')';
        var sql2 = 'select cu.first_name as firstName, cu.last_name as lastName, cu.mobile_number as mobileNumber from con_users cu,driver_details dd where cu.id = dd.conuser_id and dd.id = \'' + result1[0].driver_id + '\'';
        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql2, function(err, result2) {
            if (err) {
                console.log('error in cancel bookings ...');
                console.log(err);
                return cb(err);
            }else{
                console.log('driver details ...' + JSON.stringify(result2));
                 var drvName = result2[0].firstname + ' ' + result2[0].lastname;
                                var drvFirstName = result2[0].firstname;
                                var drvMobile = result2[0].mobilenumber;
                                var drvMsg =' Please note, Your allocated booking ID ' + bookingId + ' has been cancelled.'+'\n'+'Indian Drivers'; 
                                
                                
// 'Hi ' + drvFirstName + ',%0aYou have cancelled the duty allocated to you Booking Id:' + bookingId + '. For queries, please reach us on 020-6 or info@indian-drivers.com';
                               
                                sendMessage(drvMobile, drvMsg);
                                
            }
            
        });
                }

        // sql query
        var sql3 = 'select cu.mobile_number from con_users cu,customer_details cd where cd.conuser_id = cu.id and cd.id = '+ result1[0].customer_id +'';
       
         Bookings.app.datasources.postgres.connector.query(sql3, function(err, result3) {
            if (err) {
                console.log('error in cancel bookings ...');
                console.log(err);
                return cb(err);
            }else{
                console.log('customer mobile number ...' + JSON.stringify(result3));
                var custMobile = result3[0].mobile_number;
                console.log(custMobile);
                var custMsg='Please note, Your booking with booking ID ' + bookingId + ' has been cancelled.'+'\n'+'Indian Drivers';
                sendMessage(custMobile, custMsg);
            }
            
        });
        var sql = 'select * from cancel_booking_for_admin(\'' + bookingId + '\', \'' + cancellationId + '\', \'' + cancellationReason + '\', \'' + userId + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in cancel bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });


    }
});

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'cancelBookingForAdmin', {
            accepts: [{
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'cancellationId',
                type: 'string',
                required: true
            }, {
                arg: 'cancellationReason',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
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

    Bookings.driverCancelDuty = function(driverId, bookingId, cb) {
        // sql query
        var sql = 'select * from driver_cancel_duty(\'' + driverId + '\', \'' + bookingId + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in cancel duty ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'driverCancelDuty', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            }, {
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


    Bookings.driverCancelDutyNew = function(driverId, bookingId, cb) {
        // sql query
        var sql = 'select * from driver_cancel_duty(\'' + driverId + '\', \'' + bookingId + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in cancel duty ...');
                console.log(err);
                return cb(err);
            } else {

                //var sql = 'select * from driver_cancel_duty(\'' + driverId + '\', \'' + bookingId + '\')';
                var sql1 = 'select cu.first_name as firstName, cu.last_name as lastName, cu.mobile_number as mobileNumber,b.reporting_date as reportingDate, b.reporting_time as reportingTime from con_users cu,customer_details cd, bookings b where cu.id = cd.conuser_id and cd.id = b.customer_id and b.id = \'' + bookingId + '\'';
                // call sql query from postreSQL
                Bookings.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                    if (err) {
                        console.log('error in fetching customer data ...');
                        console.log(err);
                        return cb(err);
                    } else {

                        console.log('customer data ...' + JSON.stringify(result1));
                        var custName = result1[0].firstname;
                        var custMobile = result1[0].mobilenumber;
                        var custMsg = 'Hi ' + custName + ',%0aWe are replacing the driver assigned to you for the Booking Id:' + bookingId + '. New Driver details will be messaged shortly. For queries, please reach us on 020-67641000 or info@indian-drivers.com.';
                        sendMessage(custMobile, custMsg);

                        var sql2 = 'select cu.first_name as firstName, cu.last_name as lastName, cu.mobile_number as mobileNumber from con_users cu,driver_details dd where cu.id = dd.conuser_id and dd.id = \'' + driverId + '\'';
                        // call sql query from postreSQL
                        Bookings.app.datasources.postgres.connector.query(sql2, function(err, result2) {
                            if (err) {
                                console.log('error in fetching driver data ...');
                                console.log(err);
                                return cb(err);
                            } else {

                                console.log('driver data ...' + JSON.stringify(result2));
                                var drvName = result2[0].firstname + ' ' + result2[0].lastname;
                                var drvFirstName = result2[0].firstname;
                                var drvMobile = result2[0].mobilenumber;
                                var drvMsg = 'Hi ' + drvFirstName + ',%0aYou have cancelled the duty allocated to you Booking Id:' + bookingId + '. For queries, please reach us on 020-6 or info@indian-drivers.com';
                                sendMessage(drvMobile, drvMsg);

                                var sql3 = 'select b.reporting_date, b.reporting_time from bookings b where b.id =  \'' + bookingId + '\'';
                                // call sql query from postreSQL
                                Bookings.app.datasources.postgres.connector.query(sql3, function(err, result3) {
                                    if (err) {
                                        console.log('error in fetching booking data ...');
                                        console.log(err);
                                        return cb(err);
                                    } else {

                                        console.log('booking data ...' + JSON.stringify(result3));
                                        var reportingDate = result3[0].reporting_date.getDate() + '-' + (result3[0].reporting_date.getMonth() + 1) + '-' + result3[0].reporting_date.getFullYear();

                                        var reportingTime = result3[0].reporting_time;
                                        var authMobile = ['9028123366', '9225513111', '9225585200'];
                                        var authMsg = 'Hi ' + ',%0aThe Driver ' + drvName + '(' + driverId + ') has cancelled the Booking ID:' + bookingId + ' dated on ' + reportingDate + ' @ ' + reportingTime + '.';
                                        sendMessage(authMobile, authMsg);


                                        //cb(err, result);
                                    }

                                });

                                //cb(err, result);
                            }

                        });
                        //cb(err, result);
                    }

                });
                cb(err, result);
            }

        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'driverCancelDutyNew', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            }, {
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

  Bookings.driverCancelDutyNew1 = function(driverId, bookingId, userId, cb) {

        // sql query

        var sql = 'select * from driver_cancel_duty1(\'' + driverId + '\', \'' + bookingId + '\', \'' + userId + '\')';

        // call sql query from postreSQL

        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {

            if (err) {

                console.log('error in cancel duty ...');

                console.log(err);

                return cb(err);

            } else {

                //var sql = 'select * from driver_cancel_duty(\'' + driverId + '\', \'' + bookingId + '\')';

                var sql1 = 'select cu.first_name as firstName, cu.last_name as lastName, cu.mobile_number as mobileNumber,b.reporting_date as reportingDate, b.reporting_time as reportingTime from con_users cu,customer_details cd, bookings b where cu.id = cd.conuser_id and cd.id = b.customer_id and b.id = \'' + bookingId + '\'';

                // call sql query from postreSQL

                Bookings.app.datasources.postgres.connector.query(sql1, function(err, result1) {

                    if (err) {

                        console.log('error in fetching customer data ...');

                        console.log(err);

                        return cb(err);

                    } else {

                        console.log('customer data ...' + JSON.stringify(result1));

                        var custName = result1[0].firstname;

                        var custMobile = result1[0].mobilenumber;

                        var custMsg = 'Hi ' + custName + ',%0aWe are replacing the driver assigned to you for the Booking Id:' + bookingId + '. New Driver details will be messaged shortly. For queries, please reach us on 020-67641000 or info@indian-drivers.com.';

                        sendMessage(custMobile, custMsg);

                        var sql2 = 'select cu.first_name as firstName, cu.last_name as lastName, cu.mobile_number as mobileNumber from con_users cu,driver_details dd where cu.id = dd.conuser_id and dd.id = \'' + driverId + '\'';

                        // call sql query from postreSQL

                        Bookings.app.datasources.postgres.connector.query(sql2, function(err, result2) {

                            if (err) {

                                console.log('error in fetching driver data ...');

                                console.log(err);

                                return cb(err);

                            } else {

                                console.log('driver data ...' + JSON.stringify(result2));

                                var drvName = result2[0].firstname + ' ' + result2[0].lastname;

                                var drvFirstName = result2[0].firstname;

                                var drvMobile = result2[0].mobilenumber;

                                var drvMsg = 'Hi ' + drvFirstName + ',%0aYou have cancelled the duty allocated to you Booking Id:' + bookingId + '. For queries, please reach us on 020-67641000 or info@indian-drivers.com';

                                sendMessage(drvMobile, drvMsg);

                                var sql3 = 'select b.reporting_date, b.reporting_time from bookings b where b.id =  \'' + bookingId + '\'';

                                // call sql query from postreSQL

                                Bookings.app.datasources.postgres.connector.query(sql3, function(err, result3) {

                                    if (err) {

                                        console.log('error in fetching booking data ...');

                                        console.log(err);

                                        return cb(err);

                                    } else {

                                        console.log('booking data ...' + JSON.stringify(result3));

                                        var reportingDate = result3[0].reporting_date.getDate() + '-' + (result3[0].reporting_date.getMonth() + 1) + '-' + result3[0].reporting_date.getFullYear();

                                        var reportingTime = result3[0].reporting_time;

                                       // var authMobile = ['9028123366', '9225513111', '9225585200'];

                                       

                                        //cb(err, result);

                                        var sql5 ='select role_id from user_roles where conuser_id = '+ userId;

                                         var sql4 ='select first_name, last_name from con_users where id = '+ userId;

                                        console.log ('userId:'+JSON.stringify(userId));

                                        console.log ('sql4l:'+JSON.stringify(sql4)) ;

                                        Bookings.app.datasources.postgres.connector.query(sql4, function(err, result4) {

                                    if (err) {

                                        console.log('error in fetching booking data ...');

                                        console.log(err);

                                        return cb(err);

                                    } else {

                                        console.log('booking data ...' + JSON.stringify(result3));

                                        var byName = result4[0].first_name + ' ' +  result4[0].last_name;

                                         Bookings.app.datasources.postgres.connector.query(sql5, function(err, result5) {

                                    if (err) {

                                        console.log('error in fetching booking data ...');

                                        console.log(err);

                                        return cb(err);

                                    } else {

                                        if(result5[0].role_id == '3'){

                                            console.log('booking data ...' + JSON.stringify(result5));

                                        

                                        var authMobile = '9225585200';

                                       // var sql4 = "select firstname, lastname from con_users where id = userId";

                                       /* if(sql5 == 3){

                                            if (err) {

                                        console.log('error in fetching booking data ...');

                                        console.log(err);

                                        return cb(err);

                                    }*/

                                        var authMsg = 'Hi ' + ',%0aThe Driver ' + drvName + '(' + driverId + ') has cancelled the Booking ID:' + bookingId + ' dated on ' + reportingDate + ' @ ' + reportingTime ;

                                        sendMessage(authMobile, authMsg);

                                        

                                        

                                        } 

                                       

                                    }

                                     cb(err, result);

                                });

                                        

                                        

                                        

                                       

                                    }

                                      

                                });

                                    }

                                });

                                //cb(err, result);

                            }

                        });

                        //cb(err, result);

                    }

                });

            

            }

        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(

        'driverCancelDutyNew1', {

            accepts: [{

                arg: 'driverId',

                type: 'string',

                required: true

            }, {

                arg: 'bookingId',

                type: 'string',

                required: true

            }, {

                arg: 'userId',

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


    Bookings.offDutyForAdmin = function(bookingId, totalTravelTime, releivingDate, releivingTime, dropLocation, dropLat, dropLong, updatedBy, cb) {
        // sql query
        var sql = 'select * from off_duty_for_admin(\'' + bookingId + '\', ' + totalTravelTime + ', \'' + releivingDate + '\', \'' + releivingTime + '\', \'' + dropLocation + '\', ' + dropLat + ', ' + dropLong + ', ' + updatedBy + ')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in off duty procedure ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'offDutyForAdmin', {
            accepts: [{
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'totalTravelTime',
                type: 'string',
                required: true
            }, {
                arg: 'releivingDate',
                type: 'string',
                required: true
            }, {
                arg: 'releivingTime',
                type: 'string',
                required: true
            }, {
                arg: 'dropLocation',
                type: 'string',
                required: true
            }, {
                arg: 'dropLat',
                type: 'string',
                required: true
            }, {
                arg: 'dropLong',
                type: 'string',
                required: true
            }, {
                arg: 'updatedBy',
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


    Bookings.getDriverList = function(bookingId, operationCity, cb) {
    // sql query
    var sql = 'select * from get_driver_list(\'' + bookingId + '\',\'' + operationCity + '\')';

    // call sql query from postreSQL
    Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver list to allocate duty ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  Bookings.remoteMethod(
    'getDriverList', {
      accepts: [{
        arg: 'bookingId',
        type: 'string',
        required: true
      }, {
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

    Bookings.getDriverList1 = function(bookingId, cb) {
        // sql query
        var sql = 'select * from get_driver_list1(\'' + bookingId + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver list to allocate duty ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'getDriverList1', {
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
                verb: 'get'
            }
        }
    );

    Bookings.getDriverSummary = function(driverId, cb) {
        // sql query
        var sql = 'select * from get_driver_summary(' + driverId + ')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver summary ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'getDriverSummary', {
            accepts: [{
                arg: 'driverId',
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


    Bookings.getDriverLocalSummary = function(driverId, cb) {
        // sql query
        var sql = 'select * from get_driver_local_summary(\'' + driverId + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver local summary ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'getDriverLocalSummary', {
            accepts: [{
                arg: 'driverId',
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


    Bookings.getDriverOutstationSummary = function(driverId, cb) {
        // sql query
        var sql = 'select * from get_driver_outstation_summary(\'' + driverId + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver outstation summary ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'getDriverOutstationSummary', {
            accepts: [{
                arg: 'driverId',
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

    Bookings.calculateDistance = function(lat1, long1, lat2, long2, cb) {
        // sql query
        var sql = 'select * from calculate_distance(\'' + lat1 + '\',\'' + long1 + '\',\'' + lat2 + '\',\'' + long2 + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error calculating distance ...');
                console.log(err);
                return cb(err);
            }
            console.log('result is' + JSON.stringify(result));
            var timeIs = ((result[0].calculate_distance) / 35);
            result[0].calculate_distance = timeIs;
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'calculateDistance', {
            accepts: [{
                arg: 'lat1',
                type: 'string',
                required: true
            }, {
                arg: 'long1',
                type: 'string',
                required: true
            }, {
                arg: 'lat2',
                type: 'string',
                required: true
            }, {
                arg: 'long2',
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

    Bookings.getDriverCurrentDuty = function(driverId, cb) {
        // sql query
        var sql = 'select * from get_current_duty(' + driverId + ')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver current duty ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'getDriverCurrentDuty', {
            accepts: [{
                arg: 'driverId',
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

    Bookings.startDuty = function(conuserId, bookingId, driverId, customerId, pickupAddress, pickupLat, pickupLong, cb) {
        // sql query
        var sql = 'select * from start_duty(' + conuserId + ',' + bookingId + ',' + driverId + ',' + customerId + ',\'' + pickupAddress + '\',' + pickupLat + ',' + pickupLong + ')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in start duty ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'startDuty', {
            accepts: [{
                arg: 'conuserId',
                type: 'string',
                required: true
            }, {
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'driverId',
                type: 'string',
                required: true
            }, {
                arg: 'customerId',
                type: 'string',
                required: true
            }, {
                arg: 'pickupAddress',
                type: 'string',
                required: true
            }, {
                arg: 'pickupLat',
                type: 'string',
                required: true
            }, {
                arg: 'pickupLong',
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

    Bookings.startDutyForAdmin = function(bookingId, driverId, reportingDate, reportingTime, updatedBy, cb) {
        // sql query
        var sql = 'select * from start_duty_for_admin(' + bookingId + ',' + driverId + ', \'' + reportingDate + '\', \'' + reportingTime + '\',' + updatedBy + ')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in start duty ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'startDutyForAdmin', {
            accepts: [{
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'driverId',
                type: 'string',
                required: true
            }, {
                arg: 'reportingDate',
                type: 'string',
                required: true
            }, {
                arg: 'reportingTime',
                type: 'string',
                required: true
            }, {
                arg: 'updatedBy',
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


    Bookings.offDutyForDriver = function(bookingId, dropLocation, dropLat, dropLong, updatedBy, cb) {
        // sql query
        var sql = 'select * from off_duty_for_driver(\'' + bookingId + '\', \'' + dropLocation + '\', ' + dropLat + ', ' + dropLong + ', ' + updatedBy + ')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in off duty procedure ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'offDutyForDriver', {
            accepts: [{
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'dropLocation',
                type: 'string',
                required: true
            }, {
                arg: 'dropLat',
                type: 'string',
                required: true
            }, {
                arg: 'dropLong',
                type: 'string',
                required: true
            }, {
                arg: 'updatedBy',
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


    Bookings.getAnalysisData = function(fromDate, toDate, operationCity, cb) {
        // sql query

        console.log('fromdate' + fromDate);
        console.log('toDate' + toDate);
       
        var sql = 'select * from get_analysis_data(\'' + fromDate + '\', \'' + toDate + '\',\'' +operationCity+'\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting analysis data ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'getAnalysisData', {
            accepts: [{
                arg: 'fromDate',
                type: 'string',
                required: true
            }, {
                arg: 'toDate',
                type: 'string',
                required: true
            }, {
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



    Bookings.calculateDistanceByLatLong = function(lat1, long1, lat2, long2, cb) {

        console.log('fromLat: ' + lat1);
        console.log('fromLong: ' + long1);
        console.log('toLat: ' + lat2);
        console.log('toLong: ' + long2);
        

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'calculateDistanceByLatLong', {
            accepts: [{
                arg: 'lat1',
                type: 'string',
                required: true
            }, {
                arg: 'long1',
                type: 'string',
                required: true
            }, {
                arg: 'lat2',
                type: 'string',
                required: true
            }, {
                arg: 'long2',
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


    Bookings.getDriverSalaryList = function(bookingId, cb) {
        // sql query

        var sql = 'select b.driver_id , cu.first_name, cu.last_name , cu.mobile_number, d.bank_name , d.account_number , d.ifsc_code, sum(b.driver_share) as total from bookings b, driver_details d, con_users cu where b.driver_id = d.id and d.id = b.driver_id and d.conuser_id = cu.id and b.id in (' + bookingId + ') group by b.driver_id, cu.first_name, cu.last_name, cu.mobile_number , d.bank_name , d.account_number , d.ifsc_code';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting bookings ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'getDriverSalaryList', {
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
                verb: 'get'
            }
        }
    );

Bookings.paidDutyFunction = function(bookingId, paymentMethod, userId, cb) {
        // sql query
        var sql = 'select * from paid_duty_function(' + bookingId + ', \'' + paymentMethod + '\',' + userId + ')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in paid duty ...');
                console.log(err);
                return cb(err);
            } else {
                console.log('paid duty data' + JSON.stringify(result));
                if (result[0].paid_duty_function === '0') {
                    var sql1 = 'select cu.first_name, cu.last_name, cu.mobile_number,b.reporting_date, b.reporting_time, round(i.net_amount) as amount, b.operation_city, b.trip_type from con_users cu,customer_details cd, bookings b, invoices i where cu.id = cd.conuser_id and cd.id = b.customer_id and b.id = i.booking_id and b.id = \'' + bookingId + '\'';
                    // call sql query from postreSQL
                    Bookings.app.datasources.postgres.connector.query(sql1, function(err, result1) {
                        if (err) {
                            console.log('error in fetching driver data ...');
                            console.log(err);
                            return cb(err);
                        } else {

                            console.log('customer data ...' + JSON.stringify(result1));
                            var custName = result1[0].first_name + ' ' + result1[0].last_name;
                            var custMobile = result1[0].mobile_number;
                            var operationCity = result1[0].operation_city;
                            var reportingDate = result1[0].reporting_date.getDate() + '-' + (result1[0].reporting_date.getMonth() + 1) + '-' + result1[0].reporting_date.getFullYear();
                            var reportingTime = result1[0].reporting_time;
                            var totalAmt = result1[0].amount;
                            var triptype = result1[0].trip_type

                            var sql2 = 'select cu.first_name, cu.last_name, cu.mobile_number from con_users cu, driver_details dd where cu.id = dd.conuser_id and dd.id = (select b.driver_id from bookings b where b.id = \'' + bookingId + '\')';
                            // call sql query from postreSQL
                            Bookings.app.datasources.postgres.connector.query(sql2, function(err, result2) {
                                if (err) {
                                    console.log('error in fetching booking data ...');
                                    console.log(err);
                                    return cb(err);
                                } else {

                                    console.log('driver data ...' + JSON.stringify(result2));

                                    var drvName = result2[0].first_name + ' ' + result2[0].last_name;
                                    var drvMobile = result2[0].mobile_number;
                                    var sql3= 'select contact_number from cities where city_name = \'' + operationCity + '\'';
                                     Bookings.app.datasources.postgres.connector.query(sql3, function(err, result3) {
                                        if (err) {
                                        console.log('error in fetching booking data ...');
                                        console.log(err);
                                        return cb(err);
                                    } else {
                                         var contactNumber = result3[0].contact_number;

                                    if (paymentMethod === 'O' || paymentMethod === 'C') {
                                        
                                        var msg1 = 'Dear ' + drvName + ',%0aIndian Drivers received payment for Booking ID:' + bookingId + ' Dated on ' + reportingDate + ' @' + reportingTime + '. you can leave now. For queries, please reach us on '+ contactNumber +' or info@indian-drivers.com.';
                                        sendMessage(drvMobile, msg1);
                                    } else {
                                        var msg2 = 'Dear ' + custName + ',%0aDriver has received billed amount of Rs. ' + totalAmt + ' for Booking Id:' + bookingId + '. For details download app(https://goo.gl/XFPFwh). For queries, please reach us on '+ contactNumber +' or info@indian-drivers.com.'
                                        var msg3 = 'Dear ' + drvName + ',%0aYou have received cash Rs. ' + totalAmt + ' for Booking Id:' + bookingId + ' Dated on ' + reportingDate + ' @' + reportingTime + ' from customer. For queries, please reach us on '+ contactNumber +' or info@indian-drivers.com.'
                                        if(triptype === 'R'){

                                        }else{
                                        sendMessage(custMobile, msg2);
                                        sendMessage(drvMobile, msg3); 
                                        }
                                        
                                    }
                                }

                                 });   //cb(err, result);
                                }

                            });

                            //cb(err, result);
                        }

                    });
                }

                cb(err, result);
            }

        });

    };
    //Remote method to get provider of email

    Bookings.remoteMethod(
        'paidDutyFunction', {
            accepts: [{
                arg: 'bookingId',
                type: 'string',
                required: true
            }, {
                arg: 'paymentMethod',
                type: 'string',
                required: true
            }, {
                arg: 'userId',
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
      Bookings.sendInvoiceEmail = function(bookingId, cb) {
        console.log('bookingId****: ' + bookingId);
        Bookings.findById(bookingId, {
            include: [{
                relation: 'customerDetails',
                scope: {
                    include: {
                        relation: 'conUsers',
                    }
                }
            }, {
                relation: 'driverDetails',
                scope: {
                    include: {
                        relation: 'conUsers',
                    }
                }
            }, {
                relation: 'localBookings'


            }, {
                relation: 'outstationBookings'


            }, {
                relation: 'invoices',
                scope: {
                    include: {
                        relation: 'invoiceDetails',
                        scope: {
                            include: {
                                relation: 'invoiceSubHeads'
                            }
                        }
                    }
                }


            }]

        }, function(err, EmailDetails) {
            console.log('Email data *****' + JSON.stringify(EmailDetails));
            var EmailData = EmailDetails.toJSON();
            var reportDate = new Date(EmailData.invoices[0].reportingDate);
            console.log('reportDate: ' + reportDate);
            reportDate = addZero(reportDate.getDate()) + '/' + addZero(reportDate.getMonth() + 1) + '/' + reportDate.getFullYear();
            console.log('reportDate**: ' + reportDate);

            var relDate = new Date(EmailData.invoices[0].releavingDate);
            console.log('relDate: ' + relDate);
            relDate = addZero(relDate.getDate()) + '/' + addZero(relDate.getMonth() + 1) + '/' + relDate.getFullYear();
            console.log('relDate**: ' + relDate);

            var billDate = new Date();
            console.log('billDate: ' + billDate);
            billDate = addZero(billDate.getDate()) + '/' + addZero(billDate.getMonth() + 1) + '/' + billDate.getFullYear();
            console.log('billDate**: ' + billDate);

            var date1 = new Date(EmailData.invoices[0].reportingDate);
            var date2 = new Date(EmailData.invoices[0].releavingDate);
            console.log('date1 time **' + date1.getTime());
            console.log('date2 time **' + date2.getTime());

            var time1 = EmailData.invoices[0].reportingTime;

            var a = time1.split(':');
            var reportingMS = (((+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])) * 1000);

            var time2 = EmailData.invoices[0].releavingTime;

            var b = time2.split(':');
            var releavingMS = (((+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2])) * 1000);


            console.log('reportingMS **' + reportingMS);
            console.log('releavingMS **' + releavingMS);

            var timeDiff = Math.abs((date2.getTime() + releavingMS) - (date1.getTime() + reportingMS));
            console.log('time diff**' + timeDiff);
            var diffHours = (timeDiff / (1000 * 3600));
            console.log('time diff**' + diffHours);


            var dutyType = null;
            var overtimeHours = 00;
            if (EmailData.isOutstation === true) {
                dutyType = 'Outstation';
                if (EmailData.isRoundTrip === true) {
                    if (diffHours > 12) {
                        overtimeHours = diffHours - 12;
                        
                    } else {
                        overtimeHours = 00;
                    }

                } else {
                    console.log(diffHours);
                    console.log(EmailData.outstationBookings[0].returnTravelTime);
                    diffHours = diffHours + EmailData.outstationBookings[0].returnTravelTime;
                    console.log('outstation overtimeHours***' + diffHours);
                    if (diffHours > 12) {
                        overtimeHours = diffHours - 12;
                        
                    } else {
                        overtimeHours = 00;
                    }
                }
            } else {
                dutyType = 'Local';
                if (diffHours > 4) {
                    overtimeHours = diffHours - 4;
                    
                } else {
                    overtimeHours = 00;
                }

            }

            overtimeHours = overtimeHours.toFixed(2);
            console.log('overtimeHours***' + overtimeHours);
            var arr = overtimeHours.split('.');
            var hr = parseInt(arr[0]);
            var min = parseInt(arr[1]);

            var actualMin = min * 0.6;
            var roundMin = Math.round(actualMin);
            if (roundMin < 10) {
                roundMin = '0' + roundMin;
            }
            if (hr < 10) {
                hr = '0' + hr;
            }
            console.log('hr**' + hr);
            console.log('roundMin**' + roundMin);
            var finalOvertime = hr + '.' + roundMin;
            console.log('finalOvertime**' + finalOvertime);
            var overtimeText;
            if(EmailData.isOutstation === true){
                overtimeText = finalOvertime +' Hours * Rs.40';
            }else{
                overtimeText = finalOvertime +' Hours * Rs.50';
            }
            var carType = null;
            if (EmailData.carType === 'A') {
                carType = 'Automatic';
            } else if (EmailData.carType === 'L') {
                carType = 'Luxury';
            } else {
                carType = 'Manual';
            }
            var journeyType = null;
            if (EmailData.isRoundTrip === true) {
                journeyType = 'Round Trip';
            } else {
                journeyType = 'One Way';
            }
            var pickAddress = null;
            if (EmailData.landmark !== null || EmailData.landmark !== '' || EmailData.landmark !== 'undefined') {
                pickAddress = EmailData.landmark + ' ' + EmailData.pickAddress;
            } else {
                pickAddress = EmailData.pickAddress;
            }


            var baseFare = '00';
            var overtimeFare = '00';
            console.log('invoiceDetails length' + EmailData.invoices[0].invoiceDetails.length);
            if (EmailData.invoices[0].invoiceDetails.length > 2) {
                baseFare = Math.round(EmailData.invoices[0].invoiceDetails[0].amount);
                console.log('base fare***: ' + baseFare);
                overtimeFare = Math.round(EmailData.invoices[0].invoiceDetails[1].amount);
                console.log('overtime fare***: ' + overtimeFare);


            } else {

                baseFare = Math.round(EmailData.invoices[0].invoiceDetails[0].amount);
                console.log('base fare**: ' + baseFare);

                overtimeFare = '00';
                console.log('overtime fare**: ' + overtimeFare);
            }



            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            console.log('Email Id ****' + EmailData.customerDetails.conUsers.email);
            /*if (EmailData.isOutstation === true) {
                var html = '<div bgcolor=\'#e4e4e4\' text=\'#ff6633\' link=\'#666666\' vlink=\'#666666\' alink=\'#ff6633\' style=\'margin:0;font-family:Arial,Helvetica,sans-serif;border-bottom:1\'> <table background=\'\' bgcolor=\'#e4e4e4\' width=\'100%\' style=\'padding:20px 0 20px 0\' cellspacing=\'0\' border=\'0\' align=\'center\' cellpadding=\'0\'> <tbody> <tr> <td> <table width=\'620\' border=\'0\' align=\'center\' cellpadding=\'0\' cellspacing=\'0\' bgcolor=\'#FFFFFF\' style=\'border-radius: 5px;\'> <tbody> <tr> <td valign=\'top\' style=\'color:#404041;line-height:16px;padding:25px 20px 0px 20px\'> <p> <section style=\'position: relative;clear: both;margin: 5px 0;height: 1px;border-top: 1px solid #cbcbcb;margin-bottom: 25px;margin-top: 10px;text-align: center;\'> <h3 align=\'center\' style=\'margin-top: -12px;background-color: #FFF;clear: both;width: 180px;margin-right: auto;margin-left: auto;padding-left: 15px;padding-right: 15px; font-family: arial,sans-serif;\'> <span>INVOICE</span> </h3> </section> </p> </td> </tr> <tr> <td valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:25px 20px 0px 20px\'> <p> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Dear '+EmailData.customerDetails.conUsers.firstName+' '+EmailData.customerDetails.conUsers.lastName+',</h2></span> </p> <p> Thank you for availing services from Indian Drivers, Please find invoice details. </p> </td> </tr> <tr align=\'left\' > <td style=\'color:#404041;font-size:12px;line-height:16px;padding:10px 16px 20px 18px\'> <table width=\'0\' border=\'0\' align=\'left\' cellpadding=\'0\' cellspacing=\'0\'> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Invoice Details</h2></span> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Bill Date:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + billDate + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Booking Id:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + bookingId + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Duty Type:</strong> </td> <td width=\'120\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + dutyType + ' </td> </tr> </tbody> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Car Type:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + carType + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Journey Type:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + journeyType + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Reporting Date & Time:</strong> </td> <td width=\'120\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + reportDate + ' ' + EmailData.invoices[0].reportingTime + ' </td> </tr> </tbody> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Releiving Date & Time:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + relDate + ' ' + EmailData.invoices[0].releavingTime + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Outstation City:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + EmailData.outstationBookings[0].cityName + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Pickup Address:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + pickAddress + ' </td> </tr> </tbody> </table>  </td> </tr> <tr align=\'left\'> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:10px 16px 20px 18px\'> <table width=\'0\' border=\'0\' align=\'left\' cellpadding=\'0\' cellspacing=\'0\'> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Fare Details</h2></span> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Base Fare:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 5px 3px 5px;border-bottom:solid 1px #999999\'> &#8377;'+baseFare+' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Overtime Fare:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> &#8377;'+overtimeFare+' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:13px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Grand Total:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#339933;font-size:13px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> <strong>&#8377;'+Math.round(EmailData.invoices[0].netAmount)+'</strong> </td> </tr> </td> </tr><tr> <td> <table width=\'550\' border=\'0\' cellspacing=\'0\' cellpadding=\'0\'> <tbody> <tr> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 5px 5px 10px\'> Food and other allowances are excluded in above bill and to be paid to the driver as per mobile application Rate Card.<br><br>For more information mail us at support@indian-drivers.com </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width=\'510\' border=\'0\' cellspacing=\'0\' cellpadding=\'0\'> <tbody> <tr> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 15px 10px 10px\'> <p> Thanks,<br> <strong>Team - Indian Drivers</strong> </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> ';
            }else{
                var html = '<div bgcolor=\'#e4e4e4\' text=\'#ff6633\' link=\'#666666\' vlink=\'#666666\' alink=\'#ff6633\' style=\'margin:0;font-family:Arial,Helvetica,sans-serif;border-bottom:1\'> <table background=\'\' bgcolor=\'#e4e4e4\' width=\'100%\' style=\'padding:20px 0 20px 0\' cellspacing=\'0\' border=\'0\' align=\'center\' cellpadding=\'0\'> <tbody> <tr> <td> <table width=\'620\' border=\'0\' align=\'center\' cellpadding=\'0\' cellspacing=\'0\' bgcolor=\'#FFFFFF\' style=\'border-radius: 5px;\'> <tbody> <tr> <td valign=\'top\' style=\'color:#404041;line-height:16px;padding:25px 20px 0px 20px\'> <p> <section style=\'position: relative;clear: both;margin: 5px 0;height: 1px;border-top: 1px solid #cbcbcb;margin-bottom: 25px;margin-top: 10px;text-align: center;\'> <h3 align=\'center\' style=\'margin-top: -12px;background-color: #FFF;clear: both;width: 180px;margin-right: auto;margin-left: auto;padding-left: 15px;padding-right: 15px; font-family: arial,sans-serif;\'> <span>INVOICE</span> </h3> </section> </p> </td> </tr> <tr> <td valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:25px 20px 0px 20px\'> <p> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Dear '+EmailData.customerDetails.conUsers.firstName+' '+EmailData.customerDetails.conUsers.lastName+',</h2></span> </p> <p> Thank you for availing services from Indian Drivers, Please find invoice details. </p> </td> </tr> <tr align=\'left\' > <td style=\'color:#404041;font-size:12px;line-height:16px;padding:10px 16px 20px 18px\'> <table width=\'0\' border=\'0\' align=\'left\' cellpadding=\'0\' cellspacing=\'0\'> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Invoice Details</h2></span> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Bill Date:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + billDate + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Booking Id:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + bookingId + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Duty Type:</strong> </td> <td width=\'120\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + dutyType + ' </td> </tr> </tbody> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Car Type:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + carType + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Journey Type:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + journeyType + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Reporting Date & Time:</strong> </td> <td width=\'120\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + reportDate + ' ' + EmailData.invoices[0].reportingTime + ' </td> </tr> </tbody> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Releiving Date & Time:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + relDate + ' ' + EmailData.invoices[0].releavingTime + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Pickup Address:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + pickAddress + ' </td> </tr> </tbody> </table>  </td> </tr> <tr align=\'left\'> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:10px 16px 20px 18px\'> <table width=\'0\' border=\'0\' align=\'left\' cellpadding=\'0\' cellspacing=\'0\'> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Fare Details</h2></span> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Base Fare:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 5px 3px 5px;border-bottom:solid 1px #999999\'> &#8377;'+baseFare+' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Overtime Fare:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> &#8377;'+overtimeFare+' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:13px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Grand Total:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#339933;font-size:13px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> <strong>&#8377;'+Math.round(EmailData.invoices[0].netAmount)+'</strong> </td> </tr> </td> </tr><tr> <td> <table width=\'550\' border=\'0\' cellspacing=\'0\' cellpadding=\'0\'> <tbody> <tr> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 5px 5px 10px\'> Food and other allowances are excluded in above bill and to be paid to the driver as per mobile application Rate Card.<br><br>For more information mail us at support@indian-drivers.com </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width=\'510\' border=\'0\' cellspacing=\'0\' cellpadding=\'0\'> <tbody> <tr> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 15px 10px 10px\'> <p> Thanks,<br> <strong>Team - Indian Drivers</strong> </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> ';
            }*/

            if (EmailData.isOutstation === true) {
                var html = '<div bgcolor=\'#e4e4e4\' text=\'#ff6633\' link=\'#666666\' vlink=\'#666666\' alink=\'#ff6633\' style=\'margin:0;font-family:Arial,Helvetica,sans-serif;border-bottom:1\'> <table background=\'\' bgcolor=\'#e4e4e4\' width=\'100%\' style=\'padding:20px 0 20px 0\' cellspacing=\'0\' border=\'0\' align=\'center\' cellpadding=\'0\'> <tbody> <tr></tr><tr> <td> <table width=\'620\' border=\'0\' align=\'center\' cellpadding=\'0\' cellspacing=\'0\' bgcolor=\'#FFFFFF\' style=\'border-radius: 5px;\'> <tbody> <tr> <td valign=\'top\' style=\'color:#404041;line-height:16px;padding:25px 20px 0px 20px\'> <center><img height = \'56px\' width =\'56px\' alt=\'My Image\' src=\'https://i.imgur.com/SghcaJg.png\' /></center> <p> <section style=\'position: relative;clear: both;margin: 5px 0;height: 1px;border-top: 1px solid #cbcbcb;margin-bottom: 25px;margin-top: 10px;text-align: center;\'> <h3 align=\'center\' style=\'margin-top: -12px;background-color: #FFF;clear: both;width: 180px;margin-right: auto;margin-left: auto;padding-left: 15px;padding-right: 15px; font-family: arial,sans-serif;\'> <span>INVOICE</span> </h3> </section> </p> </td> </tr> <tr> <td valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:25px 20px 0px 20px\'> <p> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Dear ' + EmailData.customerDetails.conUsers.firstName + ' ' + EmailData.customerDetails.conUsers.lastName + ',</h2></span> </p> <p> Thank you for availing services from Indian Drivers, Please find invoice details. </p> </td> </tr> <tr align=\'left\' > <td style=\'color:#404041;font-size:12px;line-height:16px;padding:10px 16px 20px 18px\'> <table width=\'0\' border=\'0\' align=\'left\' cellpadding=\'0\' cellspacing=\'0\'> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Invoice Details</h2></span> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Bill Date:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + billDate + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Booking Id:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + bookingId + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Duty Type:</strong> </td> <td width=\'120\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + dutyType + ' </td> </tr> </tbody> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Car Type:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + carType + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Journey Type:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + journeyType + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Reporting Date & Time:</strong> </td> <td width=\'120\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + reportDate + ' ' + EmailData.invoices[0].reportingTime + ' </td> </tr> </tbody> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Releiving Date & Time:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + relDate + ' ' + EmailData.invoices[0].releavingTime + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Outstation City:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + EmailData.outstationBookings[0].cityName + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Pickup Address:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + pickAddress + ' </td> </tr> </tbody> </table>  </td> </tr> <tr align=\'left\'> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:10px 16px 20px 18px\'> <table width=\'0\' border=\'0\' align=\'left\' cellpadding=\'0\' cellspacing=\'0\'> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Fare Details</h2></span> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Base Fare(12 Hours):</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 5px 3px 5px;border-bottom:solid 1px #999999\'> &#8377;' + baseFare + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Overtime Fare('+overtimeText+'):</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> &#8377;' + overtimeFare + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:13px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Grand Total:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#339933;font-size:13px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> <strong>&#8377;' + Math.round(EmailData.invoices[0].netAmount) + '</strong> </td> </tr> </td> </tr><tr> <td> <table width=\'550\' border=\'0\' cellspacing=\'0\' cellpadding=\'0\'> <tbody> <tr> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 5px 5px 10px\'> Food and other allowances are excluded in above bill and to be paid to the driver as per mobile application Rate Card.<br><br>For more information mail us at support@indian-drivers.com </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width=\'510\' border=\'0\' cellspacing=\'0\' cellpadding=\'0\'> <tbody> <tr> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 15px 10px 10px\'> <p> Thanks,<br> <strong>Team - Indian Drivers</strong> </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> ';
            } else {
                var html = '<div bgcolor=\'#e4e4e4\' text=\'#ff6633\' link=\'#666666\' vlink=\'#666666\' alink=\'#ff6633\' style=\'margin:0;font-family:Arial,Helvetica,sans-serif;border-bottom:1\'> <table background=\'\' bgcolor=\'#e4e4e4\' width=\'100%\' style=\'padding:20px 0 20px 0\' cellspacing=\'0\' border=\'0\' align=\'center\' cellpadding=\'0\'> <tbody> <tr></tr> <tr> <td> <table width=\'620\' border=\'0\' align=\'center\' cellpadding=\'0\' cellspacing=\'0\' bgcolor=\'#FFFFFF\' style=\'border-radius: 5px;\'> <tbody> <tr> <td valign=\'top\' style=\'color:#404041;line-height:16px;padding:25px 20px 0px 20px\'> <center><img height = \'56px\' width =\'56px\' alt=\'My Image\' src=\'https://i.imgur.com/SghcaJg.png\' /></center> <p> <section style=\'position: relative;clear: both;margin: 5px 0;height: 1px;border-top: 1px solid #cbcbcb;margin-bottom: 25px;margin-top: 10px;text-align: center;\'> <h3 align=\'center\' style=\'margin-top: -12px;background-color: #FFF;clear: both;width: 180px;margin-right: auto;margin-left: auto;padding-left: 15px;padding-right: 15px; font-family: arial,sans-serif;\'> <span>INVOICE</span> </h3> </section> </p> </td> </tr> <tr> <td valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:25px 20px 0px 20px\'> <p> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Dear ' + EmailData.customerDetails.conUsers.firstName + ' ' + EmailData.customerDetails.conUsers.lastName + ',</h2></span> </p> <p> Thank you for availing services from Indian Drivers, Please find invoice details. </p> </td> </tr> <tr align=\'left\' > <td style=\'color:#404041;font-size:12px;line-height:16px;padding:10px 16px 20px 18px\'> <table width=\'0\' border=\'0\' align=\'left\' cellpadding=\'0\' cellspacing=\'0\'> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Invoice Details</h2></span> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Bill Date:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + billDate + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Booking Id:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + bookingId + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Duty Type:</strong> </td> <td width=\'120\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + dutyType + ' </td> </tr> </tbody> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Car Type:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + carType + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Journey Type:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + journeyType + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Reporting Date & Time:</strong> </td> <td width=\'120\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + reportDate + ' ' + EmailData.invoices[0].reportingTime + ' </td> </tr> </tbody> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Releiving Date & Time:</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + relDate + ' ' + EmailData.invoices[0].releavingTime + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Pickup Address:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> ' + pickAddress + ' </td> </tr> </tbody> </table>  </td> </tr> <tr align=\'left\'> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:10px 16px 20px 18px\'> <table width=\'0\' border=\'0\' align=\'left\' cellpadding=\'0\' cellspacing=\'0\'> <span><h2 style=\'color: #848484; font-family: arial,sans-serif; font-weight: 200;\'>Fare Details</h2></span> <tbody> <tr> <td width=\'0\' align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Base Fare(04 Hours):</strong> </td> <td width=\'0\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:0px 5px 3px 5px;border-bottom:solid 1px #999999\'> &#8377;' + baseFare + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Overtime Fare('+overtimeText+'):</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> &#8377;' + overtimeFare + ' </td> </tr> <tr> <td align=\'left\' valign=\'top\' style=\'color:#404041;font-size:13px;line-height:16px;padding:5px 0px 3px 0px;border-bottom:solid 1px #999999\'> <strong>Grand Total:</strong> </td> <td width=\'62\' align=\'right\' valign=\'top\' style=\'color:#339933;font-size:13px;line-height:16px;padding:5px 5px 3px 5px;border-bottom:solid 1px #999999\'> <strong>&#8377;' + Math.round(EmailData.invoices[0].netAmount) + '</strong> </td> </tr> </td> </tr><tr> <td> <table width=\'550\' border=\'0\' cellspacing=\'0\' cellpadding=\'0\'> <tbody> <tr> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:15px 5px 5px 10px\'> Food and other allowances are excluded in above bill and to be paid to the driver as per mobile application Rate Card.<br><br>For more information mail us at support@indian-drivers.com </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table width=\'510\' border=\'0\' cellspacing=\'0\' cellpadding=\'0\'> <tbody> <tr> <td style=\'color:#404041;font-size:12px;line-height:16px;padding:5px 15px 10px 10px\'> <p> Thanks,<br> <strong>Team - Indian Drivers</strong> </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> ';
            }

            var Email = Bookings.app.models.Email;
            Email.send({
                to: EmailData.customerDetails.conUsers.email,
                from: EmailData.customerDetails.conUsers.email,
                subject: 'Indian Drivers - Booking Invoice',
                html: html
            }, function(err) {
                if (err) return console.log('> error sending password reset email');
                console.log('> sending email to: ' + EmailData.customerDetails.conUsers.email);
                cb(err, EmailDetails);
            });
        });


    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'sendInvoiceEmail', {
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
Bookings.getDriverStatus = function(driverId, cb) {
        // sql query
        var sql = 'select * from get_driver_status(\'' + driverId + '\' )';
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error get status of duty ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    Bookings.remoteMethod(
        'getDriverStatus', {
            accepts: [{
                arg: 'driverId',
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
    Bookings.getAnalysisDataByUser = function(userId, fromDate, toDate, cb) {
        // sql query

        console.log('fromdate' + fromDate);
        console.log('toDate' + toDate);
        console.log('userId' + userId);
       
        var sql = 'select * from get_analysis_data_by_user(' + userId + ', \'' + fromDate + '\', \'' + toDate + '\')';

        // call sql query from postreSQL
        Bookings.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting analysis data ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
    Bookings.remoteMethod(
        'getAnalysisDataByUser', {
            accepts: [{
                arg: 'userId',
                type: 'string',
                required: true
            },{
                arg: 'fromDate',
                type: 'string',
                required: true
            }, {
                arg: 'toDate',
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

    function sendMessage(mobileNumber, msg) {
        console.log('entered **************');
        var msg1='Dear Customer '; 
       
        var data = "";
        if(msg.includes("Your verification code is")){
            var msg1='Dear Customer '+msg+' Indian Drivers&templateid=1707164570613104930'; 
               }
               else if(msg.includes("km/hr. For queries kindly contact {#Var#}or info@indian-drivers.com.")){
                var msg1=msg+'&templateid=1707164576738820477';              
              }else if(msg.includes('please cancel the booking. For queries 020-67641000 or info@indian-drivers.com.')){
                var msg1=msg+'&templateid=1707164576687222444';
              } else if(msg.includes('For details download app (https://goo.gl/Z5tDgU). For inquiries call 020-67641000 Thank you Indian Drivers .')){
                var msg1=msg+'&templateid=1707164576694227173';
              }else if(msg.includes('Please contact customer desk for details.')){
                var msg1=msg+'&templateid=1707161744256646746';
              }else if(msg.includes('has been allocated to you for the booking dated')) {
                var msg1=msg+'&templateid=1707164576699758907';
         } 
        data += "username=msgs-driver";
        data += "&password=driver";
        data += "&type=0";
        data += "&dlr=1";
        data += "&destination=" + mobileNumber;
        data += "&source=INDRIV";
        data += "&sender=INDRIV";
        data += "&message=" + msg1 + msg ;

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
