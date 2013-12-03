// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:


//var Market = AV.Object.extend("Market");
var User = AV.Object.extend('_User');
var UserFavicon = AV.Object.extend('UserFavicon');
var Installation = AV.Object.extend('_Installation');
var TradeHistory = AV.Object.extend('TradeHistory');
var Coin = AV.Object.extend('Coin');

if (!__production)
{

AV.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});

var coin1List = ['btc','btb','ltc','ftc','frc','ppc','wdc','yac','cnc','bqc','ifc','zcc','cmc','xpm','pts','tag','tix','src','mec','nmc','qrk','btb','exc','dtc','cent'];

//jry bsc trc

var coin2List = ['cny'];

//    var count1 = 0;
var tradeRequestCount = 0;

//var tradeCount = 0;
var dataList = new Array();


AV.Cloud.define("xxxxxxxx", function(request, response) {
    if (tradeRequestCount == 0)
    {
        dataList.splice(0);

        for (;tradeRequestCount<coin1List.length;tradeRequestCount++)
        {
            console.log('创建请求 : '+tradeRequestCount);
            tradeHistory(coin1List[tradeRequestCount],'cny');
        }
    }
    else
    {
        console.log('有请求没有返回---return');
    }
});

var tradeHistory = function(coin1,coin2){

    var query = new AV.Query(TradeHistory);
    query.equalTo('coin1',coin1);
    query.equalTo('coin2',coin2);
    query.descending('tid');
    query.first({
        success: function(object) {
            var lastTid = object.get('tid');
            tradeHistoryRequest(coin1,coin2,lastTid);
        },
        error: function(error) {
//                console.log(2);
            if (error.code == 101)//表中还没用数据
            {
                tradeHistoryRequest(coin1,coin2,null);
            }
            else
            {
                console.error("Error: " + error.code + " " + error.message);
            }
        }
    });
}

var tradeHistoryRequest = function(coin1,coin2,lastTid){

    if (lastTid && lastTid != 0)
    {
        var url = 'http://cn.bter.com/api/1/trade/'+coin1+'_'+coin2+'/'+lastTid;
    }
    else
    {
        var url = 'http://cn.bter.com/api/1/trade/'+coin1+'_'+coin2;
    }
    console.log(url);

    AV.Cloud.httpRequest({
        url: url,
//            secureProtocol : 'SSLv1_method',
        success: function(httpResponse) {

            var resultInfo = JSON.parse(httpResponse.text);

            console.log('成功');
            console.log('剩余 ：' + --tradeRequestCount);
//            console.log(typeof(dataList));
            //保存数据
            if (resultInfo.result)
            {
                if (tradeRequestCount != 0)
                {
                    for (var data in resultInfo.data)
                    {
                        dataList.push(data);
                    }
                    console.log('save数组 ： '+dataList.length);
                }
                else
                {
                    AV.Object.saveAll(dataList,{
                        success: function(dataList) {

                            console.log(dataList.length+' object is created ');

                            dataList.splice(0);
                        },
                        error: function(dataList, error) {

                            console.error(dataList.length+'is failed to create, with error code: ' +  error.code + " error message:" + error.message + " error description:"+ error.description);

                            dataList.splice(0);
                        }
                    });
                }
            //推送
            if (resultInfo.result && 0)
            {
                var resultDataList = resultInfo.data;
                resultDataList.sort(function(data1,data2){return data1.tid<data2.tid?1:-1});

                var lastPrice = resultDataList[0].price;
                console.log('lastPrice : ' + lastPrice);

                var coinQuery = new AV.Query(Coin);
                coinQuery.equalTo('coin1', coin1);
                coinQuery.equalTo('coin2', coin2);

                //bqc cny
                var maxQuery = new AV.Query(UserFavicon);
                maxQuery.matchesQuery('coin', coinQuery);
                maxQuery.equalTo('isPush', true);
                maxQuery.exists('maxValue');
                maxQuery.notEqualTo('maxValue', 0);
                maxQuery.lessThanOrEqualTo('maxValue', lastPrice);

                maxQuery.find({
                    success: function(results) {

                        console.log('2 : '+results.length);
//                              var userList = new Array();
                        for (var userFav in results)
                        {
                            var user = results.get('user');
                            var userId = AV.Object.createWithoutData("_User", user.id);
                            var installationQuery = new AV.Query(Installation);
                            installationQuery.equalTo('user', userId);

                            AV.Push.send({
//                                    channels: [ "Public" ],
                                where: installationQuery,
                                data: {
                                    alert: "哈哈哈"
                                }
                            });
                        }
                        // results contains a list of players that either have won a lot of games or won only a few games.
                    },
                    error: function(error) {
                        // There was an error.
                    }
                });


            }

            }
        },
        error: function(httpResponse) {
            console.log('失败');
            console.log('剩余 ：' + --tradeRequestCount);
//            console.error(httpResponse.text);
        }

    });
}

//    AV.Cloud.setInterval('refreash_market', 9, function(){
//
////        var myDate = new Date();
////        var mytime=myDate.toLocaleTimeString();
////        console.log(myDate.toLocaleString());
//
////        refreashMarket('btc','cny');
////        refreashMarket('btb','cny');
////        refreashMarket('ltc','cny');
////        refreashMarket('ftc','cny');
////        refreashMarket('frc','cny');
////        refreashMarket('ppc','cny');
////        refreashMarket('trc','cny');
////        refreashMarket('wdc','cny');
////        refreashMarket('yac','cny');
////        refreashMarket('cnc','cny');
////        refreashMarket('bqc','cny');
////        refreashMarket('ifc','cny');
////        refreashMarket('zcc','cny');
////        refreashMarket('cmc','cny');
////        refreashMarket('jry','cny');
////        refreashMarket('xpm','cny');
////        refreashMarket('pts','cny');
////        refreashMarket('tag','cny');
////        refreashMarket('tix','cny');
////        refreashMarket('src','cny');
////        refreashMarket('mec','cny');
////        refreashMarket('nmc','cny');
////        refreashMarket('qrk','cny');
////        refreashMarket('btb','cny');
////        refreashMarket('exc','cny');
////        refreashMarket('dtc','cny');
////        refreashMarket('bsc','cny');
////        refreashMarket('cent','cny');
//
//    });
//
//
//    var lastTid = 0;
//

//AV.Cloud.setInterval('trade_history', 10, function(){
//    if (tradeRequestCount == 0)
//    {
//        dataList.splice(0);
//
//        for (;tradeRequestCount<coin1List.length;tradeRequestCount++)
//        {
//            tradeHistory(coin1List[tradeRequestCount],'cny');
//        }
//    }
//});

var refreashMarket = function(coin1,coin2){

//    console.log(coin1+'_'+coin2);

    AV.Cloud.httpRequest({
        url: 'http://cn.bter.com/api/1/ticker/'+coin1+'_'+coin2,
//            secureProtocol : 'SSLv1_method',
        success: function(httpResponse) {

            console.log(++i);

            console.dir(JSON.parse(httpResponse.text));
            var resultInfo = JSON.parse(httpResponse.text);

//            var lastPrice = resultInfo.last;
//
//            var maxQuery = new AV.Query(UserFavicon);
//            maxQuery.equalTo('coin.coin1', coin1);
//            maxQuery.equalTo('coin.coin2', coin2);
//            maxQuery.doesNotExist('maxValue');
//            maxQuery.notEqualTo('maxValue', 0);
//            maxQuery.greaterThanOrEqualTo('maxValue', lastPrice);
//
//            var minQuery = new AV.Query(UserFavicon);
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

//            if (resultInfo.result)
//            {
//                var Market = AV.Object.extend(coin1+'_'+coin2);
//                var market = new Market();
//                market.set('last',resultInfo.last);
//                market.set('high',resultInfo.high);
//                market.set('low',resultInfo.low);
//                market.set('avg',resultInfo.avg);
//                market.set('sell',resultInfo.sell);
//                market.set('buy',resultInfo.buy);
//                market.set('vol1',resultInfo.vol1);
//                market.set('vol2',resultInfo.vol2);
//                market.set('coin1',coin1);
//                market.set('coin2',coin2);
//                market.save(null, {
//                    success: function(market) {
//                        // Execute any logic that should take place after the object is saved.
//                        console.log('New object created with objectId: ' + market.id);
//                    },
//                    error: function(market, error) {
//                        // Execute any logic that should take place if the save fails.
//                        // error is a AV.Error with an error code and description.
//                        console.error('Failed to create new object, with error code: '+ error.code + " error message:" + error.message + " error description:"+ error.description);
//                    }
//                });
//            }
        },
        error: function(httpResponse) {
            console.log('失败');
//            console.error(httpResponse.text);
        }
    });
}





AV.Cloud.define("push", function(request, response) {

    var installationQuery = new AV.Query(Installation);
//    installationQuery.equalTo('user', request.params.user);
    AV.Push.send({
//        channels: [ "Public" ],
//        where: installationQuery,
        data: {
            alert: "hehehe"
        }
    });

});



AV.Cloud.define("test", function(request, response) {

//    var count = ++count1;
//
//    if (count >= coin1List.length)
//    {
//        count1 = 0;
//        count = count1;
//    }

    tradeHistoryRequest('btc','cny',null);//1
    tradeHistoryRequest('ltc','cny',null);//2
    tradeHistoryRequest('ftc','cny',null);//3
    tradeHistoryRequest('frc','cny',null);//4
    tradeHistoryRequest('ppc','cny',null);//5
//    tradeHistoryRequest('trc','cny',null);//6
    tradeHistoryRequest('wdc','cny',null);//7
    tradeHistoryRequest('yac','cny',null);//8
    tradeHistoryRequest('cnc','cny',null);//9
    tradeHistoryRequest('bqc','cny',null);//10
    tradeHistoryRequest('ifc','cny',null);//11
    tradeHistoryRequest('zcc','cny',null);//12
    tradeHistoryRequest('cmc','cny',null);//13
    tradeHistoryRequest('xpm','cny',null);//14
    tradeHistoryRequest('pts','cny',null);//15
    tradeHistoryRequest('tag','cny',null);//16
    tradeHistoryRequest('tix','cny',null);//17
    tradeHistoryRequest('src','cny',null);//18
    tradeHistoryRequest('mec','cny',null);//19
    tradeHistoryRequest('nmc','cny',null);//20
    tradeHistoryRequest('qrk','cny',null);//21
    tradeHistoryRequest('btb','cny',null);//22
    tradeHistoryRequest('exc','cny',null);//23
    tradeHistoryRequest('dtc','cny',null);//24
//    tradeHistoryRequest('bsc','cny',null);//26
    tradeHistoryRequest('cent','cny',null);//25

});



AV.Cloud.define("get_coin", function(request, response) {

});





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

//        var userFavicon = new UserFavicon();
//        user.set('userFavicon',userFavicon);
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

}