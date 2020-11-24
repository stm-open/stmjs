var utils       = require('./testutils');
var assert      = require('assert');
var Amount      = utils.load_module('amount').Amount;
var Transaction = utils.load_module('transaction').Transaction;
var Remote      = utils.load_module('remote').Remote;
var Server      = utils.load_module('server').Server;

var transactionResult = {
        "Account": "vNbK8PuydB1LmKAZTXmcNNFHEHnR7x6m6U",
        "Amount": "10000000",
        "Destination": "vpiaXLJSUaJA4herpJu8LGjtRuMk3wsUNi",
        "Fee": "12",
        "Flags": 2147483648,
        "LastLedgerSequence": 4619889,
        "Sequence": 120,
        "SigningPubKey": "0268717690140890C652DAB741C59AB93852F8E6F32F9BD11315C347CC8EA118F1",
        "TransactionType": "Payment",
        "TxnSignature": "3045022100AB36179335B1865293F60339D2EF5CBBA028E10D5EADDE1FCB00EFCAE8D67A04022047ACC9664309F4EA8DE68119FE77B01516E69F5C72A0C74FFC0C37B6EAAC75A2",
        "date": 658996380,
        "hash": "8F04D0C69BE16E2CB9186913769B8625C29DC8FE2D59A09FAEBD59FEBFD049B8",
        "inLedger": 4619886,
        "ledger_index": 4619886,
        "meta": {
            "AffectedNodes": [
                {
                    "ModifiedNode": {
                        "FinalFields": {
                            "Account": "vNbK8PuydB1LmKAZTXmcNNFHEHnR7x6m6U",
                            "Balance": "741348547",
                            "Flags": 0,
                            "OwnerCount": 9,
                            "Sequence": 121
                        },
                        "LedgerEntryType": "AccountRoot",
                        "LedgerIndex": "8847C19BBE930D26C5461754DA80DB730E59E0FAC84DEEFFE4AC022272BC2163",
                        "PreviousFields": {
                            "Balance": "751348559",
                            "Sequence": 120
                        },
                        "PreviousTxnID": "6B158100CD7082812F196FE548D4C93E210A8C65FCEE66821BE79B027D48112B",
                        "PreviousTxnLgrSeq": 4619884
                    }
                },
                {
                    "CreatedNode": {
                        "LedgerEntryType": "AccountRoot",
                        "LedgerIndex": "D55F2CCAF228C52D76F217317E4F22B1FF7E163539BF871F99B38965F672C8A6",
                        "NewFields": {
                            "Account": "vpiaXLJSUaJA4herpJu8LGjtRuMk3wsUNi",
                            "Balance": "10000000",
                            "Sequence": 1
                        }
                    }
                }
            ],
            "TransactionIndex": 0,
            "TransactionResult": "tesSUCCESS",
            "delivered_amount": "10000000"
        },
        "status": "success",
        "validated": true
    };

describe('Transaction', function() {
  it('Success listener', function(done) {
    var transaction = new Transaction();

    transaction.once('cleanup', function(message) {
      assert.deepEqual(message, transactionResult);
      assert(transaction.finalized);
      assert.strictEqual(transaction.state, 'validated');
      done();
    });

    transaction.emit('success', transactionResult);
  });

  it('Error listener', function(done) {
    var transaction = new Transaction();

    transaction.once('cleanup', function(message) {
      assert.deepEqual(message, transactionResult);
      assert(transaction.finalized);
      assert.strictEqual(transaction.state, 'failed');
      done();
    });

    transaction.emit('error', transactionResult);
  });

  it('Submitted listener', function() {
    var transaction = new Transaction();
    transaction.emit('submitted');
    assert.strictEqual(transaction.state, 'submitted');
  });

  it('Proposed listener', function() {
    var transaction = new Transaction();
    transaction.emit('proposed');
    assert.strictEqual(transaction.state, 'pending');
  });

  it('Check response code is tel', function() {
    var transaction = new Transaction();
    assert(!transaction.isTelLocal(-400));
    assert(transaction.isTelLocal(-399));
    assert(transaction.isTelLocal(-300));
    assert(!transaction.isTelLocal(-299));
  });

  it('Check response code is tem', function() {
    var transaction = new Transaction();
    assert(!transaction.isTemMalformed(-300));
    assert(transaction.isTemMalformed(-299));
    assert(transaction.isTemMalformed(-200));
    assert(!transaction.isTemMalformed(-199));
  });

  it('Check response code is tef', function() {
    var transaction = new Transaction();
    assert(!transaction.isTefFailure(-200));
    assert(transaction.isTefFailure(-199));
    assert(transaction.isTefFailure(-100));
    assert(!transaction.isTefFailure(-99));
  });

  it('Check response code is ter', function() {
    var transaction = new Transaction();
    assert(!transaction.isTerRetry(-100));
    assert(transaction.isTerRetry(-99));
    assert(transaction.isTerRetry(-1));
    assert(!transaction.isTerRetry(0));
  });

  it('Check response code is tep', function() {
    var transaction = new Transaction();
    assert(!transaction.isTepSuccess(-1));
    assert(transaction.isTepSuccess(0));
    assert(transaction.isTepSuccess(1e3));
  });

  it('Check response code is tec', function() {
    var transaction = new Transaction();
    assert(!transaction.isTecClaimed(99));
    assert(transaction.isTecClaimed(100));
    assert(transaction.isTecClaimed(1e3));
  });

  it('Check response code is rejected', function() {
    var transaction = new Transaction();
    assert(!transaction.isRejected(0));
    assert(!transaction.isRejected(-99));
    assert(transaction.isRejected(-100));
    assert(transaction.isRejected(-399));
    assert(!transaction.isRejected(-400));
  });

  it('Set state', function(done) {
    var transaction = new Transaction();
    transaction.state = 'pending';

    var receivedEvents = 0;
    var events = 2;

    transaction.once('state', function(state) {
      assert.strictEqual(state, 'validated');
      if (++receivedEvents === events) {
        done();
      }
    });

    transaction.once('save', function() {
      if (++receivedEvents === events) {
        done();
      }
    });

    transaction.setState('validated');
  });

  it('Finalize submission', function() {
    var transaction = new Transaction();

    var tx = transactionResult;
    tx.ledger_hash = '2031E311FD28A6BZ76Z7BD6ECF8E6661521902E7A6A8EF069A2F3C628E76A322';
    tx.ledger_index = 7106150;

    transaction.result = transactionResult;
    transaction.finalize(tx);

    assert.strictEqual(transaction.result.ledger_index, tx.ledger_index);
    assert.strictEqual(transaction.result.ledger_hash, tx.ledger_hash);
  });

  it('Finalize unsubmitted', function() {
    var transaction = new Transaction();
    transaction.finalize(transactionResult);

    assert.strictEqual(transaction.result.ledger_index, transactionResult.ledger_index);
    assert.strictEqual(transaction.result.ledger_hash, transactionResult.ledger_hash);
  });

  it('Get account secret', function() {
    var remote = new Remote();

    remote.secrets = {
      v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK: 'snuP3fj1ZjvVYQFsXiAG6JsTzzuVN',
      vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy: 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA'
    };

    var transaction = new Transaction(remote);

    assert.strictEqual(transaction._accountSecret('v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK'), 'snuP3fj1ZjvVYQFsXiAG6JsTzzuVN');
    assert.strictEqual(transaction._accountSecret('vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy'), 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA');
    assert.strictEqual(transaction._accountSecret('rExistNot'), void(0));
  });

  it('Get fee units', function() {
    var remote = new Remote();
    var transaction = new Transaction(remote);
    assert.strictEqual(transaction.feeUnits(), 10);
  });

  it('Compute fee', function() {
    var remote = new Remote();

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = true;

    var s2 = new Server(remote, 'wss://node.labs.stream:443');
    s2._connected = true;
    s2._load_factor = 256 * 4;

    var s3 = new Server(remote, 'wss://node.labs.stream:443');
    s3._connected = true;
    s3._load_factor = 256 * 8;

    var s4 = new Server(remote, 'wss://node.labs.stream:443');
    s4._connected = true;
    s4._load_factor = 256 * 8;

    var s5 = new Server(remote, 'wss://node.labs.stream:443');
    s5._connected = true;
    s5._load_factor = 256 * 7;

    remote._servers = [ s2, s3, s1, s4 ];

    assert.strictEqual(s1._computeFee(10), '12');
    assert.strictEqual(s2._computeFee(10), '48');
    assert.strictEqual(s3._computeFee(10), '96');
    assert.strictEqual(s4._computeFee(10), '96');
    assert.strictEqual(s5._computeFee(10), '84');

    var transaction = new Transaction(remote);

    assert.strictEqual(transaction._computeFee(), '72');
  });

  it('Compute fee - no connected server', function() {
    var remote = new Remote();

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = false;

    var s2 = new Server(remote, 'wss://node.labs.stream:443');
    s2._connected = false;
    s2._load_factor = 256 * 4;

    var s3 = new Server(remote, 'wss://node.labs.stream:443');
    s3._connected = false;
    s3._load_factor = 256 * 8;

    remote._servers = [ s1, s2, s3 ];

    assert.strictEqual(s1._computeFee(10), '12');
    assert.strictEqual(s2._computeFee(10), '48');
    assert.strictEqual(s3._computeFee(10), '96');

    var transaction = new Transaction(remote);

    assert.strictEqual(transaction._computeFee(), void(0));
  });

  it('Compute fee - one connected server', function() {
    var remote = new Remote();

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = false;

    var s2 = new Server(remote, 'wss://node.labs.stream:443');
    s2._connected = false;
    s2._load_factor = 256 * 4;

    var s3 = new Server(remote, 'wss://node.labs.stream:443');
    s3._connected = true;
    s3._load_factor = 256 * 8;

    remote._servers = [ s1, s2, s3 ];

    assert.strictEqual(s1._computeFee(10), '12');
    assert.strictEqual(s2._computeFee(10), '48');
    assert.strictEqual(s3._computeFee(10), '96');

    var transaction = new Transaction(remote);

    assert.strictEqual(transaction._computeFee(), '96');
  });

  it('Does not compute a median fee with floating point', function() {
    var remote = new Remote();

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = true;

    var s2 = new Server(remote, 'wss://node.labs.stream:443');
    s2._connected = true;
    s2._load_factor = 256 * 4;

    var s3 = new Server(remote, 'wss://node.labs.stream:443');
    s3._connected = true;

    s3._load_factor = (256 * 7) + 1;

    var s4 = new Server(remote, 'wss://node.labs.stream:443');
    s4._connected = true;
    s4._load_factor = 256 * 16;

    remote._servers = [ s1, s2, s3, s4  ];

    assert.strictEqual(s1._computeFee(10), '12');
    assert.strictEqual(s2._computeFee(10), '48');
    // 66.5
    assert.strictEqual(s3._computeFee(10), '85');
    assert.strictEqual(s4._computeFee(10), '192');

    var transaction = new Transaction(remote);
    transaction.tx_json.Sequence = 1;
    var src = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    var dst = 'vpiaXLJSUaJA4herpJu8LGjtRuMk3wsUNi';
    
    transaction.payment(src, dst, '100');
    remote.set_secret(src, 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA');

    assert(transaction.complete());
    var json = transaction.serialize().to_json();
    assert.notStrictEqual(json.Fee, '66500000', 'Fee == 66500000, i.e. 66.5 STM!');
  });


  it('Compute fee - even server count', function() {
    var remote = new Remote();

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = true;

    var s2 = new Server(remote, 'wss://node.labs.stream:443');
    s2._connected = true;
    s2._load_factor = 256 * 4;

    var s3 = new Server(remote, 'wss://node.labs.stream:443');
    s3._connected = true;
    s3._load_factor = 256 * 8;

    var s4 = new Server(remote, 'wss://node.labs.stream:443');
    s4._connected = true;
    s4._load_factor = 256 * 16;

    remote._servers = [ s1, s2, s3, s4  ];

    assert.strictEqual(s1._computeFee(10), '12');
    assert.strictEqual(s2._computeFee(10), '48');
    // 72
    assert.strictEqual(s3._computeFee(10), '96');
    assert.strictEqual(s4._computeFee(10), '192');

    var transaction = new Transaction(remote);

    assert.strictEqual(transaction._computeFee(), '72');
  });

  it('Complete transaction', function(done) {
    var remote = new Remote();

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = true;

    remote._servers = [ s1 ];
    remote.trusted = true;
    remote.local_signing = true;

    var transaction = new Transaction(remote);
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction.tx_json.Flags = 0;

    assert(transaction.complete());

    done();
  });

  it('Complete transaction - untrusted', function(done) {
    var remote = new Remote();
    var transaction = new Transaction(remote);

    remote.trusted = false;
    remote.local_signing = false;

    transaction.once('error', function(err) {
      assert.strictEqual(err.result, 'tejServerUntrusted');
      done();
    });

    assert(!transaction.complete());
  });

  it('Complete transaction - no secret', function(done) {
    var remote = new Remote();
    var transaction = new Transaction(remote);

    remote.trusted = true;
    remote.local_signing = true;

    transaction.once('error', function(err) {
      assert.strictEqual(err.result, 'tejSecretUnknown');
      done();
    });

    assert(!transaction.complete());
  });

  it('Complete transaction - invalid secret', function(done) {
    var remote = new Remote();
    var transaction = new Transaction(remote);

    remote.trusted = true;
    remote.local_signing = true;

    transaction.SigningPubKey = void(0);
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFAX';

    transaction.once('error', function(err) {
      assert.strictEqual(err.result, 'tejSecretInvalid');
      done();
    });

    assert(!transaction.complete());
  });

  it('Complete transaction - cached SigningPubKey', function(done) {
    var remote = new Remote();
    var transaction = new Transaction(remote);

    remote.trusted = true;
    remote.local_signing = true;

    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFAX';

    transaction.once('error', function(err) {
      assert.notStrictEqual(err.result, 'tejSecretInvalid');
      done();
    });

    assert(!transaction.complete());
  });

  it('Complete transaction - compute fee', function(done) {
    var remote = new Remote();
    var transaction = new Transaction(remote);

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = true;

    remote._servers = [ s1 ];
    remote.trusted = true;
    remote.local_signing = true;

    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';

    assert.strictEqual(transaction.tx_json.Fee, void(0));

    assert(transaction.complete());

    assert.strictEqual(transaction.tx_json.Fee, '12');

    done();
  });

  it('Complete transaction - compute fee exceeds max fee', function(done) {
    var remote = new Remote({ max_fee: 10 });

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = true;
    s1._load_factor = 256 * 16;

    remote._servers = [ s1 ];
    remote.trusted = true;
    remote.local_signing = true;

    var transaction = new Transaction(remote);
    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';

    transaction.once('error', function(err) {
      assert.strictEqual(err.result, 'tejMaxFeeExceeded');
      done();
    });

    assert(!transaction.complete());
  });

  it('Complete transaction - canonical flags', function(done) {
    var remote = new Remote();

    var s1 = new Server(remote, 'wss://node.labs.stream:443');
    s1._connected = true;
    s1._load_factor = 256;

    remote._servers = [ s1 ];
    remote.trusted = true;
    remote.local_signing = true;

    var transaction = new Transaction(remote);
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';
    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction.tx_json.Flags = 0;

    assert(transaction.complete());
    assert.strictEqual(transaction.tx_json.Flags, 2147483648);

    done();
  });

  it('Get signing hash', function(done) {
    var transaction = new Transaction();
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';
    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction.tx_json.Flags = 0;
    transaction.tx_json.Fee = 10;
    transaction.tx_json.Sequence = 1;
    transaction.tx_json.TransactionType = 'AccountSet';
    assert.strictEqual(transaction.signingHash(), '4ACCB2EFD8995DA8938A8515D31C5CA3456D3107552157DEACD8BE9055239448')

    done();
  });

  it('Get hash - no prefix', function(done) {
    var transaction = new Transaction();
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';
    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction.tx_json.Flags = 0;
    transaction.tx_json.Fee = 10;
    transaction.tx_json.Sequence = 1;
    transaction.tx_json.TransactionType = 'AccountSet';

    assert.strictEqual(transaction.hash(), 'CC103D3F2BE37B14AA459987B6F628703F1486FC74B883FA3290C99A84F1FD6C')

    done();
  });

  it('Get hash - prefix', function(done) {
    var transaction = new Transaction();
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';
    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction.tx_json.Flags = 0;
    transaction.tx_json.Fee = 10;
    transaction.tx_json.Sequence = 1;
    transaction.tx_json.TransactionType = 'AccountSet';

    assert.strictEqual(transaction.hash('HASH_TX_SIGN'), '4ACCB2EFD8995DA8938A8515D31C5CA3456D3107552157DEACD8BE9055239448')
    assert.strictEqual(transaction.hash('HASH_TX_SIGN_TESTNET'), '6F3D3A59E70A41B7665F55E03D83EEE1CA9B8C3160A1CF102C4FB6402DE3D5F2');

    done();
  });

  it('Get hash - invalid prefix', function(done) {
    var transaction = new Transaction();
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';
    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction.tx_json.Flags = 0;
    transaction.tx_json.Fee = 10;
    transaction.tx_json.Sequence = 1;
    transaction.tx_json.TransactionType = 'AccountSet';

    assert.throws(function() {
      transaction.hash('HASH_TX_SIGNZ');
    });

    done();
  });

  it('Get hash - complex transaction', function() {
    var input_json = {
      Account : 'v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK',
      Amount : {
        currency : 'LTC',
        issuer : 'v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK',
        value : '9.985'
      },
      Destination : 'v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK',
      Fee : '15',
      Flags : 0,
      Paths : [
        [
          {
        account : 'vpiaXLJSUaJA4herpJu8LGjtRuMk3wsUNi',
        currency : 'USD',
        issuer : 'vpiaXLJSUaJA4herpJu8LGjtRuMk3wsUNi',
        type : 49,
        type_hex : '0000000000000031'
      },
      {
        currency : 'LTC',
        issuer : 'vDsdNw3M6QmUvURi1AXbgNsujKTLTCXnhC',
        type : 48,
        type_hex : '0000000000000030'
      },
      {
        account : 'vDsdNw3M6QmUvURi1AXbgNsujKTLTCXnhC',
        currency : 'LTC',
        issuer : 'vDsdNw3M6QmUvURi1AXbgNsujKTLTCXnhC',
        type : 49,
        type_hex : '0000000000000031'
      }
      ]
      ],
      SendMax : {
        currency : 'USD',
        issuer : 'v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK',
        value : '30.30993068'
      },
      Sequence : 415,
      SigningPubKey : '0234E0407FF791CB163C5CE9D58B8CF665D8DF54D8C2A71B787FE9542CDBFC82C5',
      TransactionType : 'Payment',
      TxnSignature : '304602210096C2F385530587DE573936CA51CB86B801A28F777C944E268212BE7341440B7F022100EBF0508A9145A56CDA7FAF314DF3BBE51C6EE450BA7E74D88516891A3608644E'
    };

    var expected_hash = "D1C5D5807BCB213728E30F23B0E1542D48BBE76EE25A4C50890B12C2AF6916D4";
    var transaction = Transaction.from_json(input_json);

    assert.deepEqual(transaction.hash(), expected_hash);
  });

  it('Serialize transaction', function() {
    var input_json = {
      Account : 'v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK',
      Amount : {
        currency : 'LTC',
        issuer : 'v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK',
        value : '9.985'
      },
      Destination : 'v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK',
      Fee : '15',
      Flags : 0,
      Paths : [
        [
          {
        account : 'vpiaXLJSUaJA4herpJu8LGjtRuMk3wsUNi',
        currency : 'USD',
        issuer : 'vpiaXLJSUaJA4herpJu8LGjtRuMk3wsUNi',
        type : 49,
        type_hex : '0000000000000031'
      },
      {
        currency : 'LTC',
        issuer : 'vDsdNw3M6QmUvURi1AXbgNsujKTLTCXnhC',
        type : 48,
        type_hex : '0000000000000030'
      },
      {
        account : 'vDsdNw3M6QmUvURi1AXbgNsujKTLTCXnhC',
        currency : 'LTC',
        issuer : 'vDsdNw3M6QmUvURi1AXbgNsujKTLTCXnhC',
        type : 49,
        type_hex : '0000000000000031'
      }
      ]
      ],
      SendMax : {
        currency : 'USD',
        issuer : 'v3gevP2nZnJEYsnh8V5WEhcTE8522BEyLK',
        value : '30.30993068'
      },
      Sequence : 415,
      SigningPubKey : '02854B06CE8F3E65323F89260E9E19B33DA3E01B30EA4CA172612DE77973FAC58A',
      TransactionType : 'Payment',
      TxnSignature : '304602210096C2F385530587DE573936CA51CB86B801A28F777C944E268212BE7341440B7F022100EBF0508A9145A56CDA7FAF314DF3BBE51C6EE450BA7E74D88516891A3608644E'
    };

    var expected_hex = '1200002200000000240000019F61D4A3794DFA1510000000000000000000000000004C544300000000005447FEA0D3867C8D91E58824F29D4F3747C0D7C568400000000000000F69D4CAC4AC1122830000000000000000000000000055534400000000005447FEA0D3867C8D91E58824F29D4F3747C0D7C5732102854B06CE8F3E65323F89260E9E19B33DA3E01B30EA4CA172612DE77973FAC58A7448304602210096C2F385530587DE573936CA51CB86B801A28F777C944E268212BE7341440B7F022100EBF0508A9145A56CDA7FAF314DF3BBE51C6EE450BA7E74D88516891A3608644E81145447FEA0D3867C8D91E58824F29D4F3747C0D7C583145447FEA0D3867C8D91E58824F29D4F3747C0D7C501123114411E466A6070B73AE062678102DAD1A739E139000000000000000000000000555344000000000014411E466A6070B73AE062678102DAD1A739E139300000000000000000000000004C54430000000000842094FCB8E5AA9FB7F7904FF9E5C1955A7D3DAA31842094FCB8E5AA9FB7F7904FF9E5C1955A7D3DAA0000000000000000000000004C54430000000000842094FCB8E5AA9FB7F7904FF9E5C1955A7D3DAA00';

    var transaction = Transaction.from_json(input_json);

    assert.deepEqual(transaction.serialize().to_hex(), expected_hex);
  });

  it('Sign transaction', function(done) {
    var transaction = new Transaction();
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';
    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction.tx_json.Flags = 0;
    transaction.tx_json.Fee = 10;
    transaction.tx_json.Sequence = 1;
    transaction.tx_json.TransactionType = 'AccountSet';

    transaction.sign();

    var signature = transaction.tx_json.TxnSignature;

    assert.strictEqual(transaction.previousSigningHash, '4ACCB2EFD8995DA8938A8515D31C5CA3456D3107552157DEACD8BE9055239448');
    assert(/^[A-Z0-9]+$/.test(signature));

    // Unchanged transaction, signature should be the same
    transaction.sign();

    assert.strictEqual(transaction.previousSigningHash, '4ACCB2EFD8995DA8938A8515D31C5CA3456D3107552157DEACD8BE9055239448');
    assert(/^[A-Z0-9]+$/.test(signature));
    assert.strictEqual(transaction.tx_json.TxnSignature, signature);

    done();
  });

  it('Sign transaction - with callback', function(done) {
    var transaction = new Transaction();
    transaction._secret = 'snQJ1XTfGcBc4o7DKBAm4bH9HxBFA';
    transaction.tx_json.SigningPubKey = '021EE05996541E62EAAC3A275F76467D578607DBEDE2F045C1A6B73B1A7020DEFD';
    transaction.tx_json.Account = 'vwmJgB9EYr2ANUP6JHhiuiDSz64yD9wCAy';
    transaction.tx_json.Flags = 0;
    transaction.tx_json.Fee = 10;
    transaction.tx_json.Sequence = 1;
    transaction.tx_json.TransactionType = 'AccountSet';

    transaction.sign(function() {
      var signature = transaction.tx_json.TxnSignature;
      assert.strictEqual(transaction.previousSigningHash, '4ACCB2EFD8995DA8938A8515D31C5CA3456D3107552157DEACD8BE9055239448');
      assert(/^[A-Z0-9]+$/.test(signature));
      done();
    });
  });

  it('Add transaction ID', function(done) {
    var transaction = new Transaction();
    var saved = 0;

    transaction.on('save', function() {
      ++saved;
    });

    transaction.once('save', function() {
      setImmediate(function() {
        assert.strictEqual(saved, 2);
        assert.deepEqual(
          transaction.submittedIDs,
          [ 'F1C15200CF532175F1890B6440AD223D3676140522BC11D2784E56760AE3B4FE',
            '4ACCB2EFD8995DA8938A8515D31C5CA3456D3107552157DEACD8BE9055239448' ]
        );
        done();
      });
    });

    transaction.addId('4ACCB2EFD8995DA8938A8515D31C5CA3456D3107552157DEACD8BE9055239448');
    transaction.addId('F1C15200CF532175F1890B6440AD223D3676140522BC11D2784E56760AE3B4FE');
    transaction.addId('F1C15200CF532175F1890B6440AD223D3676140522BC11D2784E56760AE3B4FE');
  });

  it('Find transaction IDs in cache', function(done) {
    var transaction = new Transaction();

    assert.deepEqual(transaction.findId({
      F1C15200CF532175F1890B6440AD223D3676140522BC11D2784E56760AE3B4FE: transaction
    }), void(0));

    transaction.addId('F1C15200CF532175F1890B6440AD223D3676140522BC11D2784E56760AE3B4FE');

    assert.deepEqual(transaction.findId({
      F1C15200CF532175F1890B6440AD223D3676140522BC11D2784E56760AE3B4FE: transaction
    }), transaction);

    assert.strictEqual(transaction.findId({
      Z1C15200CF532175F1890B6440AD223D3676140522BC11D2784E56760AE3B4FE: transaction
    }), void(0));

    done();
  });

  it('Set build_path', function() {
    var transaction = new Transaction();
    transaction.buildPath(true);
    assert.strictEqual(transaction._build_path, true);
  });

  it('Set DestinationTag', function() {
    var transaction = new Transaction();
    transaction.destinationTag();
    transaction.destinationTag('tag');
    assert.strictEqual(transaction.tx_json.DestinationTag, 'tag');
  });

  it('Set InvoiceID', function() {
    var transaction = new Transaction();

    transaction.invoiceID(1);
    assert.strictEqual(transaction.tx_json.InvoiceID, void(0));

    transaction.invoiceID('DEADBEEF');
    assert.strictEqual(transaction.tx_json.InvoiceID, 'DEADBEEF00000000000000000000000000000000000000000000000000000000');

    transaction.invoiceID('FEADBEEF00000000000000000000000000000000000000000000000000000000');
    assert.strictEqual(transaction.tx_json.InvoiceID, 'FEADBEEF00000000000000000000000000000000000000000000000000000000');
  });

  it('Set ClientID', function() {
    var transaction = new Transaction();

    transaction.clientID(1);
    assert.strictEqual(transaction._clientID, void(0));

    transaction.clientID('DEADBEEF');
    assert.strictEqual(transaction._clientID, 'DEADBEEF');
  });

  it('Set LastLedgerSequence', function() {
    var transaction = new Transaction();

    transaction.lastLedger('a');
    assert.strictEqual(transaction.tx_json.LastLedgerSequence, void(0));
    assert(!transaction._setLastLedger);

    transaction.lastLedger(NaN);
    assert.strictEqual(transaction.tx_json.LastLedgerSequence, void(0));
    assert(!transaction._setLastLedger);

    transaction.lastLedger(12);
    assert.strictEqual(transaction.tx_json.LastLedgerSequence, 12);
    assert(transaction._setLastLedger);
  });

  it('Rewrite transaction path', function() {
    var transaction = new Transaction();

    var path = [
      {
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        extraneous_property: 1,
        currency: 'USD'
      },
      {
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        type_hex: '0000000000000001'
      },
      {
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        test: 'STM',
        currency: 'USD'
      }
    ];

    assert.deepEqual(Transaction._pathRewrite(path), [
      {
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        currency: 'USD'
      },
      {
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        type_hex: '0000000000000001'
      },
      {
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        currency: 'USD'
      }
    ]);
  });

  it('Rewrite transaction path - invalid path', function() {
    assert.strictEqual(Transaction._pathRewrite(1), void(0));
  });

  it('Add transaction path', function() {
    var transaction = new Transaction();

    transaction.pathAdd(1);

    assert.strictEqual(transaction.tx_json.Paths, void(0));

    var path = [
      {
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        extraneous_property: 1,
        currency: 'USD'
      }
    ];

    var path2 = [
      {
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        test: 'STM',
        currency: 'USD'
      }
    ];

    transaction.pathAdd(path);

    assert.deepEqual(transaction.tx_json.Paths, [
      [{
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        currency: 'USD'
      }]
    ]);

    transaction.pathAdd(path2);

    assert.deepEqual(transaction.tx_json.Paths, [
      [{
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        currency: 'USD'
      }],
      [{
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        currency: 'USD'
      }]
    ]);
  });

  it('Add transaction paths', function() {
    var transaction = new Transaction();

    transaction.paths(1);

    assert.strictEqual(transaction.tx_json.Paths, void(0));

    transaction.paths([
      [{
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        test: 1,
        currency: 'USD'
      }],
      [{
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        test: 2,
        currency: 'USD'
      }]
    ]);

    assert.deepEqual(transaction.tx_json.Paths, [
      [{
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        currency: 'USD'
      }],
      [{
        account: 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        currency: 'USD'
      }]
    ]);
  });

  it('Set secret', function() {
    var transaction = new Transaction();
    transaction.secret('shHXjwp9m3MDQNcUrTekXcdzFsCjM');
    assert.strictEqual(transaction._secret, 'shHXjwp9m3MDQNcUrTekXcdzFsCjM');
  });

  it('Set SendMax', function() {
    var transaction = new Transaction();
    transaction.sendMax('1/USD/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb');
    assert.deepEqual(transaction.tx_json.SendMax, {
      value: '1',
      currency: 'USD',
      issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
    });
  });

  it('Set SourceTag', function() {
    var transaction = new Transaction();
    transaction.sourceTag('tag');
    assert.strictEqual(transaction.tx_json.SourceTag, 'tag');
  });

  it('Set TransferRate', function() {
    var transaction = new Transaction();

    assert.throws(function() {
      transaction.transferRate(1);
    });

    assert.throws(function() {
      transaction.transferRate('1');
    });

    transaction.transferRate(1.5 * 1e9);

    assert.strictEqual(transaction.tx_json.TransferRate, 1.5 * 1e9);
  });

  it('Set Flags', function(done) {
    var transaction = new Transaction();
    transaction.tx_json.TransactionType = 'Payment';

    transaction.setFlags();

    assert.strictEqual(transaction.tx_json.Flags, 0);

    transaction.setFlags(1);

    assert.strictEqual(transaction.tx_json.Flags, 1);

    transaction.setFlags('PartialPayment');

    assert.strictEqual(transaction.tx_json.Flags, 131073);

    transaction.setFlags([ 'LimitQuality', 'PartialPayment' ]);

    assert.strictEqual(transaction.tx_json.Flags, 524289);

    transaction.once('error', function(err) {
      assert.strictEqual(err.result, 'tejInvalidFlag');
      done();
    });

    transaction.setFlags('test');
  });

  it('Add Memo', function() {
    var transaction = new Transaction();
    transaction.tx_json.TransactionType = 'Payment';

    transaction.addMemo('testkey', 'testvalue');
    transaction.addMemo('testkey2', 'testvalue2');
    transaction.addMemo('testkey3');
    transaction.addMemo(void(0), 'testvalue4');

    var expected = [
      { Memo: {
        MemoType: new Buffer('testkey').toString('hex'),
        MemoData: new Buffer('testvalue').toString('hex')
      }},
      { Memo: {
        MemoType: new Buffer('testkey2').toString('hex'),
        MemoData: new Buffer('testvalue2').toString('hex')
      }},
      { Memo: {
        MemoType: new Buffer('testkey3').toString('hex')
      }},
      { Memo: {
        MemoData: new Buffer('testvalue4').toString('hex')
      } }
    ];

    assert.deepEqual(transaction.tx_json.Memos, expected);
  });

  it('Add Memo - invalid MemoType', function() {
    var transaction = new Transaction();
    transaction.tx_json.TransactionType = 'Payment';

    assert.throws(function() {
      transaction.addMemo(1);
    }, /^Error: MemoType must be a string$/);
  });

  it('Add Memo - invalid MemoData', function() {
    var transaction = new Transaction();
    transaction.tx_json.TransactionType = 'Payment';

    assert.throws(function() {
      transaction.addMemo('key', 1);
    }, /^Error: MemoData must be a string$/);
  });

  it('Construct AccountSet transaction', function() {
    var transaction = new Transaction().accountSet('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb');

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'AccountSet',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
    });
  });

  it('Construct AccountSet transaction - with setFlag, clearFlag', function() {
    var transaction = new Transaction().accountSet('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', 'asfRequireDest', 'asfRequireAuth');

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      SetFlag: 1,
      ClearFlag: 2,
      TransactionType: 'AccountSet',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
    });
  });

  it('Construct AccountSet transaction - params object', function() {
    var transaction = new Transaction().accountSet({
      account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      set: 'asfRequireDest',
      clear: 'asfRequireAuth'
    });

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      SetFlag: 1,
      ClearFlag: 2,
      TransactionType: 'AccountSet',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
    });
  });

  it('Construct AccountSet transaction - invalid account', function() {
    assert.throws(function() {
      var transaction = new Transaction().accountSet('xv4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb');
    });
  });

  it('Construct OfferCancel transaction', function() {
    var transaction = new Transaction().offerCancel('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', 1);

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'OfferCancel',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      OfferSequence: 1
    });
  });

  it('Construct OfferCancel transaction - params object', function() {
    var transaction = new Transaction().offerCancel({
      account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      sequence: 1
    });

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'OfferCancel',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      OfferSequence: 1
    });
  });

  it('Construct OfferCancel transaction - invalid account', function() {
    assert.throws(function() {
      var transaction = new Transaction().offerCancel('xv4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', 1);
    });
  });

  it('Construct OfferCreate transaction', function() {
    var bid = '1/USD/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb';
    var ask = '1/EUR/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb';

    var transaction = new Transaction().offerCreate('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', bid, ask);

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'OfferCreate',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      TakerPays: {
        value: '1',
        currency: 'USD',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
      },
      TakerGets: {
        value: '1',
        currency: 'EUR',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
      }
    });
  });

  it('Construct OfferCreate transaction - with expiration, cancelSequence', function() {
    var bid = '1/USD/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb';
    var ask = '1/EUR/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb';
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    var rippleExpiration = Math.round(expiration.getTime() / 1000) - 0x386D4380;

    var transaction = new Transaction().offerCreate('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', bid, ask, expiration, 1);

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'OfferCreate',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      TakerPays: {
        value: '1',
        currency: 'USD',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
      },
      TakerGets: {
        value: '1',
        currency: 'EUR',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
      },
      Expiration: rippleExpiration,
      OfferSequence: 1
    });
  });

  it('Construct OfferCreate transaction - params object', function() {
    var bid = '1/USD/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb';
    var ask = '1/EUR/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb';
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    var rippleExpiration = Math.round(expiration.getTime() / 1000) - 0x386D4380;

    var transaction = new Transaction().offerCreate({
      account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      taker_gets: ask,
      taker_pays: bid,
      expiration: expiration,
      cancel_sequence: 1
    });

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'OfferCreate',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      TakerPays: {
        value: '1',
        currency: 'USD',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
      },
      TakerGets: {
        value: '1',
        currency: 'EUR',
        issuer: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb'
      },
      Expiration: rippleExpiration,
      OfferSequence: 1
    });
  });

  it('Construct OfferCreate transaction - invalid account', function() {
    var bid = '1/USD/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb';
    var ask = '1/EUR/v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb';
    assert.throws(function() {
      var transaction = new Transaction().offerCreate('xv4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', bid, ask);
    });
  });

  it('Construct SetRegularKey transaction', function() {
    var transaction = new Transaction().setRegularKey('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'SetRegularKey',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      RegularKey: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
    });
  });

  it('Construct SetRegularKey transaction - params object', function() {
    var transaction = new Transaction().setRegularKey({
      account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      regular_key: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
    });

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'SetRegularKey',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      RegularKey: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
    });
  });

  it('Construct SetRegularKey transaction - invalid account', function() {
    assert.throws(function() {
      var transaction = new Transaction().setRegularKey('xv4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');
    });
  });

  it('Construct SetRegularKey transaction - invalid regularKey', function() {
    assert.throws(function() {
      var transaction = new Transaction().setRegularKey('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', 'xvpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');
    });
  });

  it('Construct Payment transaction', function() {
    var transaction = new Transaction().payment(
      'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq',
      '1'
    );

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'Payment',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      Destination: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq',
      Amount: '1'
    });
  });

  it('Construct Payment transaction - complex amount', function() {
    var transaction = new Transaction().payment(
      'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq',
      '1/USD/vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
    );

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'Payment',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      Destination: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq',
      Amount: {
        value: '1',
        currency: 'USD',
        issuer: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
      }
    });
  });

  it('Construct Payment transaction - params object', function() {
    var transaction = new Transaction().payment({
      account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      destination: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq',
      amount: '1/USD/vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
    });

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'Payment',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      Destination: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq',
      Amount: {
        value: '1',
        currency: 'USD',
        issuer: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
      }
    });
  });

  it('Construct Payment transaction - invalid account', function() {
    assert.throws(function() {
      var transaction = new Transaction().payment(
        'xv4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq',
        '1/USD/vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
      );
    });
  });

  it('Construct Payment transaction - invalid destination', function() {
    assert.throws(function() {
      var transaction = new Transaction().payment(
        'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
        'xvpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq',
        '1/USD/vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
      );
    });
  });

  it('Construct TrustSet transaction', function() {
    var limit = '1/USD/vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq';
    var transaction = new Transaction().trustSet('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', limit);
    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'TrustSet',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      LimitAmount: {
        value: '1',
        currency: 'USD',
        issuer: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
      }
    });
  });

  it('Construct TrustSet transaction - with qualityIn, qualityOut', function() {
    var limit = '1/USD/vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq';
    var transaction = new Transaction().trustSet('v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', limit, 1.0, 1.0);
    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'TrustSet',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      LimitAmount: {
        value: '1',
        currency: 'USD',
        issuer: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
      },
      QualityIn: 1.0,
      QualityOut: 1.0
    });
  });

  it('Construct TrustSet transaction - params object', function() {
    var limit = '1/USD/vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq';
    var transaction = new Transaction().trustSet({
      account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      limit: limit,
      quality_in: 1.0,
      quality_out: 1.0
    });

    assert(transaction instanceof Transaction);
    assert.deepEqual(transaction.tx_json, {
      Flags: 0,
      TransactionType: 'TrustSet',
      Account: 'v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb',
      LimitAmount: {
        value: '1',
        currency: 'USD',
        issuer: 'vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq'
      },
      QualityIn: 1.0,
      QualityOut: 1.0
    });
  });

  it('Construct TrustSet transaction - invalid account', function() {
    assert.throws(function() {
      var limit = '1/USD/vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq';
      var transaction = new Transaction().trustSet('xv4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb', limit, 1.0, 1.0);
    });
  });

  it('Submit transaction', function(done) {
    var remote = new Remote();
    var transaction = new Transaction(remote).accountSet('vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');

    assert.strictEqual(transaction.callback, void(0));
    assert.strictEqual(transaction._errorHandler, void(0));
    assert.strictEqual(transaction._successHandler, void(0));
    assert.strictEqual(transaction.listeners('error').length, 1);

    var account = remote.addAccount('vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');

    account._transactionManager._nextSequence = 1;

    account._transactionManager._request = function(tx) {
      tx.emit('success', { });
    };

    transaction.complete = function() {
      return this;
    };

    var receivedSuccess = false;

    transaction.once('success', function() {
      receivedSuccess = true;
    });

    function submitCallback(err, res) {
      setImmediate(function() {
        assert.ifError(err);
        assert(receivedSuccess);
        done();
      });
    };

    transaction.submit(submitCallback);

    assert(transaction instanceof Transaction);
    assert.strictEqual(transaction.callback, submitCallback);
    assert.strictEqual(typeof transaction._errorHandler, 'function');
    assert.strictEqual(typeof transaction._successHandler, 'function');
  });

  it('Submit transaction - submission error', function(done) {
    var remote = new Remote();

    var transaction = new Transaction(remote).accountSet('vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');

    var account = remote.addAccount('vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');

    account._transactionManager._nextSequence = 1;

    account._transactionManager._request = function(tx) {
      tx.emit('error', new Error('Test error'));
    };

    transaction.complete = function() {
      return this;
    };

    var receivedError = false;

    transaction.once('error', function() {
      receivedError = true;
    });

    function submitCallback(err, res) {
      setImmediate(function() {
        assert(err);
        assert.strictEqual(err.constructor.name, 'StreamError');
        assert(receivedError);
        done();
      });
    };

    transaction.submit(submitCallback);
  });

  it('Submit transaction - invalid account', function(done) {
    var remote = new Remote();
    var transaction = new Transaction(remote).accountSet('vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');

    transaction.tx_json.Account += 'z';

    transaction.once('error', function(err) {
      assert.strictEqual(err.result, 'tejInvalidAccount');
      done();
    });

    transaction.submit();
  });

  it.skip('Abort submission', function(done) {
    var remote = new Remote();
    var transaction = new Transaction(remote).accountSet('vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');
    var account = remote.addAccount('vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq');

    account._transactionManager._nextSequence = 1;

    account._transactionManager._request = function(tx) {
      setTimeout(function() {
        tx.emit('success', { });
      }, 20);
    };

    transaction.complete = function() {
      return this;
    };

    function submitCallback(err, res) {
      setImmediate(function() {
        assert(err);
        assert.strictEqual(err.result, 'tejAbort');
        done();
      });
    };

    transaction.submit(submitCallback);
    transaction.abort();
  });
});

// vim:sw=2:sts=2:ts=8:et
