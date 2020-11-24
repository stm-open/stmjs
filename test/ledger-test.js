var assert = require('assert');
var fs     = require('fs');

var utils  = require('./testutils');
var Ledger = utils.load_module('ledger').Ledger;
var config = require('./testutils').get_config();

/**
* @param ledger_index {Number}
* Expects a corresponding ledger dump in $repo/test/fixtures/ folder
*/
create_ledger_test = function (ledger_index) {
  describe(String(ledger_index), function() {

    var path = __dirname + '/fixtures/ledger-full-'+ledger_index+'.json';

    var ledger_raw   = fs.readFileSync(path),
        ledger_json  = JSON.parse(ledger_raw),
        ledger       = Ledger.from_json(ledger_json);

    it('has account_hash of '+ ledger_json.account_hash, function() {
      assert.equal(ledger_json.account_hash,
                   ledger.calc_account_hash({sanity_test:true}).to_hex());
    })
    it('has transaction_hash of '+ ledger_json.transaction_hash, function() {
      assert.equal(ledger_json.transaction_hash,
                   ledger.calc_tx_hash().to_hex());
    })
  })
}

describe('Ledger', function() {
  // This is the first recorded ledger with a non empty transaction set
  create_ledger_test(4583454);
  // Because, why not.
  create_ledger_test(4509000);

  describe('#calcAccountRootEntryHash', function () {
    it('will calculate the AccountRoot entry hash for v959Zs1G1GDngut4xDCCWHxK2cfaVn5hHZ', function () {
      var account = 'v959Zs1G1GDngut4xDCCWHxK2cfaVn5hHZ';
      var expectedEntryHash = 'BE550AE211F8E99AF73336879CD23C5505C7F758D175D86D6238FB46FBEAE7FE';
      var actualEntryHash = Ledger.calcAccountRootEntryHash(account);
      
      assert.equal(actualEntryHash.to_hex(), expectedEntryHash);
    });
  });

  describe('#calcVStreamStateEntryHash', function () {
    it('will calculate the VStreamState entry hash for vs7miKXZ6zESaCMQeXPqm4NAyeEhMzfenb and vGQXtCirab4CiFpV4d5jHfjL9AC5PKNcSE in ETH', function () {
      var account1 = 'v4WxUoh6Ybvv8qgD1no5enznTCUzUbDFtK';
      var account2 = 'vGQXtCirab4CiFpV4d5jHfjL9AC5PKNcSE';
      var currency = 'ETH';

      var expectedEntryHash = '2D662145F0AA16594AF721EED4731942EF4A05E902418DC21EE330D20B20078A';
      var actualEntryHash1 = Ledger.calcVStreamStateEntryHash(account1, account2, currency);
      var actualEntryHash2 = Ledger.calcVStreamStateEntryHash(account2, account1, currency);
      
      assert.equal(actualEntryHash1.to_hex(), expectedEntryHash);
      assert.equal(actualEntryHash2.to_hex(), expectedEntryHash);
    });
    
    it('will calculate the VStreamState entry hash for vHU83HYPyVQCsEhsNCXdwMnojUNQMPU7pu and vhnoyjqkE8ZfmxHd6wBJdDEEEsxkLVMw9B in USD', function () {
      var account1 = 'vHU83HYPyVQCsEhsNCXdwMnojUNQMPU7pu';
      var account2 = 'vhnoyjqkE8ZfmxHd6wBJdDEEEsxkLVMw9B';
      var currency = 'USD';

      var expectedEntryHash = '561A4BC09B76107AB8C44BD7FC726C61F6F72EA38ABC2422AC28813324BEC392';
      var actualEntryHash1 = Ledger.calcVStreamStateEntryHash(account1, account2, currency);
      var actualEntryHash2 = Ledger.calcVStreamStateEntryHash(account2, account1, currency);
      
      assert.equal(actualEntryHash1.to_hex(), expectedEntryHash);
      assert.equal(actualEntryHash2.to_hex(), expectedEntryHash);
    });
  });

  describe('#calcOfferEntryHash', function () {
    it('will calculate the Offer entry hash for vLzecAs5Y1fo6CsC9DKdGQhSZnMUiX2tm3, sequence 207', function () {
      var account = 'vLzecAs5Y1fo6CsC9DKdGQhSZnMUiX2tm3';
      var sequence = 137
      var expectedEntryHash = 'BAAB0C704E1D4FE21011A76991E3F1D0AC3447FA7C785B440572BCB24E9BE091';
      var actualEntryHash = Ledger.calcOfferEntryHash(account, sequence);
      
      assert.equal(actualEntryHash.to_hex(), expectedEntryHash);
    });
  });
});

// vim:sw=2:sts=2:ts=8:et
