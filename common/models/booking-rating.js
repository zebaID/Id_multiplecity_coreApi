'use strict';

module.exports = function(Bookingrating) {

Bookingrating.submitFeedback = function(questionId, bookingId, rating, comment, cb) {
        // sql query
        var sql = 'select * from submit_feedback(\'' + questionId + '\'::INT[],' + bookingId +',' + rating + ',\''+comment+'\')';

        // call sql query from postreSQL
        Bookingrating.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error submitting driver feedback ...');
                console.log(err);
                return cb(err);
            }else{
                
               console.log('success submitting driver feedback: '+JSON.stringify(result)); 
               cb(err, result); 
            }
        });

    };

    //Remote method to get provider of email

    Bookingrating.remoteMethod(
        'submitFeedback', {
            accepts: [{
                arg: 'questionId',
                type: 'string',
                required: true
            },{
                arg: 'bookingId',
                type: 'string',
                required: true
            },{
                arg: 'rating',
                type: 'string',
                required: true
            },{
                arg: 'comment',
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
