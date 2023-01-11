module.exports = function(BookingAnalysisData) {
  BookingAnalysisData.getAnalysisDataofYears = function(operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select distinct (year) as year, sum(local_total_time) as local_total_time, sum(local_overtime) as local_overtime,sum(outstation_total_time) as outstation_total_time, sum(outstation_overtime) as outstation_overtime from booking_analysis_data group by year';
    } else {
      var sql = 'select distinct (year) as year, sum(local_total_time) as local_total_time, sum(local_overtime) as local_overtime,sum(outstation_total_time) as outstation_total_time, sum(outstation_overtime) as outstation_overtime from booking_analysis_data where location =\'' + operationCity + '\' group by year';
    }
    // call sql query from postreSQL
    BookingAnalysisData.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting getAnalysisDataofYears ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  BookingAnalysisData.remoteMethod(
    'getAnalysisDataofYears', {
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

  BookingAnalysisData.getAnalysisDataofAll = function(year, firstMonth, secondMonth, thirdMonth, cb) {
    // sql query


   // var sql = 'select distinct month, year, sum(local_total_time) as local_total_time, sum(local_overtime) as local_overtime, sum(outstation_total_time) as outstation_total_time, sum(outstation_overtime) as outstation_overtime from booking_analysis_data GROUP BY month, year order by month';
    var sql = 'select month, year, sum(local_total_time) as local_total_time, sum(local_overtime) as local_overtime, sum(outstation_total_time) as outstation_total_time, sum(outstation_overtime) as outstation_overtime from booking_analysis_data where year =\'' + year + '\' and month in(\'' + firstMonth +'\', \'' + secondMonth +'\',\'' + thirdMonth +'\') GROUP BY month, year ORDER BY to_date(month,\'Month\')';
    // call sql query from postreSQL
    BookingAnalysisData.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting getAnalysisDataofYears ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  BookingAnalysisData.remoteMethod(
    'getAnalysisDataofAll', {
      accepts: [{
        arg: 'year',
        type: 'string',
        required: true
      },
      {
        arg: 'firstMonth',
        type: 'string',
        required: true
      },
      {
        arg: 'secondMonth',
        type: 'string',
        required: true
      },
      {
        arg: 'thirdMonth',
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
