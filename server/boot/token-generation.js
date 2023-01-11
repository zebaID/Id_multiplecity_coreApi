module.exports = function(app) {
 var crypto = require('crypto');
  var rest = require('restler');
  var consts = require('../consts');

  app.post('/sendToken', function(req, res) {
      console.log('requested Body' + JSON.stringify(req.body));
      var userId = req.body.conuserId;
      var accessToken = req.body.accessToken;
      var mobileNo = req.body.mobileNo;
      mobileNo = parseInt(mobileNo);


      var token = '' + randomValueBase64(0); // value 'ad0fc8c'

      console.log('token : ' + token);

      var jsonData = {
          "otp": token
      };
      var updateLocUrl = consts.SERVER_URL + '/api/ConUsers/' + userId + '?access_token=' + accessToken;
     
      rest.putJson(updateLocUrl, jsonData)
          .on('complete', function(insertToken, tokenResponse) {
              if (insertToken) {
                  console.log('insertToken' + JSON.stringify(insertToken));
              }
              res.send({
                  "token": token
              });

          });



      sendSms(mobileNo, token);

  });

function sendSms(mobileno, token) {
      var msg = 'Your verification code is-' + token;
      var data = "";
      data += "method=sendMessage";
      data += "&auth_scheme=PLAIN";
      data += "&userid=2000112924"; // your loginId 
      data += "&password=" +
          encodeURIComponent("DIIp@s$w0rd"); // your password 
      data += "&msg=" + encodeURIComponent(msg).replace("+", "%20");
      data += "&msg_type=TEXT"; // Can by "FLASH" or      "UNICODE_TEXT" or “BINARY”
      data += "&send_to=" +
          encodeURIComponent(mobileno); // a valid 10 digit phone no. 
      data += "&template_id=313426";
      data += "&v=1.1";
      data += "&format=text";


      var url = 'http://enterprise.smsgupshup.com/GatewayAPI/rest?' + data;
      console.log('url = ' + url);
      rest.post(url)
          .on('complete', function(response) {
              if (response) {
                  console.log('response = ' + response);

              }

          });

  }



  function randomValueBase64(len) {
      if (len > 0) {
          return crypto.randomBytes(Math.ceil(len * 3 / 4))
              .toString('base64') // convert to base64 format
              .slice(0, len) // return required number of characters
              .replace(/\+/g, '0') // replace '+' with '0'
              .replace(/\//g, '0'); // replace '/' with '0'
              }
       else {
          return Math.floor((Math.random() * 999999) + 1);
      }
  }
};