var assert = require('assert');
var utils = require('./testutils');
var events = require('events')
var Request = utils.load_module('request').Request;
var Remote = utils.load_module('remote').Remote;
var Server = utils.load_module('server').Server;
var Currency = utils.load_module('currency').Currency;

function makeServer(url) {
  var server = new Server(new events, url);
  server._connected = true;
  return server;
};

const SERVER_INFO = {
  'info': {
    'build_version': '0.25.2-rc1',
    'complete_ledgers': '32570-7016339',
    'hostid': 'LIED',
    'io_latency_ms': 1,
    'last_close': {
      'converge_time_s': 2.013,
      'proposers': 5
    },
    'load_factor': 1,
    'peers': 42,
    'pubkey_node': 'n9LpxYuMx4Epz4Wz8Kg2kH3eBTx1mUtHnYwtCdLoj3HC85L2pvBm',
    'server_state': 'full',
    'validated_ledger': {
      'age': 0,
      'base_fee_xrp': 0.00001,
      'hash': 'E43FD49087B18031721D9C3C4743FE1692C326AFF7084A2C01B355CE65A4C699',
      'reserve_base_xrp': 20,
      'reserve_inc_xrp': 5,
      'seq': 7016339
    },
    'validation_quorum': 3
  }
};

describe('Request', function() {
  it('Send request', function(done) {
    var remote = {
      request: function(req) {
        assert(req instanceof Request);
        assert.strictEqual(typeof req.message, 'object');
        assert.strictEqual(req.message.command, 'server_info');
        done();
      }
    };

    var request = new Request(remote, 'server_info');

    request.request();

    // Should only request once
    request.request();
  });

  it('Broadcast request', function(done) {
    var servers = [
      makeServer('wss://localhost:5006'),
      makeServer('wss://localhost:5007')
    ];

    var requests = 0;

    servers.forEach(function(server, index, arr) {
      server._request = function(req) {
        assert(req instanceof Request);
        assert.strictEqual(typeof req.message, 'object');
        assert.strictEqual(req.message.command, 'server_info');
        if (++requests === arr.length) {
          done();
        }
      };
    });

    var remote = new Remote();
    remote._connected = true;
    remote._servers = servers;

    var request = new Request(remote, 'server_info');

    request.broadcast();
  });

  it('Events API', function(done) {
    var server = makeServer('wss://localhost:5006');

    server._request = function(req) {
      assert(req instanceof Request);
      assert.strictEqual(typeof req.message, 'object');
      assert.strictEqual(req.message.command, 'server_info');
      req.emit('success', SERVER_INFO);
    };

    var remote = new Remote();
    remote._connected = true;
    remote._servers = [ server ];

    var request = new Request(remote, 'server_info');

    request.once('success', function(res) {
      assert.deepEqual(res, SERVER_INFO);
      done();
    });

    request.request();
  });

  it('Callback API', function(done) {
    var server = makeServer('wss://localhost:5006');

    server._request = function(req) {
      assert(req instanceof Request);
      assert.strictEqual(typeof req.message, 'object');
      assert.strictEqual(req.message.command, 'server_info');
      req.emit('success', SERVER_INFO);
    };

    var remote = new Remote();
    remote._connected = true;
    remote._servers = [ server ];

    var request = new Request(remote, 'server_info');

    request.callback(function(err, res) {
      assert.ifError(err);
      assert.deepEqual(res, SERVER_INFO);
      done();
    });
  });

  it('Timeout', function(done) {
    var server = makeServer('wss://localhost:5006');
    var successEmited = false;

    server._request = function(req) {
      assert(req instanceof Request);
      assert.strictEqual(typeof req.message, 'object');
      assert.strictEqual(req.message.command, 'server_info');
      setTimeout(function() {
        successEmitted = true;
        req.emit('success', SERVER_INFO);
      }, 200);
    };

    var remote = new Remote();
    remote._connected = true;
    remote._servers = [ server ];

    var request = new Request(remote, 'server_info');

    request.timeout(10, function() {
      setTimeout(function() {
        assert(successEmitted);
        done();
      }, 200);
    });

    request.callback(function(err, res) {
      assert(false, 'Callback should not be called');
    });
  });

  it('Timeout - satisfied', function(done) {
    var server = makeServer('wss://localhost:5006');
    var successEmited = false;

    server._request = function(req) {
      assert(req instanceof Request);
      assert.strictEqual(typeof req.message, 'object');
      assert.strictEqual(req.message.command, 'server_info');
      setTimeout(function() {
        successEmitted = true;
        req.emit('success', SERVER_INFO);
      }, 200);
    };

    var remote = new Remote();
    remote._connected = true;
    remote._servers = [ server ];

    var request = new Request(remote, 'server_info');

    var timedOut = false;

    request.once('timeout', function() {
      timedOut = true;
    });

    request.timeout(1000);

    request.callback(function(err, res) {
      assert(!timedOut);
      assert.ifError(err);
      assert.deepEqual(res, SERVER_INFO);
      done();
    });
  });

  it('Set server', function(done) {
    var servers = [
      makeServer('wss://localhost:5006'),
      makeServer('wss://localhost:5007')
    ];

    servers[1]._request = function(req) {
      assert(req instanceof Request);
      assert.strictEqual(typeof req.message, 'object');
      assert.strictEqual(req.message.command, 'server_info');
      done();
    };

    var remote = new Remote();
    remote._connected = true;
    remote._servers = servers;

    remote.getServer = function() {
      return servers[0];
    };

    var request = new Request(remote, 'server_info');
    request.setServer(servers[1]);

    assert.strictEqual(request.server, servers[1]);

    request.request();
  });

  it('Set server - by URL', function(done) {
    var servers = [
      makeServer('wss://localhost:5006'),
      makeServer('wss://127.0.0.1:5007')
    ];

    servers[1]._request = function(req) {
      assert(req instanceof Request);
      assert.strictEqual(typeof req.message, 'object');
      assert.strictEqual(req.message.command, 'server_info');
      done();
    };

    var remote = new Remote();
    remote._connected = true;
    remote._servers = servers;

    remote.getServer = function() {
      return servers[0];
    };

    var request = new Request(remote, 'server_info');
    request.setServer('wss://127.0.0.1:5007');

    assert.strictEqual(request.server, servers[1]);

    request.request();
  });

  it('Set build path', function() {
    var remote = new Remote();
    remote._connected = true;
    remote.local_signing = false;

    var request = new Request(remote, 'server_info');
    request.buildPath(true);
    assert.strictEqual(request.message.build_path, true);
  });

  it('Remove build path', function() {
    var remote = new Remote();
    remote._connected = true;
    remote.local_signing = false;

    var request = new Request(remote, 'server_info');
    request.buildPath(false);
    assert(!request.message.hasOwnProperty('build_path'));
  });

  it('Set build path with local signing', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    assert.throws(function() {
      request.buildPath(true);
    }, Error);
  });

  it('Set ledger hash', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.ledgerHash('B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE');
    assert.strictEqual(request.message.ledger_hash, 'B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE');
  });

  it('Set ledger index', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.ledgerIndex(7016915);
    assert.strictEqual(request.message.ledger_index, 7016915);
  });

  it('Select cached ledger - index', function() {
    var remote = new Remote();
    remote._connected = true;
    remote._ledger_current_index = 1;
    remote._ledger_hash = 'B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE';

    var request = new Request(remote, 'server_info');
    request.ledgerChoose(true);
    assert.strictEqual(request.message.ledger_index, 1);
  });

  it('Select cached ledger - hash', function() {
    var remote = new Remote();
    remote._connected = true;
    remote._ledger_current_index = 1;
    remote._ledger_hash = 'B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE';

    var request = new Request(remote, 'server_info');
    request.ledgerChoose();
    assert.strictEqual(request.message.ledger_hash, 'B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE');
  });

  it('Select ledger - identifier', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.ledgerSelect('validated');
    assert.strictEqual(request.message.ledger_index, 'validated');
  });

  it('Select ledger - index', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.ledgerSelect(7016915);
    assert.strictEqual(request.message.ledger_index, 7016915);
  });

  it('Select ledger - hash', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.ledgerSelect('B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE');
    assert.strictEqual(request.message.ledger_hash, 'B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE');
  });

  it('Select ledger - hash', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.ledgerSelect('B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE');
    assert.strictEqual(request.message.ledger_hash, 'B4FD84A73DBD8F0DA9E320D137176EBFED969691DC0AAC7882B76B595A0841AE');
  });

  it('Set account_root', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.accountRoot('v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V');
    assert.strictEqual(request.message.account_root, 'v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V');
  });

  it('Set index', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.index(1);
    assert.strictEqual(request.message.index, 1);
  });

  it('Set offer ID', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.offerId('v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V', 1337);
    assert.deepEqual(request.message.offer, {
      account: 'v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V',
      seq: 1337
    });
  });

  it('Set offer index', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.offerIndex(1337);
    assert.strictEqual(request.message.offer, 1337);
  });

  it('Set secret', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.secret('mySecret');
    assert.strictEqual(request.message.secret, 'mySecret');
  });

  it('Set transaction hash', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.txHash('E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7');
    assert.strictEqual(request.message.tx_hash, 'E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7');
  });

  it('Set transaction JSON', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    var txJson = { hash: 'E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7' };
    request.txJson(txJson);
    assert.deepEqual(request.message.tx_json, txJson);
  });

  it('Set transaction blob', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.txBlob('asdf');
    assert.strictEqual(request.message.tx_blob, 'asdf');
  });

  it('Set stream state', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.streamState('v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V', 'v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V', 'USD');
    assert.deepEqual(request.message.stream_state, {
      currency: 'USD',
      accounts: [ 'v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V', 'v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V' ]
    });
  });

  it('Set accounts', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    request.accounts([
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr',
        'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
    ]);

    assert.deepEqual(request.message.accounts, [
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr',
        'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
    ]);
  });

  it('Set accounts - string', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    request.accounts('vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr');

    assert.deepEqual(request.message.accounts, [
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr'
    ]);
  });

  it('Set accounts proposed', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');
    request.accountsProposed([
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr',
        'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
    ]);

    assert.deepEqual(request.message.accounts_proposed, [
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr',
        'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
    ]);
  });

  it('Add account', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    request.accounts([
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr',
    ]);

    request.addAccount('vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB');

    assert.deepEqual(request.message.accounts, [
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr',
        'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
    ]);
  });

  it('Add account proposed', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    request.accountsProposed([
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr',
    ]);

    request.addAccountProposed('vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB');

    assert.deepEqual(request.message.accounts_proposed, [
        'vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr',
        'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
    ]);
  });

  it('Set books', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    var books = [
      {
      'taker_gets': {
        'currency': 'EUR',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'taker_pays': {
        'currency': 'USD',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      }
    }
    ];

    request.books(books);

    assert.deepEqual(request.message.books, [
      {
      'taker_gets': {
        'currency': Currency.from_json('EUR').to_hex(),
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'taker_pays': {
        'currency': Currency.from_json('USD').to_hex(),
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'snapshot': true
    }
    ]);
  });

  it('Add book', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    request.addBook({
      'taker_gets': {
        'currency': 'CNY',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'taker_pays': {
        'currency': 'USD',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      }
    });

    assert.deepEqual(request.message.books, [
      {
        'taker_gets': {
          'currency': Currency.from_json('CNY').to_hex(),
          'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
        },
        'taker_pays': {
          'currency': Currency.from_json('USD').to_hex(),
          'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
        },
        'snapshot': true
      }
    ]);

    var books = [
      {
        'taker_gets': {
          'currency': 'EUR',
          'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
        },
        'taker_pays': {
          'currency': 'USD',
          'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
        }
      }
    ];

    request.books(books);

    assert.deepEqual(request.message.books, [
      {
        'taker_gets': {
          'currency': '0000000000000000000000004555520000000000', // EUR hex
          'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
        },
        'taker_pays': {
          'currency': '0000000000000000000000005553440000000000', // USD hex
          'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
        },
        'snapshot': true
      },
    ]);
  });

  it('Add book - missing side', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    request.message.books = void(0);

    var books = [
      {
        'taker_gets': {
          'currency': 'EUR',
          'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
        }
      }
    ];

    assert.throws(function() {
      request.books(books);
    });
  });

  it('Add book - without snapshot', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    request.message.books = void(0);

    var book = {
      'taker_gets': {
        'currency': 'EUR',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'taker_pays': {
        'currency': 'USD',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'both': true
    };

    request.addBook(book, true);

    assert.deepEqual(request.message.books, [{
      'taker_gets': {
        'currency': Currency.from_json('EUR').to_hex(),
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'taker_pays': {
        'currency': Currency.from_json('USD').to_hex(),
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'both': true,
      'snapshot': true
    }]);
  });

  it('Add book -  no snapshot', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'server_info');

    request.message.books = void(0);

    var book = {
      'taker_gets': {
        'currency': 'EUR',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'taker_pays': {
        'currency': 'USD',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'both': true
    };

    request.addBook(book, false);

    assert.deepEqual(request.message.books, [{
      'taker_gets': {
        'currency': Currency.from_json('EUR').to_hex(),
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'taker_pays': {
        'currency': Currency.from_json('USD').to_hex(),
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'both': true
    }]);
  });

  it('Add stream', function() {
    var remote = new Remote();
    remote._connected = true;

    var request = new Request(remote, 'subscribe');

    request.addStream('server', 'ledger');
    request.addStream('transactions', 'transactions_proposed');
    request.addStream('accounts', [ 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB' ]);
    request.addStream('accounts_proposed', [ 'v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V' ]);
    request.addStream('books', [{
      'taker_gets': {
        'currency': 'EUR',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      },
      'taker_pays': {
        'currency': 'USD',
        'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      }
    }]);

    assert.deepEqual(request.message, {
      'command': 'subscribe',
      'id': void(0),
      'streams': [
        'server',
        'ledger',
        'transactions',
        'transactions_proposed',
        'accounts',
        'accounts_proposed',
        'books'
      ],
      'accounts': [
        'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
      ],
      'accounts_proposed': [
        'v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V'
      ],
      'books': [
        {
          'taker_gets': {
            'currency': '0000000000000000000000004555520000000000',
            'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
          },
          'taker_pays': {
            'currency': '0000000000000000000000005553440000000000',
            'issuer': 'vBrKkG3Z6sbUN7Hd6mqxZQnEsXhmrxt2rB'
          },
          'snapshot': true
        }
      ]
    });
  });
});
