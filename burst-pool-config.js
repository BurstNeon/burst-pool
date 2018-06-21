module.exports = {
    wallets : [
        {
            walletIP : '127.0.0.1',
            walletPort : 8125,
            walletUrl : 'http://127.0.0.1:8125'
        }
    ],
    redirection : {
        enabled : false,
        target : 'http://lhc.ddns.net:8124'
    },
    walletIndex: 0,
    blockMature : 1,
    txFeePercent : 0.0005,
	devFee : true,
	devFeePercent : 0.01,
    poolFee : 0.01,
    poolDiff : 1000000,
    poolDiffCurve : 0.75,
    poolPort : 8124,
    poolPvtKey : '<pool private key>',
     poolPublicRS : 'BURST-F3XD-Y4M5-SN8C-G9FFJ',
       poolPublic : '16732464642587527083',
       poolFeePaymentAddr : '17572168194578653714',
    defaultPaymentDeadline : 1440,
    poolFeePaymentTxFeeNQT : 100000000,
    httpPort : 80,
    websocketPort : 4443,
    enablePayment : true,
    minimumPayout : 250.0,
    clearingMinPayout : 2.0,
    lastSessionFile : 'last-session.json',
    cumulativeFundReduction : 0.5,
    logWebsocketToConsole : false,
    maxRoundCount : 97,
    sharePenalty : 0.001,
    maxRecentPaymentHistory : 50,	
	blackList: [
        {
         	   	ip :  'xxx.xxxx.xxx',
           		ip2 : 'xxx.xxxx.xxx',
			ip3 : 'xxx.xxxx.xxx',
			ip4:  'xxx.xxxx.xxx',
			ip5:  'xxx.xxxx.xxx',
			ip6:  'xxx.xxxx.xxx',
			ip7:  'xxx.xxxx.xxx',
			ip8:  'xxx.xxxx.xxx',
			ip9:  'xxx.xxxx.xxx',
			ip10: 'xxx.xxxx.xxx',
			ip11: 'xxx.xxxx.xxx',
			ip12: 'xxx.xxxx.xxx',
			ip13: 'xxx.xxxx.xxx',
			ip14: 'xxx.xxxx.xxx',
			ip15: 'xxx.xxxx.xxx',
        }
    ],
};

/*
SubmitNonce = {
      secretPhrase, (private-key) ---> secretAccount (public-key)   <----------+
  +-- nonce,                                                                   |
  |   accountId ---> getRewardRecipient() ---> rewardId (public-pool-address) -+
  |            |                                  ^
} |            |                                  |
  V            V                                  |
nonce + genAccount                                |
  |            |                                  |
  +____________+                                  |
         |                                        |
         V                                        |
     Deadline                                     |
         |    (if smallest)                       |
         V                                        |
     Forge() ------> getRewardRecipient() --------+
 */
