# Guides

This file provides step-by-step walkthroughs for some of the most common usages of `stmjs`.

### In this document

1. [Connecting to the Stream network with `Remote`](GUIDES.md#connecting-to-the-stream-network)
2. [Using `Remote` functions and `Request` objects](GUIDES.md#sending-streamed-API-requests)
3. [Listening to the network](GUIDES.md#listening-to-the-network)
4. [Submitting a payment to the network](GUIDES.md#submitting-a-payment-to-the-network)
5. [Submitting a trade offer to the network](GUIDES.md#submitting-a-trade-offer-to-the-network)

### Also see

1. [The stmjs README](../README.md)
2. [The stmjs API Reference](REFERENCE.md)

## Generating a new Stream Wallet

  ```js
    var Wallet = require('stmjs').Wallet;

    var wallet = Wallet.generate();
    console.log(wallet);
  ```

## Connecting to the Stream network

1. [Get stmjs](README.md#getting-stmjs)
2. Load the stmjs module into a Node.js file or webpage:
  ```js
  /* Loading stmjs with Node.js */
  var Remote = require('stmjs').Remote;

  /* Loading stmjs in a webpage */
  // var Remote = stream.Remote;
  ```
3. Create a new `Remote` and connect to the network:
  ```js
  var remote = new Remote({options});

  remote.connect(function() {
    /* remote connected, use some remote functions here */
  });
  ```
  __NOTE:__ See the API Reference for available [`Remote` options](REFERENCE.md#1-remote-options)

4. You're connected! Read on to see what to do now.

## Sending streamed API requests

`Remote` contains functions for constructing a `Request` object. 

A `Request` is an `EventEmitter` so you can listen for success or failure events -- or, instead, you can provide a callback.

Here is an example, using [request_server_info](https://labs.stream/cn/streamd-apis/#server_info).

+ Constructing a `Request` with event listeners
```js
var request = remote.request('server_info');

request.on('success', function onSuccess(res) {
  //handle success
});

request.on('error', function onError(err) {
  //handle error
});

request.request();
```

+ Using a callback:
```js
remote.request('server_info', function(err, res) {
  if (err) {
    //handle error
  } else {
    //handle success
  }
});
```

__NOTE:__ See the API Reference for available [`Remote` functions](REFERENCE.md#2-remote-functions)

## Listening to the network

See the [wiki](https://labs.stream/cn/streamd-apis/#subscribe) for details on subscription requests.

```js
 /* Loading stmjs with Node.js */
  var Remote = require('stmjs').Remote;

  /* Loading stmjs in a webpage */
  // var Remote = stream.Remote;

  var remote = new Remote({options});

  remote.connect(function() {
    var request = remote.request('subscribe');

    request.addStream('ledger'); //remote will emit `ledger_closed`
    request.addStream('transactions'); //remote will emit `transaction`

    request.on('ledger_closed', function onLedgerClosed(ledgerData) {
	//handle ledger
    });

    request.on('transaction', function onTransacstion(transaction) {
	//handle transaction
    });

    request.request(function(err) {
      	if (err) {
        } else {
        }
    });
  });
```

## Submitting a payment to the network

Submitting a payment transaction to the Stream network involves connecting to a `Remote`, creating a transaction, signing it with the user's secret, and submitting it to the `streamed` server. Note that the `Amount` module is used to convert human-readable amounts like '1STM' or '10.50USD' to the type of Amount object used by the Stream network.

```js
/* Loading stmjs Remote and Amount modules in Node.js */ 
var Remote = require('stmjs').Remote;
var Amount = require('stmjs').Amount;

/* Loading stmjs Remote and Amount modules in a webpage */
// var Remote = stream.Remote;
// var Amount = stream.Amount;

var MY_ADDRESS = 'vvvMyAddress';
var MY_SECRET  = 'secret';
var RECIPIENT  = 'vvvRecipient';
var AMOUNT     = Amount.from_human('1STM');

var remote = new Remote({ /* Remote options */ });

remote.connect(function() {
  remote.setSecret(MY_ADDRESS, MY_SECRET);

  var transaction = remote.createTransaction('Payment', {
    account: MY_ADDRESS, 
    destination: RECIPIENT, 
    amount: AMOUNT
  });

  transaction.submit(function(err, res) {
    /* handle submission errors / success */
  });
});
```

## 4. Submitting a trade offer to the network

Submitting a trade offer to the network is similar to submitting a payment transaction. Here is an example for a trade that expires in 24 hours where you are offering to sell 1 USD in exchange for 100 STM:

```
/* Loading stmjs Remote and Amount modules in Node.js */ 
var Remote = require('stmjs').Remote;
var Amount = require('stmjs').Amount;

/* Loading stmjs Remote and Amount modules in a webpage */
// var Remote = stream.Remote;
// var Amount = stream.Amount;

var MY_ADDRESS = 'vvvMyAddress';
var MY_SECRET  = 'secret';
var GATEWAY = 'vvvGateWay';

var remote = new Remote({ /* Remote options */ });

remote.connect(function() {
  remote.setSecret(MY_ADDRESS, MY_SECRET);

  var transaction = remote.createTransaction('OfferCreate', {
    account: MY_ADDRESS,
    taker_pays: '1',
    taker_gets: '1/USD/' + GATEWAY
  });

  transaction.submit(function(err, res) {
    /* handle submission errors / success */
  });
});
```
