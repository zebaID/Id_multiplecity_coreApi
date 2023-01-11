module.exports = function(OtherJobsDetails) {


OtherJobsDetails.createNewOtherJob = function(
  alternateNumber,
 jobReportingAddress,
  designation,
   jobProfile,
    dutyTime, 
    age,
     education,
      experience,
      salaryRange, 
      remark, 
      status, 
      customerId, 
      weeklyOff,
       createdBy,
       operationCity, 
       cb) {
        if(weeklyOff == '' || weeklyOff == undefined){
            weeklyOff = null;
        }
        
        // sql query
        var sql = 'select * from create_new_other_job(\'' + alternateNumber + '\', \'' + jobReportingAddress + '\', \'' + designation + '\', \'' + jobProfile + '\', \'' + dutyTime + '\', \'' + age + '\', \''+ education +'\', ' + experience + ', \'' + salaryRange + '\', \''+ remark +'\', \''+ status +'\', ' + customerId + ', \'' + weeklyOff + '\', ' + createdBy + ', \''+ operationCity + '\')';


        // call sql query from postreSQL
        OtherJobsDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error creating new job ...');
                console.log(err);
                return cb(err);
            } else {
                cb(err, result);
            }

        });

    };

    //Remote method to get provider of email

    OtherJobsDetails.remoteMethod(
        'createNewOtherJob', {
            accepts: [{
                arg: 'alternateNumber',
                type: 'string',
                required: false
            }, {
                arg: 'jobReportingAddress',
                type: 'string',
                required: true
            }, {
                arg: 'designation',
                type: 'string',
                required: true
            }, {
                arg: 'jobProfile',
                type: 'string',
                required: true
            }, {
                arg: 'dutyTime',
                type: 'string',
                required: true
            }, {
                arg: 'age',
                type: 'string',
                required: true
            },{
                arg: 'education',
                type: 'string',
                required: true
            },{
                arg: 'experience',
                type: 'string',
                required: true
            },{
                arg: 'salaryRange',
                type: 'string',
                required: true
            },{
                arg: 'remark',
                type: 'string',
                required: false
            },{
                arg: 'status',
                type: 'string',
                required: true
            },{
                arg: 'customerId',
                type: 'string',
                required: true
            },{
                arg: 'weeklyOff',
                type: 'string',
                required: true
            },{
                arg: 'createdBy',
                type: 'string',
                required: true
            },{
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
                verb: 'post'
            }
        }
    );


    OtherJobsDetails.getOtherJobOpenReport = function(operationCity, cb) {
    // sql query
    if (operationCity === 'All') {
      var sql = 'select o.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.first_name, u.last_name, u.mobile_number, u.email, o.customer_id,o.alternate_number, o.status, o.job_reporting_address, o.designation,o.duty_time,o.age, o.created_date, o.created_by, o.education, o.experience,o.salary_range,o.job_profile,o.remark,o.weekly_off,o.operation_city,o.created_by_name from other_jobs_details o, customer_details c, con_users u where u.id=c.conuser_id and c.id=o.customer_id and o.status=\'Open\' order by o.created_date DESC';
    } else {
     var sql = 'select o.id, concat(u.first_name || \' \' || u.last_name || \'(\' || u.mobile_number || \')\') as name, u.first_name, u.last_name, u.mobile_number, u.email, o.customer_id,o.alternate_number, o.status, o.job_reporting_address, o.designation,o.duty_time,o.age, o.created_date, o.created_by, o.education, o.experience,o.salary_range,o.job_profile,o.remark,o.weekly_off,o.operation_city,o.created_by_name from other_jobs_details o, customer_details c, con_users u where u.id=c.conuser_id and c.id=o.customer_id and o.status=\'Open\' and o.operation_city= \'' + operationCity + '\' order by o.created_date DESC';
    }

    //select * from driver_account_transactions where created_date > (TIMESTAMP \'today\')
    // call sql query from postreSQL
    OtherJobsDetails.app.datasources.postgres.connector.query(sql, function(err, result) {
      if (err) {
        console.log('Error getting driver transaction ...');
        console.log(err);
        return cb(err);
      }
      cb(err, result);
    });

  };

  //Remote method to get provider of email

  OtherJobsDetails.remoteMethod(
    'getOtherJobOpenReport', {
      accepts: [{
          arg: 'operationCity',
          type: 'string',
          required: true
        }
      ],
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
