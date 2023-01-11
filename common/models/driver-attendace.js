module.exports = function(DriverAttendance) {

	DriverAttendance.addDriverAttendance = function(driverId,company2CustomerId,dutyType,inDate,inTime,outDate,outTime,status,createdBy, city,customerId, cb) {
    // sql query
    var sql = 'select * from addDriverAttendance(\'' + driverId + '\',\'' + company2CustomerId + '\',\'' + dutyType + '\',\'' + inDate + '\',\'' + inTime + '\',\'' + outDate + '\',\'' + outTime + '\',\'' + status + '\',\'' + createdBy + '\',\'' + city + '\',\'' + customerId + '\')';

    // call sql query from postreSQL
    DriverAttendance.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  DriverAttendance.remoteMethod(
    'addDriverAttendance', {
      accepts: [{
        arg: 'driverId',
        type: 'string',
        required: true
      },{
        arg: 'company2CustomerId',
        type: 'string',
        required: true
      },{
        arg: 'dutyType',
        type: 'string',
        required: true
      },{
        arg: 'inDate',
        type: 'string',
        required: true
      },{
        arg: 'inTime',
        type: 'string',
        required: true
      },{
        arg: 'outDate',
        type: 'string',
        required: true
      },{
        arg: 'outTime',
        type: 'string',
        required: true
      },{
        arg: 'status',
        type: 'string',
        required: true
      },{
        arg: 'createdBy',
        type: 'string',
        required: true
      },{
        arg: 'city',
        type: 'string',
        required: true
      },{
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


    DriverAttendance.driverOnDuty = function(driverId,company2CustomerId,dutyType,inDate,inTime,status,createdBy,customerId,city, cb) {
    // sql query
    var sql = 'select * from driveronduty(\'' + driverId + '\',\'' + company2CustomerId + '\',\'' + dutyType + '\',\'' + inDate + '\',\'' + inTime + '\',\'' + status + '\',\'' + createdBy + '\',\'' + customerId + '\',\'' + city + '\')';

    // call sql query from postreSQL
    DriverAttendance.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  DriverAttendance.remoteMethod(
    'driverOnDuty', {
      accepts: [{
        arg: 'driverId',
        type: 'string',
        required: true
      },{
        arg: 'company2CustomerId',
        type: 'string',
        required: true
      },{
        arg: 'dutyType',
        type: 'string',
        required: true
      },{
        arg: 'inDate',
        type: 'string',
        required: true
      },{
        arg: 'inTime',
        type: 'string',
        required: true
      },{
        arg: 'status',
        type: 'string',
        required: true
      },{
        arg: 'createdBy',
        type: 'string',
        required: true
      },{
        arg: 'customerId',
        type: 'string',
        required: true
      },{
        arg: 'city',
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

  DriverAttendance.driverAttendanceStatus = function(driverId, cb) {
    // sql query
    var sql = 'select * from driver_attendance_status(\'' + driverId + '\')';

    // call sql query from postreSQL
    DriverAttendance.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  DriverAttendance.remoteMethod(
    'driverAttendanceStatus', {
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
  DriverAttendance.verifyDriverExist = function(driverId, cb) {
    // sql query
    var sql = 'select * from verify_driver_exist(\'' + driverId + '\')';

    // call sql query from postreSQL
    DriverAttendance.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver allocate to customer ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email
  DriverAttendance.remoteMethod(
    'verifyDriverExist', {
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
   
};
