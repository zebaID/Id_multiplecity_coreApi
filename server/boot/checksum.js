"use strict";

const https = require('https');
var crypt = require('./crypt');
var config = require('./pg').paytmnew;
var util = require('util');
var crypto = require('crypto');
const Paytm = require('paytmchecksum');

//mandatory flag: when it set, only mandatory parameters are added to checksum

function paramsToString(params, mandatoryflag) {
    var data = '';
    var flag = params.refund ? true : false;
    delete params.refund;
    var tempKeys = Object.keys(params);
    if (!flag) tempKeys.sort();
    tempKeys.forEach(function(key) {
        if (key !== 'CHECKSUMHASH') {
            if (params[key] === 'null') params[key] = '';
            if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
                data += (params[key] + '|');
            }
        }
    });
    return data;
}


function genchecksum(params, key, cb) {
   var flag = params.refund ? true : false;
   var data = paramsToString(params);

   crypt.gen_salt(4, function(err, salt) {
       var sha256 = crypto.createHash('sha256').update(data + salt).digest('hex');
       var check_sum = sha256 + salt;
       var encrypted = crypt.encrypt(check_sum, key);
       if (flag) {
           params.CHECKSUM = encodeURIComponent(encrypted);
           params.CHECKSUM = encrypted;
       } else {
           params.CHECKSUMHASH = encodeURIComponent(encrypted);
           params.CHECKSUMHASH = encrypted;
       }
       params.payt_STATUS = 1;
       cb(undefined, params);
   });
}


function verifychecksum(params, key) {

    if (!params) console.log("params are null");

    var data = paramsToString(params, false);
    //TODO: after PG fix on thier side remove below two lines
    if (params.CHECKSUMHASH) {
        params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\n', '');
        params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\r', '');

        var temp = decodeURIComponent(params.CHECKSUMHASH);
        var checksum = crypt.decrypt(temp, key);
        var salt = checksum.substr(checksum.length - 4);
        var sha256 = checksum.substr(0, checksum.length - 4);
        var hash = crypto.createHash('sha256').update(data + salt).digest('hex');
        if (hash === sha256) {
            return true;
        } else {
            util.log("checksum is wrong");
            return false;
        }
    } else {
        util.log("checksum not found");
        return false;
    }
}

module.exports.genchecksum = genchecksum;
module.exports.verifychecksum = verifychecksum;

module.exports = function(app) {

    app.post('/genchecksum_paytm', function(req, res) {

        var ver_param = req.body;
        console.log('ver_param : ' + JSON.stringify(ver_param));

        if (ver_param !== undefined && ver_param.MID !== undefined) {
            genchecksum(ver_param, 'vj0CPrA4kvr5lBM7', function(err, chkres) {
                console.log('genchecksum res : ' + JSON.stringify(chkres));
                res.send(chkres);
            });
        } else {
            res.send('Please provide valud parameters');
        }

    });
    
    
    app.post('/genchecksum_paytm_new', function(req, res) {

        var ver_param = req.body;
        console.log('ver_param : ' + JSON.stringify(ver_param));

        if (ver_param !== undefined && ver_param.mid !== undefined) {
            
            Paytm.generateSignature(JSON.stringify(ver_param), "vj0CPrA4kvr5lBM7").then(function(checksum){
                //vj0CPrA4kvr5lBM7
                var paytmParams = {};
                
                paytmParams.body =ver_param;
                 paytmParams.head = {
                  "signature": checksum
                 };
                
                var post_data = JSON.stringify(paytmParams);

                var options = {
            
                    /* for Staging */
                    // hostname: 'securegw-stage.paytm.in',
            
                    /* for Production */
                    hostname: 'securegw.paytm.in',
            
                    port: 443,
                    path: '/theia/api/v1/initiateTransaction?mid='+ver_param.mid+'&orderId='+ver_param.orderId+'',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };
    
                var response = "";
                var post_req = https.request(options, function(post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });
            
                    post_res.on('end', function(){
                        res.send(response);
                        console.log('Response: ', response);
                    });
                });
    
                    post_req.write(post_data);
                    post_req.end();
                });

            
                //res.send(checksum);
          

            // genchecksum(ver_param, 'vj0CPrA4kvr5lBM7', function(err, chkres) {
            //     console.log('genchecksum res : ' + JSON.stringify(chkres));
            //     res.send(chkres);
            // });
            
            
        } else {
            res.send('Please provide valud parameters');
        }

    });

    

app.post('/verifychecksum_paytm', function(request, response) {
       var ver_param = request.body;
       console.log('ver_param : ' + JSON.stringify(ver_param));
       if (ver_param !== undefined && ver_param.MID !== undefined) {
           var result = verifychecksum(ver_param, 'vj0CPrA4kvr5lBM7');
           console.log('verifychecksum result : ' + result);

           response.setHeader('Content-type', 'text/html');

           if (result) {
               ver_param.IS_CHECKSUM_VALID = "Y";
           } else {
               ver_param.IS_CHECKSUM_VALID = "N";
           }
           if (ver_param.CHECKSUMHASH) {
               delete ver_param.CHECKSUMHASH;
           }

           var innerHTML = '<html>';
           innerHTML = innerHTML + '<head>';
           innerHTML = innerHTML + '<meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-I">';
           innerHTML = innerHTML + '<title>Paytm</title>';
           innerHTML = innerHTML + '<script type="text/javascript">';
           innerHTML = innerHTML + 'function response(){';
           innerHTML = innerHTML + 'return document.getElementById("response").value;';
           innerHTML = innerHTML + '}';
           innerHTML = innerHTML + '</script>';
           innerHTML = innerHTML + '</head>';
           innerHTML = innerHTML + '<body>';
           innerHTML = innerHTML + 'Redirect back to the app<br>';
           innerHTML = innerHTML + '<form name="frm" method="post">';
           innerHTML = innerHTML + '<input type="hidden" id="response" name="responseField" value=\'' + htmlEscape(JSON.stringify(ver_param)) + '\'>';
           innerHTML = innerHTML + '</form>';
           innerHTML = innerHTML + '</body>';
           innerHTML = innerHTML + '</html>';

           console.log('verifychecksum innerHTML : ' + innerHTML);

           response.send(innerHTML);
       } else {
           response.send('Please provide valud parameters');
       }    
   });
function htmlEscape(str) {
       return String(str)
           .replace(/&/g, '&amp;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&#39;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;');
   }

};
/* ---------------- TEST CODE ---------------- */

// (function() {

//     if (require.main === module) {
//         var ver_param = {
//             MID: 'wVhtoq05771472615938',
//             ORDER_ID: 52,
//             CUST_ID: '298233',
//             TXN_AMOUNT: '1',
//             CHANNEL_ID: 'WEB',
//             INDUSTRY_TYPE_ID: 'Retail',
//             WEBSITE: 'PaytmMktPlace',
//             CHECKSUMHASH: '5xORNy+qP7G53XWptN7dh1AzD226cTTDsUe4yjAgKe19eO5olCPseqhFDmlmUTcSiEJFXuP/usVEjHlfMCgvqtI8rbkoUCVC3uKZzOBFpOw='
//         };
//         genchecksum(ver_param, config.mid_key_map[ver_param.MID], function(err, res) {
//             console.log(res);
//         });
//         if (verifychecksum(ver_param, config.mid_key_map[ver_param.MID])) {
//             console.log('verified checksum');
//         } else {
//             console.log("verification failed");
//         }

//     }
// }());
