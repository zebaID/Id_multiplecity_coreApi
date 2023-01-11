'use strict';

var endpoints = {
  apihost: 'https://cartapidev.paytm.com'
}

//var PAYTM_BASEURL = 'https://pguat.paytm.com/oltp';
//var MID = 'IDCarD73909887073705';
//var MID_WALLET = 'wallet63571435843990';
//var MID_RECHARGE = 'IDCarD73909887073705';


var PAYTM_BASEURL = 'https://secure.paytm.in/oltp-web/processTransaction';
var MID = 'IDCarD52035492281968';
var MID_WALLET = 'wallet63571435843990';
var MID_RECHARGE = 'IDCarD52035492281968';




module.exports = {
  paytmnew: {
    PG_ENDPOINT: PAYTM_BASEURL + '-web/processTransaction',
    PG_NEW_TXN_ENDPOINT: PAYTM_BASEURL + '-web/migs/processTransaction',
    PG_STATUS_CHECK_URL: PAYTM_BASEURL + '/HANDLER_INTERNAL/TXNSTATUS',
    PG_TXNLIST_URL: PAYTM_BASEURL + '/HANDLER_INTERNAL/TXNSTATUSLIST',
    PG_REFUND: PAYTM_BASEURL + '/HANDLER_INTERNAL/REFUND',
    PG_REFUND_STATUS_CHECK_URL: PAYTM_BASEURL + '/HANDLER_INTERNAL/REFUND_STATUS',
    PG_EXPRESS_ENDPOINT: endpoints.apihost + '/payment/redirect',
    MID: MID,
    MID_WALLET: MID_WALLET,
    MID_RECHARGE: MID_RECHARGE,
    //MID_KEY: 'zwIya2Gn4JuTaQ0U',
    MID_KEY: 'vj0CPrA4kvr5lBM7',
    WEBSITE: 'IDCarwap',
    CHANNEL_ID: 'WAP',
    INDUSTRY_TYPE_ID: 'Retail',
    industry_type: {
      'Recharge': 'Recharge'
    },
    mid_key_map: {
      //'IDCarD73909887073705': 'zwIya2Gn4JuTaQ0U',
      //'wallet63571435843990': 'gRpmElFzmFVP10i53h4Our$tsUBp8MlS',
      //'PaytmP07543523263220': 'hO1h1YuZ#0q_Le!v'

      'IDCarD52035492281968': 'vj0CPrA4kvr5lBM7',
      'wallet63571435843990': 'gRpmElFzmFVP10i53h4Our$tsUBp8MlS',
      'PaytmP07543523263220': 'hO1h1YuZ#0q_Le!v'
    },
    mid_vertical_map: {
      4: {
        'industry_type': 'Recharge',
        'mid': MID_RECHARGE,
        'priority': 2,
        '2': {
          'mid': 'PaytmP07543523263220'  // Reseller MID
        }
      },
      16: {
        'priority': 3,
        'mid': MID_WALLET,
        '2': {
          'industry_type': 'RetailReseller',  // Reseller Industry Type
        }
      },
      26: {
        'priority': 1,
        'industry_type': 'Travel',
        'mid': MID_RECHARGE
      }
    },
    currency: 'INR',
    wallet: {
      timeout: 60 * 1000,
      endpoint: PAYTM_BASEURL + '/HANDLER_IVR/CLW_APP_PAY',
      reqType: 'CLW_APP_PAY',
      paymentMode: 'PPI',
      authMode: 'USRPWD'
    }
  },

  zero: {
    ENDPOINT: endpoints.apihost + '/payment/status'
  }

};
