var config = require('../../server/config.json');
var rest = require('restler');
var consts = require('../../server/consts');
var uid = require('rand-token').uid;
module.exports = function(ConUsers) {


     // function to get provider of email
    ConUsers.accountProvider = function(emailId, cb) {
        // sql query
        var sql = 'select email from con_users where email=\'' + emailId + '\' ';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error verifying account email ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'accountProvider', {
            accepts: {
                arg: 'emailId',
                type: 'string',
                required: true
            },
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
    
    ConUsers.updateProfile = function(firstName, middleName, lastName, email, address,address_lat, address_long,userId, operationCity, cb) {
        // sql query
        var sql =  'update con_users set first_name=\'' + firstName + '\', middle_name=\'' + middleName + '\', last_name=\'' + lastName + '\', email=\'' + email + '\', address=\'' + address + '\', address_lat=' + address_lat + ', address_long='+ address_long + ', operation_city=\'' + operationCity + '\' WHERE id=' + userId + '';
        

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error verifying account email ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'updateProfile', {
           accepts: [{
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
            arg: 'email',
            type: 'string',
            required: true
          }, {
            arg: 'address',
            type: 'string',
            required: true
          }, {
            arg: 'address_lat',
            type: 'string',
            required: true
          }, {
            arg: 'address_long',
            type: 'string',
            required: true
          }, {
            arg: 'userId',
            type: 'string',
            required: true
          }, {
            arg: 'operationCity',
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
    
    
      //send password reset link when requested
    ConUsers.on('resetPasswordRequest', function(info) {
        var url = consts.WEB_SERVER_URL + '#/page/resetPassword/' + info.accessToken.id;
        var html = 'Click on the following link to create a new password for your Indian Drivers account.<br/><a href=\"' + url.toString() + '\">Create a new password</a><br/><br/>Regards,<br/>Indian Drivers Team';

        ConUsers.app.models.Email.send({
            to: info.email,
            from: info.email,
            subject: 'Password reset',
            html: html
        }, function(err) {
            if (err) return console.log('> error sending password reset email');
            console.log('> sending password reset email to:', info.email);
        });
    });

    ConUsers.createCustomer = function(firstName, middleName, lastName, mobileNumber, email, password, address, addressLine2, userId, status, customerType, operationCity, cb) {

   // var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addressLine2 + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    var latitude =0;
    var longitude= 0;
    //var city =operationCity;
    var result = [];
    if (middleName == '' || middleName == undefined) {
      middleName = null;
    }
    console.log("hi");
    var CustomerDetails = ConUsers.app.models.CustomerDetails;
    var UserRoles = ConUsers.app.models.UserRoles;
    
        ConUsers.create({
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            username: mobileNumber,
            password: password,
            email: email,
            address: address,
            addressLine2: addressLine2,
            addressLat: latitude,
            addressLong: longitude,
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
                customerType: customerType
              }, function(custErr, custData) {

              result.push(custData);
                if (custData != null) {

                }else{
                 // cb(custErr);
                }

                UserRoles.create({
                  conuserId: newConUser.id,
                  roleId: 2,
                  createdBy: userId
                }, function(roleErr, roleData) {

                  //result.push(roleData);
                  if (roleData != null) {

                  }
                  cb(roleErr, result);
                });
              });
            } else {
             // cb(err);
            }
          });

      

  };
  ConUsers.remoteMethod(
    'createCustomer', {
      accepts: [{
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
        arg: 'email',
        type: 'string',
        required: true
      }, {
        arg: 'password',
        type: 'string',
        required: true
      }, {
        arg: 'address',
        type: 'string',
        required: true
      }, {
        arg: 'addressLine2',
        type: 'string',
        required: false
      }, {
        arg: 'userId',
        type: 'string',
        required: true
      }, {
        arg: 'status',
        type: 'string',
        required: true
      }, {
        arg: 'customerType',
        type: 'string',
        required: false
      }, {
        arg: 'operationCity',
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


ConUsers.createCustomerEnquiry = function(firstName, lastName, mobileNumber, email,address, userId, status, password, operationCity, cb) {
   // var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addressLine2 + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    var latitude =0;
    var longitude= 0;
    var result = [];
    console.log("hi");
    var CustomerDetails = ConUsers.app.models.CustomerDetails;
    var UserRoles = ConUsers.app.models.UserRoles;
        ConUsers.create({
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            username: mobileNumber,
            password: password,
            email: email,
            address: address,
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
                customerType: 'O',
                requirementStatus:'E'
              }, function(custErr, custData) {
                result.push(custData);
                if (custData != null) {
                }
                UserRoles.create({
                  conuserId: newConUser.id,
                  roleId: 2,
                  createdBy: userId
                }, function(roleErr, roleData) {
                  result.push(roleData);
                  if (roleData != null) {
                  }
                  cb(roleErr, result);
                });
              });
            } else {
              cb(err);
            }
          });
  };
  ConUsers.remoteMethod(
    'createCustomerEnquiry', {
      accepts: [{
        arg: 'firstName',
        type: 'string',
        required: true
      },{
        arg: 'lastName',
        type: 'string',
        required: true
      }, {
        arg: 'mobileNumber',
        type: 'string',
        required: true
      }, {
        arg: 'email',
        type: 'string',
        required: true
      }, {
        arg: 'address',
        type: 'string',
        required: true
      }, {
        arg: 'userId',
        type: 'string',
        required: true
      }, {
        arg: 'status',
        type: 'string',
        required: true
      }, {
        arg: 'password',
        type: 'string',
        required: true
      },
       {
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


    ConUsers.createDriver = function(firstName, middleName, lastName, mobileNumber, email, address, userId, status, isLuxury, permanentAddress, bankName, accountNumber, ifscCode, emergencyNumber, pv, cpv, trDate, ntDate, driverBatch, freeAddress, driverCode, operationCity, BDate,Experience,cb) {

    //var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    var latitude;
    var longitude;
    var result = [];
    if (middleName == '' || middleName == undefined) {
      middleName = null;
    }

    var DriverDetails = ConUsers.app.models.DriverDetails;
    var UserRoles = ConUsers.app.models.UserRoles;
   /* rest.get(mapUrl)
      .on('complete', function(mapData, mapResponse) {
    
        if (mapData.errno == null || mapData.errno == undefined) {
          if (mapData.result !== null) {*/
            latitude = 0;
            longitude = 0;
         /* }

        }*/

        ConUsers.create({
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            username: mobileNumber,
            password: mobileNumber,
            email: email,
            address: address,
            addressLat: latitude,
            addressLong: longitude,
            createdBy: userId,
            status: status,
            operationCity: operationCity

          },
          function(err, newConUser) {
            result.push(newConUser);

            if (newConUser != null) {
              DriverDetails.create({
                conuserId: newConUser.id,
                createdBy: userId,
                isLuxury: isLuxury,
                permanentAddress: permanentAddress,
                bankName: bankName,
                accountNumber: accountNumber,
                ifscCode: ifscCode,
                emergencyNumber: emergencyNumber,
                pv: pv,
                cpv: cpv,
                trDate: trDate,
                ntDate: ntDate,
                driverBatch: driverBatch,
                freeAddress: freeAddress,
                driverCode: driverCode,
                BDate:BDate,
                Experience:Experience

              }, function(driverErr, driverData) {

                result.push(driverData);
                if (driverData != null) {

                }

                UserRoles.create({
                  conuserId: newConUser.id,
                  roleId: 3,
                  createdBy: userId
                }, function(roleErr, roleData) {

                  result.push(roleData);
                  if (roleData != null) {

                  }
                  cb(roleErr, result);
                });
              });
            } else {
              cb(err);
            }
          });

     /* });*/

  };

  ConUsers.remoteMethod(
    'createDriver', {
      accepts: [{
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
        arg: 'email',
        type: 'string',
        required: true
      }, {
        arg: 'address',
        type: 'string',
        required: true
      }, {
        arg: 'userId',
        type: 'string',
        required: true
      }, {
        arg: 'status',
        type: 'string',
        required: true
      }, {
        arg: 'isLuxury',
        type: 'string',
        required: true
      }, {
        arg: 'permanentAddress',
        type: 'string',
        required: true
      }, {
        arg: 'bankName',
        type: 'string',
        required: false
      }, {
        arg: 'accountNumber',
        type: 'string',
        required: false
      }, {
        arg: 'ifscCode',
        type: 'string',
        required: false
      }, {
        arg: 'emergencyNumber',
        type: 'string',
        required: false
      }, {
        arg: 'pv',
        type: 'boolean',
        required: false
      }, {
        arg: 'cpv',
        type: 'boolean',
        required: false
      }, {
        arg: 'trDate',
        type: 'string',
        required: false
      }, {
        arg: 'ntDate',
        type: 'string',
        required: false
      }, {
        arg: 'driverBatch',
        type: 'string',
        required: false
      }, {
        arg: 'freeAddress',
        type: 'string',
        required: false
      }, {
        arg: 'driverCode',
        type: 'string',
        required: true
      }, {
        arg: 'operationCity',
        type: 'string',
        required: true
      },{
        arg: 'BDate',
        type: 'string',
        required: true
      },{
        arg: 'Experience',
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
  ConUsers.createDriverEnquiry = function(firstName, lastName, mobileNumber, email, userId, status, password, operationCity, cb) {

   // var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addressLine2 + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    var latitude =0;
    var longitude= 0;
    
    var result = [];
     
    console.log("hi");
    var DriverDetails = ConUsers.app.models.DriverDetails;
    var UserRoles = ConUsers.app.models.UserRoles;
    
        ConUsers.create({
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            username: mobileNumber,
            password: password,
            email: email,
            createdBy: userId,
            status: status,
            operationCity: operationCity

          },
          function(err, newConUser) {
            result.push(newConUser);
            if (newConUser != null) {
             DriverDetails.create({
                conuserId: newConUser.id,
                createdBy: userId,
                
              }, function(driverErr, driverData) {

                result.push(driverData);
                if (driverData != null) {

                }

                UserRoles.create({
                  conuserId: newConUser.id,
                  roleId: 2,
                  createdBy: userId
                }, function(roleErr, roleData) {

                  result.push(roleData);
                  if (roleData != null) {

                  }
                  cb(roleErr, result);
                });
              });
            } else {
              cb(err);
            }
          });

      

  };

  ConUsers.remoteMethod(
    'createDriverEnquiry', {
      accepts: [{
        arg: 'firstName',
        type: 'string',
        required: true
      },{
        arg: 'lastName',
        type: 'string',
        required: true
      }, {
        arg: 'mobileNumber',
        type: 'string',
        required: true
      }, {
        arg: 'email',
        type: 'string',
        required: true
      }, {
        arg: 'userId',
        type: 'string',
        required: true
      }, {
        arg: 'status',
        type: 'string',
        required: true
      }, {
        arg: 'password',
        type: 'string',
        required: true
      },
       {
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
     ConUsers.createAgentUser = function(firstName, middleName, lastName, mobileNumber, email, userId, status, roleId, operationCity, cb) {
    
    var latitude;
    var longitude;
    var result = [];
    if (middleName == '' || middleName == undefined) {
      middleName = null;
    }

    var AgentDetails = ConUsers.app.models.AgentDetails;
    var UserRoles = ConUsers.app.models.UserRoles;

    ConUsers.create({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        username: mobileNumber,
        password: mobileNumber,
        email: email,
        createdBy: userId,
        status: status,
        operationCity: operationCity

      },
      function(err, newConUser) {
        result.push(newConUser);

        if (newConUser != null) {
          AgentDetails.create({
            conuserId: newConUser.id,
            createdBy: userId
          }, function(agentErr, agentData) {

            result.push(agentData);
            if (agentData != null) {

            }
            var userRoleStatus;
            for (var j = 0; j < roleId.length; j++) {
              if (roleId[j] == 1) {
                userRoleStatus = true;
              }
            }
            if (userRoleStatus == true) {
              UserRoles.create({
                conuserId: newConUser.id,
                roleId: 1,
                createdBy: userId
              }, function(roleErr, roleData) {

                result.push(roleData);
                if (roleData != null) {

                }

              });
            } else {
              for (var k = 0; k < roleId.length; k++) {
                UserRoles.create({
                  conuserId: newConUser.id,
                  roleId: roleId[k],
                  createdBy: userId
                }, function(roleErr, roleData) {

                  result.push(roleData);
                  if (roleData != null) {

                  }

                });
              }
            }



            cb(agentErr, result);
          });
        } else {
          cb(err);
        }
      });



  };

  ConUsers.remoteMethod(
    'createAgentUser', {
      accepts: [{
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
        arg: 'email',
        type: 'string',
        required: true
      }, {
        arg: 'userId',
        type: 'string',
        required: true
      }, {
        arg: 'status',
        type: 'string',
        required: true
      }, {
        arg: 'roleId',
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
        verb: 'post'
      }
    }
  );
ConUsers.loginWithFacebook = function(credentials, cb) {

        // body...
        var jsonobj = JSON.parse(credentials);
        var accessToken = jsonobj.authResponse.accessToken;
        var fbId = jsonobj.authResponse.userID;
        var token = uid(64);
        var roleId = jsonobj.roleId;
        var response = null;
        var user = null;
        var emailId = jsonobj.email;
        var firstName = jsonobj.firstName;
        var lastName = jsonobj.lastName;
        var AccessTokens = ConUsers.app.models.AccessTokens;
        var d1 = new Date();
        var UserRoles = ConUsers.app.models.UserRoles;
        var CustomerDetails = ConUsers.app.models.CustomerDetails;

        rest.get('https://graph.facebook.com/me?fields=id&access_token=' + accessToken)
            .on('complete', function(userData, errorResponse) {
                console.log('User Data ' + userData.id);
                if (fbId == userData.id) {
                    console.log('same user');
                    ConUsers.findOne({
                            where: {
                                email: emailId
                            }
                        },
                        function(err, instance) {

                            console.log('instance :' + instance);
                            // console.log(err);
                            console.log('Token ' + token);
                            if (instance != null) {
                                //cb(null, instance);
                                user = instance;

                                getAccessToken(token, d1, user, fbId, 'facebook', cb);
                            } else {
                                ConUsers.create({
                                        firstName: firstName,
                                        lastName: lastName,
                                        username: fbId,
                                        password: fbId,
                                        email: emailId,
                                        status: 'Active'
                                    },
                                    function(err, newConUser) {
                                        console.log('User : ' + newConUser);
                                        console.log('Error : ' + err);
                                        user = newConUser;
                                        if (newConUser != null) {
                                            UserRoles.create({
                                                conuserId: newConUser.id,
                                                roleId: roleId
                                            }, function(err, newRole) {
                                                console.log('Role : ' + newRole);
                                                if (err) {
                                                    cb(err);
                                                }
                                            });
                                            CustomerDetails.create({
                                                conuserId: newConUser.id
                                            }, function(err, newCustomer) {
                                                console.log('CustomerDetails : ' + newCustomer);
                                                if (err) {
                                                    cb(err);
                                                }
                                            });
                                            getAccessToken(token, d1, user, fbId, 'facebook', cb);
                                        } else {
                                            cb(null, err);
                                        }

                                    });
                            }


                        }
                    );
                } else {
                    console.log('different user');
                    cb('Different User');
                }

            });
    };

    //Remote method to login with facebook

    ConUsers.remoteMethod(
        'loginWithFacebook', {
            accepts: {
                arg: 'credentials',
                type: 'string',
                required: true
            },
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

    ConUsers.loginWithGoogle = function(credentials, cb) {

        // body...
        var jsonobj = JSON.parse(credentials);

        var UserRoles = ConUsers.app.models.UserRoles;

        var googleId = jsonobj.userId;
        var token = uid(64);
        var response = null;
        var user = null;
        var emailId = jsonobj.email;
        var roleId = jsonobj.roleId;
        var firstName = jsonobj.firstName;
        var platform = jsonobj.platform;
        var lastName = jsonobj.lastName;
        var AccessTokens = ConUsers.app.models.AccessTokens;
        var d1 = new Date();
        var CustomerDetails = ConUsers.app.models.CustomerDetails;


        console.log('credentials: ' + credentials);
        if (platform == 'ios' || platform == 'IOS') {
            var accessToken = jsonobj.accessToken;
            rest.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken)
                .on('complete', function(userData, errorResponse) {
                    console.log('User Data ' + userData.user_id);
                    if (googleId == userData.user_id && userData.audience == consts.GOOGLE_IOS_CLIENT_ID) { //&& userData.audience == consts.GOOGLE_CLIENT_ID 
                        console.log('same user');
                        ConUsers.findOne({
                                where: {
                                    email: emailId
                                }
                            },
                            function(err, instance) {

                                console.log('instance :' + instance);
                                // console.log(err);
                                console.log('Token ' + token);
                                if (instance != null) {
                                    //cb(null, instance);
                                    user = instance;

                                    getAccessToken(token, d1, user, googleId, 'google', cb);
                                } else {
                                    ConUsers.create({
                                            firstName: firstName,
                                            lastName: lastName,
                                            username: googleId,
                                            password: googleId,
                                            email: emailId,
                                            status: 'Active'
                                        },
                                        function(err, newConUser) {
                                            console.log('User : ' + newConUser);
                                            console.log('Error : ' + err);
                                            user = newConUser;
                                            if (newConUser != null) {
                                                UserRoles.create({
                                                    conuserId: newConUser.id,
                                                    roleId: roleId
                                                }, function(err, newRole) {
                                                    console.log('Role : ' + newRole);
                                                    if (err) {
                                                        cb(err);
                                                    }
                                                });
                                                CustomerDetails.create({
                                                    conuserId: newConUser.id
                                                }, function(err, newCustomer) {
                                                    console.log('CustomerDetails : ' + newCustomer);
                                                    if (err) {
                                                        cb(err);
                                                    }
                                                });
                                                getAccessToken(token, d1, user, googleId, 'google', cb);
                                            } else {
                                                cb(err);
                                            }

                                        });
                                }


                            }
                        );
                    } else {
                        console.log('different user');
                        cb('Different User');
                    }
                });
        } else {
            if (platform == 'android' || platform == 'ANDROID') {
                var oauthToken = jsonobj.oauthToken;
                rest.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + oauthToken)
                    .on('complete', function(userData, errorResponse) {
                        console.log('User Data ' + userData.user_id);
                        /*if (googleId == userData.user_id && userData.audience == consts.GOOGLE_ANDROID_CLIENT_ID) {
                            console.log('same user');*/
                            ConUsers.findOne({
                                    where: {
                                        email: emailId
                                    }
                                },
                                function(err, instance) {

                                    console.log('instance :' + instance);
                                    // console.log(err);
                                    console.log('Token ' + token);
                                    if (instance != null) {
                                        //cb(null, instance);
                                        user = instance;

                                        getAccessToken(token, d1, user, googleId, 'google', cb);
                                    } else {
                                        ConUsers.create({
                                                firstName: firstName,
                                                lastName: lastName,
                                                username: googleId,
                                                password: googleId,
                                                email: emailId,
                                                status: 'Active'
                                            },
                                            function(err, newConUser) {
                                                console.log('User : ' + newConUser);
                                                console.log('Error : ' + err);
                                                user = newConUser;
                                                if (newConUser != null) {
                                                    UserRoles.create({
                                                        conuserId: newConUser.id,
                                                        roleId: roleId
                                                    }, function(err, newRole) {
                                                        console.log('Role : ' + newRole);
                                                        if (err) {
                                                            cb(err);
                                                        }


                                                    });
                                                    CustomerDetails.create({
                                                        conuserId: newConUser.id
                                                    }, function(err, newCustomer) {
                                                        console.log('CustomerDetails : ' + newCustomer);
                                                        if (err) {
                                                            cb(err);
                                                        }
                                                    });
                                                    getAccessToken(token, d1, user, googleId, 'google', cb);
                                                } else {
                                                    cb(err);
                                                }

                                            });
                                    }


                                }
                            );
                        /*} else {
                            console.log('different user');
                            cb('Different User');
                        }*/
                    });
            }
        }


    };

    //Remote method to login with facebook

    ConUsers.remoteMethod(
        'loginWithGoogle', {
            accepts: {
                arg: 'credentials',
                type: 'string',
                required: true
            },
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


    function getAccessToken(token, d1, user, socialMediaId, provider, cb) {
        var response = {
            id: token,
            ttl: 1209600,
            created: d1,
            userId: user.id,
            user: user,
            socialMediaId: socialMediaId,
            socialMediaProvider: provider,
            conUserId: user.id,
            createdBy: user.id
        };

        var sql = 'select * from inserOrUpdateUserIdentity(\'' + response.socialMediaId + '\',\'' + response.socialMediaProvider + '\',' + response.conUserId + ',' + response.createdBy + ',\'' + response.id + '\',' + response.ttl + ')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error inserting access token ...');
                console.log(err);
                cb(null, err);
            }

            console.log('Access token result : ' + result);
            //  console.log('response : '+response);
            cb(null, response);

        });
    };

    ConUsers.mobileNoDetails = function(mobileNumber, cb) {
        // sql query
        var sql = 'select cu.*,cd.*,ct.id as city_id from con_users as cu,customer_details as cd,cities as ct  where cu.id = cd.conuser_id AND cu.operation_city=ct.city_name and mobile_number=\'' + mobileNumber + '\' ';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting details about mobile number ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of mobile number

    ConUsers.remoteMethod(
        'mobileNoDetails', {
            accepts: {
                arg: 'mobileNumber',
                type: 'string',
                required: true
            },
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

     ConUsers.sendSMS = function(mobileNumber, msg, cb) {
             console.log('entered **************');
             if(msg.includes("Your verification code is")){
              var msg1='Dear Customer '+msg+' Indian Drivers&templateid=1707164570613104930'; 
            }
          //   else if(msg.includes("km/hr. For queries kindly contact {#Var#}or info@indian-drivers.com.")){
          //    var msg1=msg+'&templateid=1707164576738820477';              
          //  }else if(msg.includes('please cancel the booking. For queries 020-67641000 or info@indian-drivers.com.')){
          //    var msg1=msg+'&templateid=1707164576687222444';
          //  } else if(msg.includes('For details download app (https://goo.gl/Z5tDgU). For inquiries call 020-67641000 Thank you Indian Drivers .')){
          //    var msg1=msg+'&templateid=1707164576694227173';
          //  }else if(msg.includes('Please contact customer desk for details.')){
          //    var msg1=msg+'&templateid=1707161744256646746';
          //  }else if(msg.includes('has been allocated to you for the booking dated')) {
          //    var msg1=msg+'&templateid=1707164576699758907';
          //   }  
          else{
              var msg1=msg;
            }        
            var data = "";
            data += "username=indiandrivers";
            data += "&pass=IndianDrivers082020";
            data += "&route=trans1";
            data += "&senderid=INDRIV";
            data += "&numbers=" + mobileNumber;
            data += "&message=" + msg1 ;


            var url = consts.SMS_URL + data;
            console.log('url = ' + url);

            rest.get(url)
                .on('complete', function(smsResponse, smsError) {
                    console.log('SMS response : ' + JSON.stringify(smsResponse));
                    //console.log('SMS error : ' + JSON.stringify(smsError));
                     cb(null,smsResponse);
                });

    };

    //Remote method to get provider of mobile number

    ConUsers.remoteMethod(
        'sendSMS', {
            accepts: [{
                arg: 'mobileNumber',
                type: 'string',
                required: true
            }, {
                arg: 'msg',
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

     ConUsers.getRoleAndMobile = function(mobileNumber, cb) {
        // sql query
        var sql = 'select cu.mobile_number,ur.role_id from con_users cu,customer_details cd,user_roles ur where cu.id = cd.conuser_id and cu.id = ur.conuser_id and cu.mobile_number = \'' + mobileNumber + '\' ';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting user role and mobile number ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of mobile number

    ConUsers.remoteMethod(
        'getRoleAndMobile', {
            accepts: {
                arg: 'mobileNumber',
                type: 'string',
                required: true
            },
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

    
ConUsers.inactivateDriver = function(driverId, updatedBy, cb) {
        // sql query
        var sql = 'select * from inactivate_driver(\''+driverId+'\', \''+updatedBy+'\')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in inactivate driver ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
ConUsers.remoteMethod(
        'inactivateDriver', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            },{
                arg: 'updatedBy',
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
                verb: 'post'
            }
        }
    );

ConUsers.blockDriver = function(driverId, updatedBy, cb) {
        // sql query
        var sql = 'select * from block_driver(\''+driverId+'\', \''+updatedBy+'\')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in inactivate driver ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email
ConUsers.remoteMethod(
        'blockDriver', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            },{
                arg: 'updatedBy',
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
                verb: 'post'
            }
        }
    );

 ConUsers.createCustomerForCustomerApp = function(mobileNumber, email, firstName, lastName, username, password, otp, landmark, addressLat, addressLong, address, userDevice, operationCity, cb) {
    // sql query
    var CustomerDetails = ConUsers.app.models.CustomerDetails;
    var UserRoles = ConUsers.app.models.UserRoles;
  //  var mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + 'CA&key=AIzaSyDk68Pkmc9ifI9Vkcl_W7uE1AEsORUNRl4';
    console.log('hi');
         var sql = 'select * from create_customer(\'' + mobileNumber + '\',\'' + email + '\')';
         var city =operationCity;
        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
          if (err) {
            console.log('error in creating customer ...');
            console.log(err);
            return cb(err, result);
          }


          if (result[0].create_customer === '0') {
            ConUsers.create({
                firstName: firstName,
                lastName: lastName,
                mobileNumber: mobileNumber,
                username: username,
                password: password,
                otp: otp,
                email: email,
                isActive: true,
                address: landmark,
                addressLine2: address,
                addressLat: addressLat,
                addressLong: addressLong,
                status: 'Active',
                userDevice: userDevice,
                operationCity: city

              },
              function(err, newConUser) {
                result.push(newConUser);
                if (newConUser != null) {
                  CustomerDetails.create({
                    conuserId: newConUser.id,
                    createdBy: newConUser.id
                  }, function(custErr, custData) {

                    result.push(custData);
                    if (custData != null) {

                    }

                    UserRoles.create({
                      conuserId: newConUser.id,
                      roleId: 2,
                      createdBy: newConUser.id
                    }, function(roleErr, roleData) {

                      result.push(roleData);
                      if (roleData != null) {

                      }
                      cb(roleErr, result);
                    });
                  });
                } else {
                  cb(err, result);
                }
              });
          }
          cb(err, result);

        });
      

  };

  //Remote method to get provider of email
  ConUsers.remoteMethod(
    'createCustomerForCustomerApp', {
      accepts: [{
          arg: 'mobileNumber',
          type: 'string',
          required: true
        }, {
          arg: 'email',
          type: 'string',
          required: true
        }, {
          arg: 'firstName',
          type: 'string',
          required: true
        }, {
          arg: 'lastName',
          type: 'string',
          required: true
        }, {
          arg: 'username',
          type: 'string',
          required: true
        }, {
          arg: 'password',
          type: 'string',
          required: true
        }, {
          arg: 'otp',
          type: 'string',
          required: true
        }, {
          arg: 'landmark',
          type: 'string',
          required: true
        },
        {
          arg: 'addressLat',
          type: 'string',
          required: true
        },
        {
          arg: 'addressLong',
          type: 'string',
          required: true
        }, {
          arg: 'address',
          type: 'string',
          required: true
        }, {
          arg: 'userDevice',
          type: 'string',
          required: false
        }, {
          arg: 'operationCity',
          type: 'string',
          required: false
        }
      ],
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

    //Remote method to get provider of email
 

    ConUsers.createDriverForDriverApp = function(mobileNumber, email, firstName, middleName, lastName, username, password, isLuxury, freeAddress, cb) {
        // sql query
        var DriverDetails = ConUsers.app.models.DriverDetails;
        var UserRoles = ConUsers.app.models.UserRoles;

        var sql = 'select * from create_driver(\''+mobileNumber+'\')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in creating driver ...');
                console.log(err);
                return cb(err);
            }
            if(result[0].create_driver === '0'){

                ConUsers.create({
                        firstName: firstName,
                        middleName: middleName,
                        lastName: lastName,
                        mobileNumber: mobileNumber,
                        username: username,
                        password: password,
                        email: email,
                        status: 'Inactive'

                    },
                    function(err, newConUser) {
                        result.push(newConUser);

                        if (newConUser != null) {
                            DriverDetails.create({
                                conuserId: newConUser.id,
                                createdBy: newConUser.id,
                                isLuxury: isLuxury,
                                freeAddress: freeAddress
                            }, function(driverErr, driverData) {

                                result.push(driverData);
                                if (driverData != null) {

                                }

                                UserRoles.create({
                                    conuserId: newConUser.id,
                                    roleId: 3,
                                    createdBy: newConUser.id
                                }, function(roleErr, roleData) {

                                    result.push(roleData);
                                    if (roleData != null) {

                                    }
                                    cb(roleErr, result);
                                });
                            });
                        } else {
                            cb(err);
                        }
                    });
            }
            //cb(err, result);
        });


    };

    //Remote method to get provider of email
ConUsers.remoteMethod(
        'createDriverForDriverApp', {
            accepts: [{
                arg: 'mobileNumber',
                type: 'string',
                required: true
            },{
                arg: 'email',
                type: 'string',
                required: true
            },{
                arg: 'firstName',
                type: 'string',
                required: true
            },{
                arg: 'middleName',
                type: 'string',
                required: false
            },{
                arg: 'lastName',
                type: 'string',
                required: true
            },{
                arg: 'username',
                type: 'string',
                required: true
            },{
                arg: 'password',
                type: 'string',
                required: true
            },
            {
                arg: 'isLuxury',
                type: 'string',
                required: true
            },{
                arg: 'freeAddress',
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
                verb: 'post'
            }
        }
    );
     ConUsers.createDriverForDriverAppNew = function(mobileNumber, email, firstName, middleName, lastName, username, password, isLuxury, freeAddress, operationCity, addressLat, addressLong, googleAddress, otp, BDate, licenseIssueDate, vehicle, cb) {
        // sql query
        var DriverDetails = ConUsers.app.models.DriverDetails;
        var UserRoles = ConUsers.app.models.UserRoles;
        var sql = 'select * from create_driver(\''+mobileNumber+'\')';
        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('error in creating driver ...');
                console.log(err);
                return cb(err);
            }
            if(result[0].create_driver === '0'){
                ConUsers.create({
                        firstName: firstName,
                        middleName: middleName,
                        lastName: lastName,
                        mobileNumber: mobileNumber,
                        username: username,
                        password: password,
                        email: email,
                        status: 'Inactive',
                        operationCity: operationCity,
                        addressLat: addressLat,
                        addressLong: addressLong,
                        address: googleAddress,
                        otp:otp
                    },
                    function(err, newConUser) {
                        result.push(newConUser);
                        if (newConUser != null) {
                            DriverDetails.create({
                                conuserId: newConUser.id,
                                createdBy: newConUser.id,
                                isLuxury: isLuxury,
                                freeAddress: freeAddress,
                                BDate: BDate,
                                licenseDate: licenseIssueDate,
                                vehicle :vehicle
                            }, function(driverErr, driverData) {
                                result.push(driverData);
                                if (driverData != null) {
                                }
                                UserRoles.create({
                                    conuserId: newConUser.id,
                                    roleId: 3,
                                    createdBy: newConUser.id
                                }, function(roleErr, roleData) {
                                    result.push(roleData);
                                    if (roleData != null) {
                                    }
                                    cb(roleErr, result);
                                });
                            });
                        } else {
                            cb(err);
                        }
                    });
            }
            //cb(err, result);
        });
    };
    //Remote method to get provider of email
ConUsers.remoteMethod(
        'createDriverForDriverAppNew', {
            accepts: [{
                arg: 'mobileNumber',
                type: 'string',
                required: true
            },{
                arg: 'email',
                type: 'string',
                required: false
            },{
                arg: 'firstName',
                type: 'string',
                required: true
            },{
                arg: 'middleName',
                type: 'string',
                required: false
            },{
                arg: 'lastName',
                type: 'string',
                required: true
            },{
                arg: 'username',
                type: 'string',
                required: true
            },{
                arg: 'password',
                type: 'string',
                required: true
            },
            {
                arg: 'isLuxury',
                type: 'string',
                required: true
            },{
                arg: 'freeAddress',
                type: 'string',
                required: true
            },{
                arg: 'operationCity',
                type: 'string',
                required: true
            },{
                arg: 'addressLat',
                type: 'string',
                required: true
            },{
                arg: 'addressLong',
                type: 'string',
                required: true
            },{
                arg: 'googleAddress',
                type: 'string',
                required: true
            },{
                arg: 'otp',
                type: 'string',
                required: true
            },{
                arg: 'BDate',
                type: 'string',
                required: true
            },{
                arg: 'licenseIssueDate',
                type: 'string',
                required: true
            },{
                arg: 'vehicle',
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
                verb: 'post'
            }
        }
    );
    
ConUsers.validateCustomerMobile = function(mobileNumber, cb) {
        // sql query
        var sql = 'select * from validate_customer_mobile(\''+mobileNumber+'\')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting validateCustomerMobile data ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'validateCustomerMobile', {
            accepts: [{
                arg: 'mobileNumber',
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

    ConUsers.validateDriverMobile = function(mobileNumber, cb) {
        // sql query
        var sql = 'select * from validate_driver_mobile(\''+mobileNumber+'\')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting validateCustomerMobile data ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'validateDriverMobile', {
            accepts: [{
                arg: 'mobileNumber',
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


ConUsers.deleteDriver = function(driverId, cb) {
        // sql query
        var sql = 'select * from delete_driver_permanentaly('+driverId+')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error deleting driver ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'deleteDriver', {
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

    
ConUsers.deleteCustomer = function(customerId, cb) {
        // sql query
        var sql = 'select * from delete_customer_permanentaly('+customerId+')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error deleting customer ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'deleteCustomer', {
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
                verb: 'post'
            }
        }
    );

    ConUsers.activateDriverFunction = function(driverId, userId, cb) {
        // sql query
        var sql = 'select * from activate_driver(' + driverId +',' + userId + ')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error in activate driver ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'activateDriverFunction', {
            accepts: [{
                arg: 'driverId',
                type: 'string',
                required: true
            },{
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

     ConUsers.getDriverDetails = function(address, status, operationCity, cb) {
        // sql query
        var sql = 'select * from get_driver_details(\''+address+'\', \''+status+'\', \''+operationCity+'\')';

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver details ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'getDriverDetails', {
            accepts: [{
                arg: 'address',
                type: 'string',
                required: true
            },{
                arg: 'status',
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
                verb: 'get'
            }
        }
    );
 ConUsers.getEnquiryDetail = function(fromDate, toDate, operationCity, type, cb) {

        if(type === 'customer'){
             if(operationCity === 'All'){

              var sql = 'select concat(cu.first_name || \' \' || cu.last_name ) as name, cu.mobile_number, cu.operation_city, (select concat(cu1.first_name || \' \' || cu1.last_name ) as createdbyname from con_users cu1 where cu1.id = cu.created_by) from con_users cu ,customer_details cd where cu.created_date >= (TIMESTAMP \'' + fromDate + '\') and cu.created_date < (TIMESTAMP  \'' + toDate + '\' ::date + \'1 day\'::interval) and cu.id = cd.conuser_id and cd.requirement_status = \'E\'' ;

          }else{
              var sql = 'select concat(cu.first_name || \' \' || cu.last_name ) as name, cu.mobile_number, cu.operation_city, (select concat(cu1.first_name || \' \' || cu1.last_name ) as createdbyname from con_users  cu1 where cu1.id = cu.created_by) from con_users cu ,customer_details cd where cu.created_date >= (TIMESTAMP \'' + fromDate + '\') and cu.created_date < (TIMESTAMP  \'' + toDate + '\' ::date + \'1 day\'::interval) and cu.operation_city = \'' + operationCity + '\' and cu.id = cd.conuser_id and cd.requirement_status = \'E\'' ;
          }
        }else{//driver
          if(operationCity === 'All'){

              var sql = 'select concat(first_name || \' \' || last_name ) as name, mobile_number, operation_city, (select concat(first_name || \' \' || last_name ) as createdbyname from con_users where id = cu.created_by) from con_users cu where created_date >= (TIMESTAMP \'' + fromDate + '\') and created_date < (TIMESTAMP  \'' + toDate + '\' ::date + \'1 day\'::interval) and email like\'%\' || \'@consrv-enquiry.in\' || \'%\'';

          }else{
              var sql = 'select concat(first_name || \' \' || last_name ) as name, mobile_number, operation_city, (select concat(first_name || \' \' || last_name ) as createdbyname from con_users where id = cu.created_by) from con_users cu where created_date >= (TIMESTAMP \'' + fromDate + '\') and created_date < (TIMESTAMP  \'' + toDate + '\' ::date + \'1 day\'::interval) and operation_city = \'' + operationCity + '\' and email like\'%\' || \'@consrv-enquiry.in\' || \'%\' ';
          }
        }
          
        // sql query
      

        // call sql query from postreSQL
        ConUsers.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error getting driver details ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });
        

    };

    //Remote method to get provider of email

    ConUsers.remoteMethod(
        'getEnquiryDetail', {
            accepts: [{
                arg: 'fromDate',
                type: 'string',
                required: true
            },{
                arg: 'toDate',
                type: 'string',
                required: true
            },{
                arg: 'operationCity',
                type: 'string',
                required: true
            },{
                arg: 'type',
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

ConUsers.block = function(email,cb){
      var sql = 'update con_users set status=\'Inactive\' where email=\'' + email + '\'';
      console.log('user blocked...' +sql);

      ConUsers.app.datasources.postgres.connector.query(sql,function(err,result) {
        if(err){
          console.log('error in blocking...');
          console.log(err);
          return cb(err);
        }
        console.log('blocked function ...' + JSON.stringify(result));
        cb(err,result);
        
      });
    };

    ConUsers.remoteMethod(
      'block', {
        accepts: [{
          arg: 'email',
          type: 'string',
          required: true
        }],
        return: [{
          type: 'string',
          required: true,
          root: true
        }],
        http:{
          verb: 'post'
        }
        
      }
    );
}
