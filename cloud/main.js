// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


AV.Cloud.setInterval('market', 10, function(){

    AV.Cloud.httpRequest({
        url: 'https://cn.bter.com/api/1/ticker/btc_cny',
        secureProtocol : 'SSLv2_method',
        success: function(httpResponse) {
            console.log(httpResponse.text);
        },
        error: function(httpResponse) {
            console.error(httpResponse.text);
        }
    });
});