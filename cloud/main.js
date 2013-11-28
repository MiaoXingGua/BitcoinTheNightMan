// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


AV.Cloud.setInterval('market', 10, function(){

    AV.Cloud.httpRequest({
        url: 'https://cn.bter.com/api/1/ticker/btc_cny',
        success: function(httpResponse) {
            console.log(httpResponse.text);
        },
        error: function(httpResponse) {
            console.error(httpResponse.text);
        }
    });

//    AV.Cloud.httpRequest({
//        method: 'GET',
//        url: 'https://sandboxapp.cloopen.com:8883/2013-03-22/Accounts/aaf98f894032b237014047963bb9009d/SubAccounts?sig='+sig.toUpperCase(),
//        headers: {
//            'Content-Type': 'application/xml;charset=utf-8',
//            'Accept': 'application/xml',
//            'Authorization': authorization64
//        },
//        body: bodyxml,
//        success:function(httpResponse) {
//
//            parseString(httpResponse.text, function (error, result) {
//
//                if (result)
//                {
//                    cloopen2avos(request, response, user, result);
//                }
//                else
//                {
//                    response.error('Request failed with response code ' + error);
//                }
//            });
//
//        },
//        error:function(httpResponse) {
//
//            console.error('Request failed with response code ' + httpResponse.text);
//            response.error('Request failed with response code ' + httpResponse.status);
//        }
//    });
});