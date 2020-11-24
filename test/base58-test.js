var assert = require('assert');
var utils  = require('./testutils');
var Seed   = utils.load_module('seed').Seed;
var config = require('./testutils').get_config();

describe('Base58', function() {
  describe('Seed', function() {
    it('sn2xgf3EsA7n9iNVVsvTmvpK7NKeE', function () {
      var seed = Seed.from_json('sn2xgf3EsA7n9iNVVsvTmvpK7NKeE');
      assert.strictEqual(seed.to_hex(), 'CF7D4A6B3EB2E12D08A29BA15F02AE52');
    });
    it('sndbVTPHyJW7rteRYpzfNueAUhYvU',  function () {
      var seed = Seed.from_json('sndbVTPHyJW7rteRYpzfNueAUhYvU');
      assert.strictEqual(seed.to_hex(), 'D2C0076BC4955B142FCCAD985C3C9851');
    });
  });
});

// vim:sw=2:sts=2:ts=8:et
