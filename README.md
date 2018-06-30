This is a redesigned version of the pool software for the cryptocurrency Burstcoin, all changes serve to further develop Burstcoin and are used at your own risk. Further development can be seen on the pool http://burstneon.com. If you have any questions, please contact https://discord.gg/FVkuau or for burst related discussion go to http://discord.io/burstofficial 

Update V5:
- Added a server workload rule
- Compatible for all Node versions
- Use of multiple wallets
- Added by blacklists on multiple floods of wallets


**Config**

| Setting | Description |
| --- | --- |
|"devFee"   | that if enabled would send [devFeePercent] of the pools earnings as a developer fee to myself after a few requests of people wanting to support the project. 1% works out to be less than 25 coins. getting lower each month. |
|"devFeePercent" | pool owners can choose the percent they wish to donateto development |
|"blockMature" | amount of blocks the pool goes back and checks for block winner|
|"txFeePercent" | Currently not implemented. tx fee is currently added to block reward and then a pool fee is applied to that total - 0.01 = 1% |
|"poolFee" | the percent a pool owner charges for hosting etc. 0.01 = 1%|
|"poolPort" | the port the pool is run on. default 8124|
|"poolPvtKey" | pool private key|
|"poolPublicRS" | pool public BURST- Address|
|"poolPublic" | Pool numerical burst address|
|"poolFeePaymentAddr" | where the fees for Pool Fee should get sent|
|"cumulativeFundReduction" | % to reserve for each prior round.|
|"logWebsocketToConsole" | output whats sent to peoples browsers into the console window|
|"maxRoundCount" | max rounds to display in all round shares. any that exceed this are deleted|
|"maxRecentPaymentHistory" | max lines to show in payment history|
