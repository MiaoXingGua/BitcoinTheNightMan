// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

//var Market = AV.Object.extend("Market");
var UserFavicon = AV.Object.extend('UserFavicon');
var Installation = AV.Object.extend('_Installation');


var coin1List = ['btc','btb','ltc','ftc','frc','ppc','trc','wdc','yac','cnc','bqc','ifc','zcc','cmc','xpm','pts','tag','tix','src','mec','nmc','qrk','btb','exc','dtc','bsc','cent'];

//'jry'

var coin2List = ['cny'];

var count1 = 0;

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
//        refreashMarket('cent','cny');

    });

    AV.Cloud.setInterval('trade_history', 1, function(){

        console.log('trade_history');

        var count = ++count1;
        if (count >= coin1List.length)
        {
            count1 = 0;
            count = count1;
        }

        tradeHistory(coin1List[count],'cny');

    });
}

var refreashMarket = function(coin1,coin2){

//    console.log(coin1+'_'+coin2);

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
                        console.error('Failed to create new object, with error code: '+ error.code + " error message:" + error.message + " error description:"+ error.description);
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

var tradeHistory = function(coin1,coin2){

    var TradeHistory = AV.Object.extend('TradeHistory_'+coin1+'_'+coin2);
    var query = new AV.Query(TradeHistory);
    query.descending('tid');
    query.first({
        success: function(object) {
           var lastTid = object.get('tid');
//           console.log('tid');
//           console.log(lastTid);
           tradeHistoryRequest(coin1,coin2,lastTid);
        },
        error: function(error) {

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



AV.Cloud.define("test", function(request, response) {

    var count = ++count1;
    if (count >= coin1List.length)
    {
        count1-=coin1List.length;
        count = count1;
    }

    tradeHistory(coin1List[count],'cny');

});

var tradeHistoryRequest = function(coin1,coin2,lastTid){

    var TradeHistory = AV.Object.extend('TradeHistory_'+coin1+'_'+coin2);
    var url = 'http://cn.bter.com/api/1/trade/'+coin1+'_'+coin2+'/'+lastTid;
    console.log(url);

    AV.Cloud.httpRequest({
        url: url,
//            secureProtocol : 'SSLv1_method',
        success: function(httpResponse) {

            var resultInfo = JSON.parse(httpResponse.text);

            if (resultInfo.result)
            {
                var dataList = resultInfo.data;

//                dataList.sort(function(data1,data2){return data1.tid>data2.tid?1:-1});
//                console.dir(dataList);
                console.log(typeof(dataList));
                console.log(dataList.length);

//                var dataCount = dataList.length;
//                for (var i=0;i<dataList.length;i++)
//                {
//                    var data = dataList[i];
//
//                    var tradeHistory = new TradeHistory();
//                    tradeHistory.set('date',data.date);
//                    tradeHistory.set('price',data.price);
//                    tradeHistory.set('amount',data.amount);
//                    tradeHistory.set('tid',data.tid);
//                    tradeHistory.set('type',data.type);
//                    tradeHistory.set('coin1',coin1);
//                    tradeHistory.set('coin2',coin2);
//                    tradeHistory.save(null, {
//                        success: function(tradeHistory) {
//                                          --dataCount;
//                            console.log('New object created with objectId: ' + tradeHistory.id);
//                            console.log('剩余：'+dataCount +'个没有成功');
//                        },
//                        error: function(tradeHistory, error) {
//
//                            console.error('Tid:'+data.tid+'is failed to create new object, with error code: ' +  error.code + " error message:" + error.message + " error description:"+ error.description);
//                        }
//                    });


//                    var lastPrice = data.price;
//
//                    var maxQuery = new AV.Query(UserFavicon);
//                    maxQuery.equalTo('coin.coin1', coin1);
//                    maxQuery.equalTo('coin.coin2', coin2);
//                    maxQuery.doesNotExist('maxValue');
//                    maxQuery.notEqualTo('maxValue', 0);
//                    maxQuery.greaterThanOrEqualTo('maxValue', lastPrice);
//
//                    var minQuery = new AV.Query(UserFavicon);
//                    minQuery.equalTo('coin.coin1', coin1);
//                    minQuery.equalTo('coin.coin2', coin2);
//                    minQuery.doesNotExist('minValue');
//                    minQuery.notEqualTo('minValue', 0);
//                    minQuery.lessThanOrEqualTo("minValue", lastPrice);
//
//                    var mainQuery = AV.Query.or(maxQuery, minQuery);
//                    mainQuery.find({
//                        success: function(results) {
//
////                    var userList = new Array();
//                            for (var userFav in results)
//                            {
//                                var user = results.get('user');
//                                var installationQuery = new AV.Query(Installation);
//                                installationQuery.equalTo('user', user);
//
//                                AV.Push.send({
//                                    channels: [ "Public" ],
//                                    where: installationQuery,
//                                    data: {
//                                        alert: "Public message"
//                                    }
//                                });
//                            }
//
//                            // results contains a list of players that either have won a lot of games or won only a few games.
//                        },
//                        error: function(error) {
//                            // There was an error.
//
//                        }
//                    });
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