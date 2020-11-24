var assert = require('assert');
var utils  = require('./testutils');
var Seed   = utils.load_module('seed').Seed;

function _isNaN(n) {
  return typeof n === 'number' && isNaN(n);
}

describe('Signing', function() {
  describe('Keys', function() {
    it('SigningPubKey 1',  function () {
      var seed = Seed.from_json('shi4r1PZk2osqQDoKdQm82ENXQso7');
      var key = seed.get_key('v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V');
      var pub = key.to_hex_pub();
      assert.strictEqual(pub, '02CAFE8B2856B450402BDAB673F556713075230C29ADD61D381666010F2E5154A1');
    });
    it('SigningPubKey 2 (master seed)',  function () {
      var seed = Seed.from_json('sptgLuh9ihDJh22GWii6xjL97iDjA');
      var key = seed.get_key('vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr');
      var pub = key.to_hex_pub();
      assert.strictEqual(pub, '0341075B3B37B662352CF058DDD07732426C039675AA1EE6E7EE5C402D00A22F09');
    });
  });
  describe('parse_json', function() {
    it('empty string', function() {
      assert(_isNaN(new Seed().parse_json('').to_json()));
    });
    it('hex string', function() {
      // 32 0s is a valid hex repr of seed bytes
      var str = new Array(33).join('0');
      assert.strictEqual((new Seed().parse_json(str).to_json()), 'sp6JS7f14BuwFY8Mw6bTtLKWauoUs');
    });
    it('passphrase', function() {
      var str = new Array(60).join('0');
      assert.strictEqual('snFRPnVL3secohdpwSie8ANXdFQrG', new Seed().parse_json(str).to_json());
    });
    it('null', function() {
      assert(_isNaN(new Seed().parse_json(null).to_json()));
    });
  });
  describe('parse_passphrase', function() {
    it('invalid passphrase', function() {
      assert.throws(function() {
        new Seed().parse_passphrase(null);
      });
    });
  });
  describe('get_key', function() {
    it('get key from invalid seed', function() {
      assert.throws(function() {
        new Seed().get_key('vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr');
      });
    });
  });
});

// vim:sw=2:sts=2:ts=8:et
