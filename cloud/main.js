// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

//var Market = AV.Object.extend("Market");
var userFavicon = AV.Object.extend('userFavicon');
var Installation = AV.Object.extend('_Installation');

var i = 0;

if (__production)
{
    AV.Cloud.setInterval('refreash_market', 9, function(){

//        var myDate = new Date();
//        var mytime=myDate.toLocaleTimeString();
//        console.log(myDate.toLocaleString());

//        refreashMarket('btc','cny');
//        refreashMarket('btb','cny');
//        refreashMarket('ltc','cny');
//        refreashMarket('ftc','cny');
//        refreashMarket('frc','cny');
//        refreashMarket('ppc','cny');
//        refreashMarket('trc','cny');
//        refreashMarket('wdc','cny');
//        refreashMarket('yac','cny');
//        refreashMarket('cnc','cny');
//        refreashMarket('bqc','cny');
//        refreashMarket('ifc','cny');
//        refreashMarket('zcc','cny');
//        refreashMarket('cmc','cny');
//        refreashMarket('jry','cny');
//        refreashMarket('xpm','cny');
//        refreashMarket('pts','cny');
//        refreashMarket('tag','cny');
//        refreashMarket('tix','cny');
//        refreashMarket('src','cny');
//        refreashMarket('mec','cny');
//        refreashMarket('nmc','cny');
//        refreashMarket('qrk','cny');
//        refreashMarket('btb','cny');
//        refreashMarket('exc','cny');
//        refreashMarket('dtc','cny');
//        refreashMarket('bsc','cny');


    });
}

var refreashMarket = function(coin1,coin2){

    console.log(coin1+'_'+coin2);

    AV.Cloud.httpRequest({
        url: 'http://cn.bter.com/api/1/ticker/'+coin1+'_'+coin2,
//            secureProtocol : 'SSLv1_method',
        success: function(httpResponse) {

            console.log(++i);

//                console.dir(JSON.parse(httpResponse.text));
//            var resultInfo = JSON.parse(httpResponse.text);
//
//            var lastPrice = resultInfo.last;
//
//            var maxQuery = new AV.Query(userFavicon);
//            maxQuery.equalTo('coin.coin1', coin1);
//            maxQuery.equalTo('coin.coin2', coin2);
//            maxQuery.doesNotExist('maxValue');
//            maxQuery.notEqualTo('maxValue', 0);
//            maxQuery.greaterThanOrEqualTo('maxValue', lastPrice);
//
//            var minQuery = new AV.Query(userFavicon);
//            minQuery.equalTo('coin.coin1', coin1);
//            minQuery.equalTo('coin.coin2', coin2);
//            minQuery.doesNotExist('minValue');
//            minQuery.notEqualTo('minValue', 0);
//            minQuery.lessThanOrEqualTo("minValue", lastPrice);
//
//            var mainQuery = AV.Query.or(maxQuery, minQuery);
//            mainQuery.find({
//                success: function(results) {
//
////                    var userList = new Array();
//                    for (var userFav in results)
//                    {
//                        var user = results.get('user');
//                        var installationQuery = new AV.Query(Installation);
//                        installationQuery.equalTo('user', user);
//
//                        AV.Push.send({
//                            channels: [ "Public" ],
//                            where: installationQuery,
//                            data: {
//                                alert: "Public message"
//                            }
//                        });
//                    }
//
//                    // results contains a list of players that either have won a lot of games or won only a few games.
//                },
//                error: function(error) {
//                    // There was an error.
//                }
//            });

            if (resultInfo.result)
            {
                var Market = AV.Object.extend(coin1+'_'+coin2);
                var market = new Market();
                market.set('last',resultInfo.last);
                market.set('high',resultInfo.high);
                market.set('low',resultInfo.low);
                market.set('avg',resultInfo.avg);
                market.set('sell',resultInfo.sell);
                market.set('buy',resultInfo.buy);
                market.set('vol1',resultInfo.vol1);
                market.set('vol2',resultInfo.vol2);
                market.set('coin1',coin1);
                market.set('coin2',coin2);
                market.save(null, {
                    success: function(market) {
                        // Execute any logic that should take place after the object is saved.
                        console.log('New object created with objectId: ' + market.id);
                    },
                    error: function(market, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a AV.Error with an error code and description.
                        console.error('Failed to create new object, with error code: ' + error.description);
                    }
                });
            }
        },
        error: function(httpResponse) {
            console.log('失败');
//            console.error(httpResponse.text);
        }
    });
}

//生成guid
function newGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
        var n = Math.floor(Math.random()*16.0).toString(16);
        guid += n;
        if((i==8)||(i==12)||(i==16)||(i==20))
            guid += "-";
    }
    return guid;
}

//Phone注册
AV.Cloud.define('register', function(request, response) {

    console.log('注册');

//    register(request,response,10,null,'phone');
    register(request,response,10,null);
});


var register = function(request,response,count,error)
{
    if (count<=0) response.error(error);

    var username = request.params.guid;

    console.log(username);

    if (!username)
    {
        username = newGuid();
    }

//    var email = username + "@" + "qq" + ".com";

    if (username)
    {
        //创建用户关系
//        var userRelation = new UserRelation();
//        userRelation.save().then(function(userRelation){

        var user = new AV.User();
        user.set("username", username);
        user.set("password", username);
//        user.set("email", email);
//        user.set('type', type);

        user.signUp(null, {
            success: function(user) {
//                console.log('注册3');
                var dict = {'guid':user.get('username')};

                console.dir(dict);

                response.success(dict);
            },
            error: function(user, error) {
//                console.log('注册5');

                response.error(error);
            }
        });
//        });

    }
}