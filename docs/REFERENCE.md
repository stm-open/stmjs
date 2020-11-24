# API Reference

### In this document:

1. [`Remote` options](REFERENCE.md#remote-options)
2. [`Request` constructors](REFERENCE.md#request-constructor-functions)
  + [Server requests](REFERENCE.md#server-requests)
  + [Ledger requests](REFERENCE.md#ledger-requests)
  + [Transaction requests](REFERENCE.md#transaction-requests)
  + [Account requests](REFERENCE.md#account-requests)
  + [Orderbook requests](REFERENCE.md#orderbook-requests)
  + [Transaction requests](REFERENCE.md#transaction-requests)
3. [`Transaction` constructors](REFERENCE.md#transaction-constructors)
  + [Transaction events](REFERENCE.md#transaction-events)

### Also see:

1. [The stmjs README](../README.md)
2. [The stmjs GUIDES](GUIDES.md)

## Remote options

```js
/* Loading stmjs with Node.js */
var Remote = require('stmjs').Remote;

/* Loading stmjs in a webpage */
// var Remote = stream.Remote;

var options = { };

var remote = new Remote(options);
```

A new `Remote` can be created with the following options:

+ `trace` *boolean default: false* Log all of the events emitted
+ `max_listeners` *number default: 0* Set maxListeners for servers
+ `trusted` *boolean default: false*, if remote is trusted (boolean)
+ `local_signing` *boolean default: true*
+ `local_fee` *boolean default: true* Set whether the transaction fee range will be set locally
+ `fee_cushion` *number default: 1.2* Extra fee multiplier to account for async fee changes
+ `max_fee` *number default: Infinity* Maximum acceptable transaction fee
+ `servers` *array* Array of server objects of the following form:

```js
{
  host:    <string>,
  port:    <number>,
  secure:  <boolean>
}
```

or

```js
 'wss://host:port'
```

## Request constructor functions

### Server requests

**[server_info([callback])](https://labs.stream/cn/streamd-apis/#server_info)**

Returns information about the state of the server. If you are connected to multiple servers and want to select by a particular host, use `request.setServer`. Example:

```js
var request = remote.request('server_info');

request.setServer('wss://node.labs.stream');

request.request(function(err, res) {

});
```

**[requestPeers([callback])](https://labs.stream/cn/streamd-apis/#peers)**

**[connect(ip, port, [callback])](https://labs.stream/cn/streamd-apis/#connect)**

### Ledger requests

**[ledger(ledger, [opts], [callback])](https://labs.stream/cn/streamd-apis/#ledger)**

**ledger_header([callback])**

**[ledger_current([callback])](https://labs.stream/cn/streamd-apis/#ledger_current)**

**[ledger_entry(type, [callback])](https://labs.stream/cn/streamd-apis/#ledger_entry)**

**[subscribe([streams], [callback])](https://labs.stream/cn/streamd-apis/#subscribe)**

Start receiving selected streams from the server.

**[unsubscribe([streams], [callback])](https://labs.stream/cn/streamd-apis/#unsubscribe)**

Stop receiving selected streams from the server.

### Account requests

**[account_info(account, [callback])](https://labs.stream/cn/streamd-apis/#account_info)**

Return information about the specified account.

```
{
  ledger_current_index: <number>,
  account_data: {
    Account:            <string>,
    Balance:            <number>,
    Flags:              <number>,
    LedgerEntryType:    <string>,
    OwnerCount:         <number>,
    PreviousTxnID:      <string>,
    PreviousTxnLgrSeq:  <number>,
    Sequence:           <number> ,
    index:              <string>
  }
}
```

**[account_lines(accountID, [account_index], [ledger], [callback])](https://labs.stream/cn/streamd-apis/#account_lines)**

**[account_offers(accountID, [account_index], [ledger], [callback])](https://labs.stream/cn/streamd-apis/#account_offers)**

Return the specified account's outstanding offers.

**[account_tx(options, [callback])](https://labs.stream/cn/streamd-apis/#account_tx)**

Fetch a list of transactions that applied to this account.

Options:

+ `account`
+ `ledger_index_min`
+ `ledger_index_max`
+  `binary` *false*
+ `count` *false*
+  `descending` *false*
+  `offset` *0*
+  `limit`
+ `forward` *false*
+ `fwd_marker`
+ `rev_marker`

Return a list of accounts for a wallet. *Requires trusted remote*

**account_balance(account, [ledger], [callback])**

Get the balance for an account. Returns an object.

**account_flags(account, [ledger], [callback])**

Return the flags for an account.

**owner_count(account, [ledger], [callback])**

Return the owner count for an account.

**stream_balance(account, issuer, currency, [ledger], [callback])**

Return a request to get a stream balance

### Orderbook requests

**[book_offers(options, [callback])](https://labs.stream/cn/streamd-apis/#book_offers)**

Return the offers for an order book, also called a *snapshot*

```js
var request = remote.request('book_offers', {
  taker_gets: {
    'currency':'STM'
  },
  taker_pays: {
    'currency':'USD',
    'issuer': 'vKXCummUHnenhYudNb9UoJ4mGBR75vFcgz'
  }
});

request.request(function(err, offers) {
  //handle offers
});
```

### Transaction requests

**[transaction_entry(hash, [ledger_hash], [callback])](https://labs.stream/cn/streamd-apis/#transaction_entry)**

Searches a particular ledger for a transaction hash. Default ledger is the open ledger.

**[tx(hash, [callback])](https://labs.stream/cn/streamd-apis/#tx)**

Searches ledger history for validated transaction hashes.

**[sign(secret, tx_json, [callback])](https://labs.stream/cn/streamd-apis/#sign)**

Sign a transaction. *Requires trusted remote*

**[submit([callback])](https://labs.stream/cn/streamd-apis/#submit)**

Submit a transaction to the network. This command is used internally to submit transactions with a greater degree of reliability. See [Submitting a payment to the network](GUIDES.md#3-submitting-a-payment-to-the-network) for details.

**[stream_path_find(src_account, dst_account, dst_amount, src_currencies, [callback])](https://labs.stream/cn/streamd-apis/#path_find)**

## Transaction constructors

Use `remote.createTransaction('TransactionType', [options])` to construct a transaction. To submit, use `transaction.submit([callback])`.

**Payment**

```js
var transaction = remote.createTransaction('Payment', {
  account: MY_ADDRESS,
  destination: DEST_ADDRESS,
  amount: AMOUNT
});
```

**AccountSet**

```js
var transaction = remote.createTransaction('AccountSet', {
  account: MY_ADDRESS,
  set: 'RequireDest',
  clear: 'RequireAuth'
});
```

**TrustSet**

```js
var transaction = remote.createTransaction('TrustSet', {
  account: MY_ADDRESS,
  limit: '1/USD/vvvvvvvvvvvvvvvvvvvvBZbvji'
});
```

**OfferCreate**

```js
var transaction = remote.createTransaction('OfferCreate', {
  account: MY_ADDRESS,
  taker_pays: '1',
  taker_gets: '1/USD/vvvvvvvvvvvvvvvvvvvvBZbvji'
});
```

## Transaction events

Transaction objects are EventEmitters. They may emit the following events.

+ `final` Transaction has erred or succeeded. This event indicates that the transaction has finished processing.
+ `error` Transaction has erred. This event is a final state.
+ `success` Transaction succeeded. This event is a final state.
+ `presubmit` Immediately before transaction is submitted
+ `postsubmit` Immediately after transaction is submitted
+ `submitted` Transaction has been submitted to the network. The submission may result in a remote error or success.
+ `resubmitted` Transaction is beginning resubmission.
+ `proposed` Transaction has been submitted *successfully* to the network. The transaction at this point is awaiting validation in a ledger.
+ `timeout` Transaction submission timed out. The transaction will be resubmitted.
+ `fee_adjusted` Transaction fee has been adjusted during its pending state. The transaction fee will only be adjusted if the remote is configured for local fees, which it is by default.
+ `abort` Transaction has been aborted. Transactions are only aborted by manual calls to `#abort`.
+ `missing` Four ledgers have closed without detecting validated transaction
+ `lost` Eight ledgers have closed without detecting validated transaction. Consider the transaction lost and err/finalize.

## Complete payment example

```js
remote.setSecret(MY_ADDRESS, MY_SECRET);

var transaction = remote.createTransaction('Payment', {
  account: MY_ADDRESS,
  destination: DEST_ADDRESS,
  amount: AMOUNT
});

transaction.on('resubmitted', function() {
  // initial submission failed, resubmitting
});

transaction.submit(function(err, res) {
 // submission has finalized with either an error or success.
 // the transaction will not be retried after this point
});
```
