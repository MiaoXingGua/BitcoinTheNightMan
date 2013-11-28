// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

var Market = AV.Object.extend("Market");

AV.Cloud.setInterval('refreash_market', 10, function(){


        AV.Cloud.httpRequest({
            url: 'http://cn.bter.com/api/1/ticker/btc_cny',
//            secureProtocol : 'SSLv1_method',
            success: function(httpResponse) {
//                console.dir(JSON.parse(httpResponse.text));
                var resultInfo = JSON.parse(httpResponse.text);

                if (resultInfo.result)
                {
                    var market = new Market();
                    market.set('last',resultInfo.last);
                    market.set('high',resultInfo.high);
                    market.set('low',resultInfo.low);
                    market.set('avg',resultInfo.avg);
                    market.set('sell',resultInfo.sell);
                    market.set('buy',resultInfo.buy);
                    market.set('vol1',resultInfo.vol1);
                    market.set('vol2',resultInfo.vol2);
                    market.set('coin1','btc');
                    market.set('coin2','cny');
                    market.save(null, {
                        success: function(gameScore) {
                            // Execute any logic that should take place after the object is saved.
                            alert('New object created with objectId: ' + gameScore.id);
                        },
                        error: function(gameScore, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a AV.Error with an error code and description.
                            alert('Failed to create new object, with error code: ' + error.description);
                        }
                    });
                }
            },
            error: function(httpResponse) {
                console.error(httpResponse.text);
            }
        });

});

