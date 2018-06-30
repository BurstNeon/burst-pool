var poolSession     = require('./burst-pool-session');
var poolConfig      = require('./burst-pool-config');
var jsonMarkup      = require('json-markup');
var jsonFormat      = require('prettyjson');
var url             = require('url');
var request         = require('request');
var compression     = require('compression');
var express         = require('express');
var httpProxy       = require('http-proxy');
var path            = require('path');
var http            = require('http');
var bodyParser      = require('body-parser');
var io              = require('socket.io')();
var ioSocket = null;
var toobusy = require('toobusy-js')
function duplicate(obj){
    return JSON.parse(JSON.stringify(obj));
}
function clientLogFormatted(str){
    ioSocket.emit('log',str);
}

function initWalletProxy() {

    for (var i = 0; i < poolConfig.wallets.length; i++) {
      if (poolConfig.wallets[0].walletUrl != 'undefined') {
        poolConfig.wallets[i].proxy = httpProxy.createProxyServer({});
        console.log("Wallet 1 is started" + poolConfig.wallets[0].walletUrl);
      }
      if (poolConfig.wallets2[0].walletUrl != 'undefined') {
        poolConfig.wallets2[0].proxy = httpProxy.createProxyServer({});
        console.log("Wallet 2 is started" + poolConfig.wallets2[0].walletUrl);
      }
	   if (poolConfig.wallets3[0].walletUrl != 'undefined') {
        poolConfig.wallets3[0].proxy = httpProxy.createProxyServer({});
        console.log("Wallet 3 is started" + poolConfig.wallets3[0].walletUrl);
      }
        poolConfig.wallets[0].proxy.on('error', function (err, req, res) {
            console.log(err);
            //res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error, or Resource Temporary Unavailable');
        })
        poolConfig.wallets2[0].proxy.on('error', function (err, req, res) {
            console.log(err);
            //res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error, or Resource Temporary Unavailable');
        })
		 poolConfig.wallets3[0].proxy.on('error', function (err, req, res) {
            console.log(err);
            //res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error, or Resource Temporary Unavailable');
        });
    }
}

function proxify(req, res, mod) {

    if (poolConfig.walletIndex < poolConfig.wallets.length) {
        try {
          if (mod == 0) {
            //console.log("wallet 1 ");
                var proxy = poolConfig.wallets[0].proxy;
                proxy.web(req, res, { target: poolConfig.wallets[0].walletUrl});


          } if(mod == 1) {
            //console.log("wallet 2 ");
            var proxy2 = poolConfig.wallets2[0].proxy;
            proxy2.web(req, res, { target: poolConfig.wallets2[0].walletUrl});


        } if(mod == 2) {
            //console.log("wallet 3 ");
            var proxy3 = poolConfig.wallets3[0].proxy;
            proxy3.web(req, res, { target: poolConfig.wallets3[0].walletUrl});


        }
      }
        catch (e) {
            console.log('exception while proxify');
            console.log(e);
            console.trace();
        }
    }
}

function doRedirection(req, body){
    if(poolConfig.redirection.enabled === true){
        var redirectUrl = poolConfig.redirection.target+req.url;
        request({
            url :redirectUrl,
            method : 'POST',
            body:body
        },function(){});
    }
}

function transformRequest(req, res, nonceSubmitReqHandler){
    var reqBody = '';
    req.on('data', function (reqChunk) {
        if(req.isSubmitNonce === true){
            reqBody += reqChunk;
            if(reqBody.length > 1024){
                req.connection.destroy();
            }
        }
		
    });

    req.on('end', function () {
        if(req.isSubmitNonce === true){
            if(reqBody.length > 0){
                req.url = '/burst?'+reqBody;
                nonceSubmitReqHandler(req);
            }
            reqBody = '';
        }
	//	var     minerReq = url.parse(req ,true);
		//console.log(req.body)
		  //   clientLog(req	);
        doRedirection(req,reqBody);
    });
    nonceSubmitReqHandler(req);
}

function transformResponse(req,res, nonceSubmitedHandler){
    var recvBuffer = '';
    var _write = res.write;
    res.write = function(data){
        if(typeof data != 'undefined'){
            recvBuffer += data.toString();
        }
    };

    var _end = res.end;
    res.end = function(){
        try {
            if(recvBuffer.length > 0){
                if(recvBuffer[0] != '{'){
                    //console.log(recvBuffer);
                }
                else{
                    var response = JSON.parse(recvBuffer);
					  
						
                    if(req.isSubmitNonce === true) {
                        nonceSubmitedHandler(req,response);
                    }
						 //console.log(recvBuffer);
                    //else if(req.isMiningInfo === true){
                    //    recvBuffer = miningInfoHandler(response);
                    //}
                }
            }
        }
        catch(e){
            console.log(e);
            console.trace();
        }
        _write.call(res,recvBuffer);
        _end.call(res);
    }
}

function respondToGetMiningInfo(req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(poolSession.getMiningInfoCache()));
}

function initHttpAPIServer(nonceSubmitReqHandler,
                           nonceSubmitedHandler ){

    var poolHttpServer = http.createServer(function(req, res) {
	//Block request from certain IP-Address
        if (req.connection.remoteAddress == poolConfig.blackList[0].ip || req.connection.remoteAddress == poolConfig.blackList[0].ip2 || req.connection.remoteAddress == poolConfig.blackList[0].ip3 || req.connection.remoteAddress == poolConfig.blackList[0].ip4 || req.connection.remoteAddress == poolConfig.blackList[0].ip5 || req.connection.remoteAddress == poolConfig.blackList[0].ip6 || req.connection.remoteAddress == poolConfig.blackList[0].ip7 || req.connection.remoteAddress == poolConfig.blackList[0].ip8 || req.connection.remoteAddress == poolConfig.blackList[0].ip9 || req.connection.remoteAddress == poolConfig.blackList[0].ip2 || req.connection.remoteAddress == poolConfig.blackList[0].ip2 || req.connection.remoteAddress == poolConfig.blackList[0].ip2 || req.connection.remoteAddress == poolConfig.blackList[0].ip10 || req.connection.remoteAddress == poolConfig.blackList[0].ip11 || req.connection.remoteAddress == poolConfig.blackList[0].ip12 || req.connection.remoteAddress == poolConfig.blackList[0].ip13 || req.connection.remoteAddress == poolConfig.blackList[0].ip14 || req.connection.remoteAddress == poolConfig.blackList[0].ip15) {
            console.log("IP-Address: " + req.connection.remoteAddress + " blocked");
            return;
        }	
	    
        transformRequest(req, res, nonceSubmitReqHandler);
        if (req.hasOwnProperty('isMiningInfo') && req.isMiningInfo) {
            respondToGetMiningInfo(req, res);
        }
        else if (req.hasOwnProperty('isSubmitNonce')) {
	 if (!toobusy()) {
            transformResponse(req, res, nonceSubmitedHandler);
            proxify(req, res, poolConfig.mainWallet);
	 } else { 
	    transformResponse(req, res, nonceSubmitedHandler);
            proxify(req, res, poolConfig.alternativeWallet);
	 }
        } else if (req.hasOwnProperty('ApprovedProxifyRequest')) {
	 if (!toobusy()) {
            transformResponse(req, res, nonceSubmitedHandler);
            proxify(req, res, poolConfig.mainWallet);
	 } else {
	    transformResponse(req, res, nonceSubmitedHandler);
            proxify(req, res, poolConfig.alternativeWallet);
	 }

        } 
    });

    poolHttpServer.listen(poolConfig.poolPort,"0.0.0.0");
    console.log("burst pool running on port "+poolConfig.poolPort);
}

function initWebsocketServer(newClientHandler){
    var ioOption = {
        origins: '*:*',
        'pingTimeout' : 60000,
        'allowUpgrades' : true,
        'transports': [
            'polling',
            'websocket'
        ]
    };

    ioSocket = io.listen(poolConfig.websocketPort,ioOption);
    console.log("websocket running on port "+poolConfig.websocketPort);
    ioSocket.on('connection', newClientHandler);

    function sendHeartbeat(){
        setTimeout(sendHeartbeat, 5000);
        ioSocket.emit('ping', { beat : 1 });
    }

    setTimeout(sendHeartbeat, 5000);
}

function initWebserver(){
    var app = express();
    // Set maximum lag to an aggressive value.
	toobusy.maxLag(10);
 
	// Set check interval to a faster value. This will catch more latency spikes
	// but may cause the check to be too sensitive.
	toobusy.interval(250);
 
	// Get current maxLag or interval setting by calling without parameters.
	var currentMaxLag = toobusy.maxLag(), interval = toobusy.interval();
 
	toobusy.onLag(function(currentLag) {
  		console.log("Event loop lag detected! Latency: " + currentLag + "ms");
	});
    app.use(compression({
        threshold: 64
    }));
    app.use(express.static(path.join(__dirname, 'client')));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

  app.get('/burst', function(req,res){
        //setTimeout(function(){
            request.get({
                url:'http://127.0.0.1:'+poolConfig.poolPort+req.url,
                method : 'GET'
            }).on('error',(err)=>{console.log("Fail! "+err)}).pipe(res);
        //}, Math.random()*500);
    });

    app.post('/burst', function(req,res){
             //setTimeout(function(){

           var fudgeType = req.body.requestType;
            if(fudgeType === 'submitNonce' || fudgeType ==='getMiningInfo'){
                   request({
                       url :  'http://127.0.0.1:'+poolConfig.poolPort+req.url,
                       method : 'POST',
                       form : req.body
                   }, function(err, response, body){
                       if(typeof body != 'undefined' && body != null && body.length > 0){
                           res.write(body);
                       }
                       res.end();
                   });
                   }
                   else{
                           res.send('submitNonce & getMiningInfo API Call Only');

                   }
               //}, Math.random()*500);
    });
    app.use(function(req, res, next) {
        res.send('404 Not Found');
    });


    app.listen(poolConfig.httpPort, function() {
        console.log('http server running on port ' + poolConfig.httpPort);
    });
}

function consoleJson(json){
    try{
        console.log(jsonFormat.render(json));
    }
    catch(e){
        console.log('jsonFormat error');
        console.trace();
    }
}

function clientLogJson(json){
    try{
        var str = jsonMarkup(json);
        ioSocket.emit('log',str);
        if(poolConfig.logWebsocketToConsole === true){
            consoleJson(json);
        }
    }
    catch(e){
        console.log("jsonMarkup error");
        console.trace();
    }
}

function clientUnicastLogJson(json){
    try{
        var str = jsonMarkup(json);
        socket.emit('log',str);
    }
    catch(e)
    {
        console.log("jsonMarkup error");
        console.trace();
    }
}

function clientLog(str){
    ioSocket.emit('log','<span class="json-text">'+str+'</span>');
    if(poolConfig.logWebsocketToConsole === true){
        console.log(str);
    }
}

function clientUnicastLog(socket,str){
    socket.emit('log','<span class="json-text">'+str+'</span>');
    if(poolConfig.logWebsocketToConsole === true){
        console.log(str);
    }
}


module.exports = {
    start : function(nonceSubmitReqHandler, nonceSubmitedHandler, newClientHandler){
        try{
            http.globalAgent.maxSockets = 1200;
            initWebserver();
            initWalletProxy();
            initHttpAPIServer(nonceSubmitReqHandler, nonceSubmitedHandler);
            initWebsocketServer(newClientHandler);
        }
        catch(e){
            console.log(e);
            console.trace();
        }
    },
    getWebsocket : function(){
        return ioSocket;
    },
    clientLogJson : clientLogJson,
    clientUnicastLogJson : clientUnicastLogJson,
    clientLog : clientLog,
    clientLogFormatted : clientLogFormatted,
    clientUnicastLog : clientUnicastLog,
    consoleJson : consoleJson,
    httpPostForm : function(req, formData, done){
        try{
            var form = duplicate(formData);
            form.requestType = req;
            request.post(
                {
                    url : poolSession.getWalletUrl(),
                    form: form
                },
                done
            );
        }
        catch(e){
            console.log(e);
            console.trace();
        }
    }
};
