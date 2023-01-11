module.exports = function(app) {


    var crypto = require('crypto');
    var rest = require('restler');
    var consts = require('../consts');
    var gcm = require('node-gcm');
    
    app.post('/pushNotification', function(req, res) {
        console.log('requested Body' + JSON.stringify(req.body));
        var deviceId = req.body.deviceId;
        //deviceId = JSON.parse(deviceId);

        var sender = new gcm.Sender(consts.SERVER_API_KEY_ANDROID_FOR_CUSTOMER_APP);

        var message = new gcm.Message({
            restrictedPackageName: "com.consrv.DIIMobile",
            data: {
                message: req.body.message,
                "title": 'Drivers In India'
            }

        });
        var registrationTokens = [];
        registrationTokens.push('' + deviceId);

     sender.send(message, { registrationTokens: registrationTokens }, 5, function (err, response) {
  if(err) console.error(err);
  else    console.log(response);
  res.send(response);
});
            
       
    });
    app.post('/pushNotificationForDriver', function(req, res) {
        console.log('requested Body' + JSON.stringify(req.body));
        var deviceId = req.body.deviceId;
        console.log('deviceId Body deviceId' + deviceId);
  
      deviceId = JSON.parse(deviceId);

      //  console.log('deviceId  after oo ' + deviceId[0]);

       
        
        console.log('registrationTokens  after' + JSON.stringify(deviceId[0].deviceId));
        

         var sender = new gcm.Sender(consts.SERVER_API_KEY_ANDROID_FOR_DRIVER_APP);

        var message = new gcm.Message({

            data: {
                message: req.body.message,
                "title": 'Drivers In India',
                parameter:req.body.parameter
            }

        });

       
        for(var i=0;i<deviceId.length;i++)
             {var registrationTokens = [];
                     registrationTokens.push('' + deviceId[i].deviceId);
             
                   sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
                          if(err) console.error(err);
                          else    console.log(response);

                        });}
                    res.send('sendSuccesfully');
           
        
    });




}