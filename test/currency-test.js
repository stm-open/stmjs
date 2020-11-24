var assert   = require('assert');
var utils    = require('./testutils');
var currency = utils.load_module('currency').Currency;

describe('Currency', function() {
  describe('json_rewrite', function() {
    it('json_rewrite("USD") == "USD"', function() {
      assert.strictEqual('USD', currency.json_rewrite('USD'));
    });
    it('json_rewrite("NaN") == "STM"', function() {
      assert.strictEqual('STM', currency.json_rewrite(NaN));
    });
    it('json_rewrite("015841551A748AD2C1F76FF6ECB0CCCD00000000") == "XAU (-0.5%pa)"', function() {
      assert.strictEqual(currency.json_rewrite("015841551A748AD2C1F76FF6ECB0CCCD00000000"),
                         "XAU (-0.5%pa)");
    });
  });
  describe('from_json', function() {
    it('from_json(NaN).to_json() == "STM"', function() {
      var r = currency.from_json(NaN);
      assert(!r.is_valid());
      assert.strictEqual('STM', r.to_json());
    });
    it('from_json("STM").to_json() == "STM"', function() {
      var r = currency.from_json('STM');
      assert(r.is_valid());
      assert(r.is_native());
      assert.strictEqual('STM', r.to_json());
    });
    it('from_json("0000000000000000000000000000000000000000").to_json() == "STM"', function() {
      var r = currency.from_json('0000000000000000000000000000000000000000');
      assert(r.is_valid());
      assert(r.is_native());
      assert.strictEqual('STM', r.to_json());
    });
    it('from_json("111").to_human()', function() {
      var r = currency.from_json("111");
      assert(r.is_valid());
      assert.strictEqual('111', r.to_json());
    });
    it('from_json("1D2").to_human()', function() {
      var r = currency.from_json("1D2");
      assert(r.is_valid());
      assert.strictEqual('1D2', r.to_json());
    });
    it('from_json("XAU").to_json() hex', function() {
      var r = currency.from_json("XAU");
      assert.strictEqual('0000000000000000000000005841550000000000', r.to_json({force_hex: true}));
    });
    it('from_json("XAU (0.5%pa").to_json() hex', function() {
      var r = currency.from_json("XAU (0.5%pa)");
      assert.strictEqual('015841550000000041F78E0A28CBF19200000000', r.to_json({force_hex: true}));
    });
    it('json_rewrite("015841550000000041F78E0A28CBF19200000000").to_json() hex', function() {
      var r = currency.json_rewrite('015841550000000041F78E0A28CBF19200000000');
      assert.strictEqual('XAU (0.5%pa)', r);
    });
    it('json_rewrite("015841550000000041F78E0A28CBF19200000000") hex', function() {
      var r = currency.json_rewrite('015841550000000041F78E0A28CBF19200000000', {force_hex: true});
      assert.strictEqual('015841550000000041F78E0A28CBF19200000000', r);
    });
  });

  describe('from_human', function() {
    it('From human "USD - Gold (-25%pa)"', function() {
      var cur = currency.from_human('USD - Gold (-25%pa)');
      assert.strictEqual(cur.to_json(), 'USD (-25%pa)');
      assert.strictEqual(cur.to_hex(), '0155534400000000C19A22BC51297F0B00000000');
      assert.strictEqual(cur.to_json(), cur.to_human());
    });
    it('From human "EUR (-0.5%pa)', function() {
      var cur = currency.from_human('EUR (-0.5%pa)');
      assert.strictEqual(cur.to_json(), 'EUR (-0.5%pa)');
    });
    it('From human "EUR (0.5361%pa)", test decimals', function() {
      var cur = currency.from_human('EUR (0.5361%pa)');
      assert.strictEqual(cur.to_json(), 'EUR (0.54%pa)');
      assert.strictEqual(cur.to_json({decimals:4}), 'EUR (0.5361%pa)');
      assert.strictEqual(cur.get_interest_percentage_at(undefined, 4), 0.5361);
    });
    it('From human "EUR - Euro (0.5361%pa)", test decimals and full_name', function() {
      var cur = currency.from_human('EUR (0.5361%pa)');
      assert.strictEqual(cur.to_json(), 'EUR (0.54%pa)');
      assert.strictEqual(cur.to_json({decimals:4, full_name:'Euro'}), 'EUR - Euro (0.5361%pa)');
      assert.strictEqual(cur.get_interest_percentage_at(undefined, 4), 0.5361);
    });
    it('From human "TYX - 30-Year Treasuries (1.5%pa)"', function() {
      var cur = currency.from_human('TYX - 30-Year Treasuries (1.5%pa)');
      assert.strictEqual(cur.to_json(), 'TYX (1.5%pa)');
    });
    it('From human "TYX - 30-Year Treasuries"', function() {
      var cur = currency.from_human('TYX - 30-Year Treasuries');
      assert.strictEqual(cur.to_json(), 'TYX');
    });
    it('From human "INR - Indian Rupees (-0.5%)"', function() {
      var cur = currency.from_human('INR - Indian Rupees (-0.5%pa)');
      assert.strictEqual(cur.to_json(), 'INR (-0.5%pa)');
    });
    it('From human "INR - 30 Indian Rupees"', function() {
      var cur = currency.from_human('INR - 30 Indian Rupees');
      assert.strictEqual(cur.to_json(), 'INR');
    });

  });

  describe('to_human', function() {
    it('"USD".to_human() == "USD"', function() {
      assert.strictEqual('USD', currency.from_json('USD').to_human());
    });
    it('"NaN".to_human() == "STM"', function() {
      assert.strictEqual('STM', currency.from_json(NaN).to_human());
    });
    it('"015841551A748AD2C1F76FF6ECB0CCCD00000000") == "015841551A748AD2C1F76FF6ECB0CCCD00000000"', function() {
      assert.strictEqual(currency.from_json("015841551A748AD2C1F76FF6ECB0CCCD00000000").to_human(),
                         'XAU (-0.5%pa)');
    });
    it('to_human with full_name "USD - US Dollar"', function() {
      assert.strictEqual('USD - US Dollar', currency.from_json('USD').to_human({full_name:'US Dollar'}));
    });
    it('to_human with full_name "STM - Ripples"', function() {
      assert.strictEqual('STM - Ripples', currency.from_json('STM').to_human({full_name:'Ripples'}));
    });
    it('to_human human "TIM" without full_name', function() {
      var cur = currency.from_json("TIM");
      assert.strictEqual(cur.to_human(), "TIM");
    });
    it('to_human "TIM" with null full_name', function() {
      var cur = currency.from_json("TIM");
      assert.strictEqual(cur.to_human({full_name: null}), "TIM");
    });
  });

  describe('from_hex', function() {
    it('"015841551A748AD2C1F76FF6ECB0CCCD00000000" === "XAU (-0.5%pa)"', function() {
      var cur = currency.from_hex('015841551A748AD2C1F76FF6ECB0CCCD00000000');
      assert.strictEqual(cur.to_json(), 'XAU (-0.5%pa)');
      assert.strictEqual(cur.to_hex(), '015841551A748AD2C1F76FF6ECB0CCCD00000000');
      assert.strictEqual(cur.to_json(), cur.to_human());
    });
  });
  describe('parse_json(currency obj)', function() {
    assert.strictEqual('USD', new currency().parse_json(currency.from_json('USD')).to_json());

    assert.strictEqual('USD (0.5%pa)', new currency().parse_json(currency.from_json('USD (0.5%pa)')).to_json());
  });

  describe('is_valid', function() {
    it('Currency.is_valid("STM")', function() {
      assert(currency.is_valid('STM'));
    });
    it('!Currency.is_valid(NaN)', function() {
      assert(!currency.is_valid(NaN));
    });
    it('from_json("STM").is_valid()', function() {
      assert(currency.from_json('STM').is_valid());
    });
    it('!from_json(NaN).is_valid()', function() {
      assert(!currency.from_json(NaN).is_valid());
    });
  });
  describe('clone', function() {
    it('should clone currency object', function() {
      var c = currency.from_json('STM');
      assert.strictEqual('STM', c.clone().to_json());
    });
  });
  describe('to_human', function() {
    it('should generate human string', function() {
      assert.strictEqual('STM', currency.from_json('STM').to_human());
    });
  });
  describe('has_interest', function() {
    it('should be true for type 1 currency codes', function() {
      assert(currency.from_hex('015841551A748AD2C1F76FF6ECB0CCCD00000000').has_interest());
      assert(currency.from_json('015841551A748AD2C1F76FF6ECB0CCCD00000000').has_interest());
    });
    it('should be false for type 0 currency codes', function() {
      assert(!currency.from_hex('0000000000000000000000005553440000000000').has_interest());
      assert(!currency.from_json('USD').has_interest());
    });
  });
  function precision(num, precision) {
    return +(Math.round(num + "e+"+precision)  + "e-"+precision);
  }
  describe('get_interest_at', function() {
    it('returns demurred value for demurrage currency', function() {
      var cur = currency.from_json('015841551A748AD2C1F76FF6ECB0CCCD00000000');

      // At start, no demurrage should occur
      assert.equal(1, cur.get_interest_at(443845330));

      // After one year, 0.5% should have occurred
      assert.equal(0.995, precision(cur.get_interest_at(443845330 + 31536000), 14));

      // After one demurrage period, 1/e should have occurred
      assert.equal(1/Math.E, cur.get_interest_at(443845330 + 6291418827.05));

      // One year before start, it should be (roughly) 0.5% higher.
      assert.equal(1.005, precision(cur.get_interest_at(443845330 - 31536000), 4));

      // One demurrage period before start, rate should be e
      assert.equal(Math.E, cur.get_interest_at(443845330 - 6291418827.05));
    });
  });
  describe('get_iso', function() {
    it('should get "STM" iso_code', function() {
      assert.strictEqual('STM', currency.from_json('STM').get_iso());
    });
    it('should get iso_code', function() {
      assert.strictEqual('USD', currency.from_json('USD - US Dollar').get_iso());
    });
    it('should get iso_code', function() {
      assert.strictEqual('USD', currency.from_json('USD (0.5%pa)').get_iso());
    });
  });
});
