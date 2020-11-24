var assert     = require('assert');
var utils      = require('./testutils');
var BigInteger = require('../src/js/jsbn/jsbn').BigInteger;
var Amount     = utils.load_module('amount').Amount;
var UInt160    = utils.load_module('uint160').UInt160;
var config     = utils.get_config();

describe('Amount', function() {
  describe('Negatives', function() {
    it('Number 1', function () {
      assert.strictEqual(Amount.from_human('0').add(Amount.from_human('-1')).to_human(), '-1');
    });
  });
  describe('Positives', function() {
    it('Number 1', function() {
      assert(Amount.from_json('1').is_positive());
    });
  });
  describe('from_human', function() {
    it('1 STM', function() {
      assert.strictEqual(Amount.from_human("1 STM").to_text_full(), '1/STM');
    });
    it('1 STM human', function() {
      assert.strictEqual(Amount.from_human("1 STM").to_human_full(), '1/STM');
    });
    it('0.1 STM', function() {
      assert.strictEqual(Amount.from_human("0.1 STM").to_text_full(), '0.1/STM');
    });
    it('0.1 STM human', function() {
      assert.strictEqual(Amount.from_human("0.1 STM").to_human_full(), '0.1/STM');
    });
    it('0.1 USD', function() {
      assert.strictEqual(Amount.from_human("0.1 USD").to_text_full(), '0.1/USD/NaN');
    });
    it('0.1 USD human', function() {
      assert.strictEqual(Amount.from_human("0.1 USD").to_human_full(), '0.1/USD/NaN');
    });
    it('10000 USD', function() {
      assert.strictEqual(Amount.from_human("10000 USD").to_text_full(), '10000/USD/NaN');
    });
    it('10000 USD human', function() {
      assert.strictEqual(Amount.from_human("10000 USD").to_human_full(), '10,000/USD/NaN');
    });
    it('USD 10000', function() {
      assert.strictEqual(Amount.from_human("USD 10000").to_text_full(), '10000/USD/NaN');
    });
    it('USD 10000 human', function() {
      assert.strictEqual(Amount.from_human("USD 10000").to_human_full(), '10,000/USD/NaN');
    });
    it('12345.6789 XAU', function() {
      assert.strictEqual(Amount.from_human("12345.6789 XAU").to_text_full(), '12345.6789/XAU/NaN');
    });
    it('12345.6789 XAU human', function() {
      assert.strictEqual(Amount.from_human("12345.6789 XAU").to_human_full(), '12,345.6789/XAU/NaN');
    });
    it('12345.6789 015841551A748AD2C1F76FF6ECB0CCCD00000000', function() {
      assert.strictEqual(Amount.from_human("12345.6789 015841551A748AD2C1F76FF6ECB0CCCD00000000").to_text_full(), '12345.6789/XAU (-0.5%pa)/NaN');
    });
    it('12345.6789 015841551A748AD2C1F76FF6ECB0CCCD00000000 human', function() {
      assert.strictEqual(Amount.from_human("12345.6789 015841551A748AD2C1F76FF6ECB0CCCD00000000").to_human_full(), '12,345.6789/XAU (-0.5%pa)/NaN');
    });
    it('12345.6789 0000000000000000000000005553440000000000', function() {
      assert.strictEqual(Amount.from_human("12345.6789 0000000000000000000000005553440000000000").to_text_full(), '12345.6789/USD/NaN');
    });
    it('12345.6789 0000000000000000000000005553440000000000 human', function() {
      assert.strictEqual(Amount.from_human("12345.6789 0000000000000000000000005553440000000000").to_human_full(), '12,345.6789/USD/NaN');
    });
    it('10 0000000000000000000000005553440000000000', function() {
      assert.strictEqual(Amount.from_human("10 0000000000000000000000005553440000000000").to_text_full(), '10/USD/NaN');
    });
    it('10 0000000000000000000000005553440000000000 human', function() {
      assert.strictEqual(Amount.from_human("10 0000000000000000000000005553440000000000").to_human_full(), '10/USD/NaN');
    });
    it('100 0000000000000000000000005553440000000000', function() {
      assert.strictEqual(Amount.from_human("100 0000000000000000000000005553440000000000").to_text_full(), '100/USD/NaN');
    });
    it('100 0000000000000000000000005553440000000000 human', function() {
      assert.strictEqual(Amount.from_human("100 0000000000000000000000005553440000000000").to_human_full(), '100/USD/NaN');
    });
    it('1000 0000000000000000000000005553440000000000', function() {
      assert.strictEqual(Amount.from_human("1000 0000000000000000000000005553440000000000").to_text_full(), '1000/USD/NaN');
    });
    it('1000 0000000000000000000000005553440000000000 human', function() {
      assert.strictEqual(Amount.from_human("1000 0000000000000000000000005553440000000000").to_human_full(), '1,000/USD/NaN');
    });
    it('-100 0000000000000000000000005553440000000000', function() {
      assert.strictEqual(Amount.from_human("-100 0000000000000000000000005553440000000000").to_text_full(), '-100/USD/NaN');
    });
    it('-100 0000000000000000000000005553440000000000 human', function() {
      assert.strictEqual(Amount.from_human("-100 0000000000000000000000005553440000000000").to_human_full(), '-100/USD/NaN');
    });
    it('-1000 0000000000000000000000005553440000000000', function() {
      assert.strictEqual(Amount.from_human("-1000 0000000000000000000000005553440000000000").to_text_full(), '-1000/USD/NaN');
    });
    it('-1000 0000000000000000000000005553440000000000 human', function() {
      assert.strictEqual(Amount.from_human("-1000 0000000000000000000000005553440000000000").to_human_full(), '-1,000/USD/NaN');
    });
    it('-1000.001 0000000000000000000000005553440000000000', function() {
      assert.strictEqual(Amount.from_human("-1000.001 0000000000000000000000005553440000000000").to_text_full(), '-1000.001/USD/NaN');
    });
    it('-1000.001 0000000000000000000000005553440000000000 human', function() {
      assert.strictEqual(Amount.from_human("-1000.001 0000000000000000000000005553440000000000").to_human_full(), '-1,000.001/USD/NaN');
    });
    it('XAU 12345.6789', function() {
      assert.strictEqual(Amount.from_human("XAU 12345.6789").to_text_full(), '12345.6789/XAU/NaN');
    });
    it('XAU 12345.6789 human', function() {
      assert.strictEqual(Amount.from_human("XAU 12345.6789").to_human_full(), '12,345.6789/XAU/NaN');
    });
    it('101 12345.6789', function() {
      assert.strictEqual(Amount.from_human("101 12345.6789").to_text_full(), '12345.6789/101/NaN');
    });
    it('101 12345.6789 human', function() {
      assert.strictEqual(Amount.from_human("101 12345.6789").to_human_full(), '12,345.6789/101/NaN');
    });
    it('12345.6789 101', function() {
      assert.strictEqual(Amount.from_human("12345.6789 101").to_text_full(), '12345.6789/101/NaN');
    });
    it('12345.6789 101 human', function() {
      assert.strictEqual(Amount.from_human("12345.6789 101").to_human_full(), '12,345.6789/101/NaN');
    });
  });
  describe('from_json', function() {
    it('1 STM', function() {
      assert.strictEqual(Amount.from_json("1/STM").to_text_full(), "1/STM/NaN");
    });
    it('1 STM human', function() {
      assert.strictEqual(Amount.from_json("1/STM").to_human_full(), "1/STM/NaN");
    });
  });
  describe('from_number', function() {
    it('Number 1', function() {
      assert.strictEqual(Amount.from_number(1).to_text_full(), '1/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Number 1 human', function() {
      assert.strictEqual(Amount.from_number(1).to_human_full(), '1/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Number 2', function() {
      assert.strictEqual(Amount.from_number(2).to_text_full(), '2/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Number 2 human', function() {
      assert.strictEqual(Amount.from_number(2).to_human_full(), '2/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Multiply 2 "1" with 3 "1", by product_human', function () {
      assert.strictEqual(Amount.from_number(2).product_human(Amount.from_number(3)).to_text_full(), '6/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Multiply 2 "1" with 3 "1", by product_human human', function () {
      assert.strictEqual(Amount.from_number(2).product_human(Amount.from_number(3)).to_human_full(), '6/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Multiply 3 USD with 3 "1"', function () {
      assert.strictEqual(Amount.from_json('3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_number(3)).to_text_full(), '9/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply 3 USD with 3 "1" human', function () {
      assert.strictEqual(Amount.from_json('3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_number(3)).to_human_full(), '9/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply -1 "1" with 3 USD', function () {
      assert.strictEqual(Amount.from_number(-1).multiply(Amount.from_json('3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full(), '-3/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Multiply -1 "1" with 3 USD human', function () {
      assert.strictEqual(Amount.from_number(-1).multiply(Amount.from_json('3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full(), '-3/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Multiply -1 "1" with 3 USD, by product_human', function () {
      assert.strictEqual(Amount.from_number(-1).product_human(Amount.from_json('3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full(), '-3/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Multiply -1 "1" with 3 USD, by product_human human', function () {
      assert.strictEqual(Amount.from_number(-1).product_human(Amount.from_json('3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full(), '-3/1/vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
  });
  describe('text_full_rewrite', function() {
    it('Number 1', function() {
      assert.strictEqual('0.000001/STM', Amount.text_full_rewrite(1));
    });
  });
  describe('json_rewrite', function() {
    it('Number 1', function() {
      assert.strictEqual('1', Amount.json_rewrite(1));
    });
  });
  describe('UInt160', function() {
    it('Parse 0', function () {
      assert.deepEqual(new BigInteger(), UInt160.from_generic('0')._value);
    });
    it('Parse 0 export', function () {
      assert.strictEqual(UInt160.ACCOUNT_ZERO, UInt160.from_generic('0').set_version(0).to_json());
    });
    it('Parse 1', function () {
      assert.deepEqual(new BigInteger([1]), UInt160.from_generic('1')._value);
    });
    it('Parse vvvvvvvvvvvvvvvvvvvvvhoLrTp export', function () {
      assert.strictEqual(UInt160.ACCOUNT_ZERO, UInt160.from_json('vvvvvvvvvvvvvvvvvvvvvhoLrTp').to_json());
    });
    it('Parse vvvvvvvvvvvvvvvvvvvvBZbrji export', function () {
      assert.strictEqual(UInt160.ACCOUNT_ONE, UInt160.from_json('vvvvvvvvvvvvvvvvvvvvBZbrji').to_json());
    });
    it('Parse bob export', function () {
      assert.strictEqual(config.accounts['bob'].account, UInt160.from_json('bob').to_json());
    });
    it('is_valid vvvvvvvvvvvvvvvvvvvvvhoLrTp', function () {
      assert(UInt160.is_valid('vvvvvvvvvvvvvvvvvvvvvhoLrTp'));
    });
    it('!is_valid rrrrrrrrrrrrrrrrrrrrrhoLvT', function () {
      assert(!UInt160.is_valid('rrrrrrrrrrrrrrrrrrrrrhoLvT'));
    });
  });
  describe('Amount validity', function() {
    it('is_valid 1', function() {
      assert(Amount.is_valid(1));
    });
    it('is_valid "1"', function() {
      assert(Amount.is_valid('1'));
    });
    it('is_valid "1/STM"', function() {
      assert(Amount.is_valid('1/STM'));
    });
    it('!is_valid NaN', function() {
      assert(!Amount.is_valid(NaN));
    });
    it('!is_valid "xx"', function() {
      assert(!Amount.is_valid('xx'));
    });
    it('!is_valid_full 1', function() {
      assert(!Amount.is_valid_full(1));
    });
    it('is_valid_full "1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9"', function() {
      assert(Amount.is_valid_full('1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9'));
    });
  });
  describe('Amount parsing', function() {
    it('Parse invalid string', function() {
      assert.strictEqual(Amount.from_json('x').to_text(), '0');
      assert.strictEqual(typeof Amount.from_json('x').to_text(true), 'number');
      assert(isNaN(Amount.from_json('x').to_text(true)));
    });
    it('parse dem', function() {
      assert.strictEqual(Amount.from_json('10/015841551A748AD2C1F76FF6ECB0CCCD00000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full(), '10/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('parse dem human', function() {
      assert.strictEqual(Amount.from_json('10/015841551A748AD2C1F76FF6ECB0CCCD00000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full(), '10/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('parse dem', function() {
      assert.strictEqual(Amount.from_json('10/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full(), '10/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('parse dem human', function() {
      assert.strictEqual(Amount.from_json('10/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full(), '10/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Parse 800/USD/bob', function () {
      assert.strictEqual('800/USD/'+config.accounts['bob'].account, Amount.from_json('800/USD/bob').to_text_full());
    });
    it('Parse 800/USD/bob human', function () {
      assert.strictEqual('800/USD/'+config.accounts['bob'].account, Amount.from_json('800/USD/bob').to_human_full());
    });
    it('Parse native 0', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').to_text_full());
    });
    it('Parse native 0.0', function () {
      assert.strictEqual('0/STM', Amount.from_json('0.0').to_text_full());
    });
    it('Parse native -0', function () {
      assert.strictEqual('0/STM', Amount.from_json('-0').to_text_full());
    });
    it('Parse native -0.0', function () {
      assert.strictEqual('0/STM', Amount.from_json('-0.0').to_text_full());
    });
    it('Parse native 1000', function () {
      assert.strictEqual('0.001/STM', Amount.from_json('1000').to_text_full());
    });
    it('Parse native 12.3', function () {
      assert.strictEqual('12.3/STM', Amount.from_json('12.3').to_text_full());
    });
    it('Parse native -12.3', function () {
      assert.strictEqual('-12.3/STM', Amount.from_json('-12.3').to_text_full());
    });
    it('Parse 123./USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', function () {
      assert.strictEqual('123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('123./USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full());
    });
    it('Parse 12300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', function () {
      assert.strictEqual('12300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('12300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full());
    });
    it('Parse 12.3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', function () {
      assert.strictEqual('12.3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('12.3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full());
    });
    it('Parse 1.2300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', function () {
      assert.strictEqual('1.23/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('1.2300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full());
    });
    it('Parse -0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full());
    });
    it('Parse -0.0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-0.0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full());
    });
    it('Parse 0.0/111/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', function () {
      assert.strictEqual('0/111/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/111/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full());
    });
    it('Parse 0.0/12D/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', function () {
      assert.strictEqual('0/12D/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/12D/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_text_full());
    });
    it('Parse native 0 human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').to_human_full());
    });
    it('Parse native 0.0 human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0.0').to_human_full());
    });
    it('Parse native -0 human', function () {
      assert.strictEqual('0/STM', Amount.from_json('-0').to_human_full());
    });
    it('Parse native -0.0 human', function () {
      assert.strictEqual('0/STM', Amount.from_json('-0.0').to_human_full());
    });
    it('Parse native 1000 human', function () {
      assert.strictEqual('0.001/STM', Amount.from_json('1000').to_human_full());
    });
    it('Parse native 12.3 human', function () {
      assert.strictEqual('12.3/STM', Amount.from_json('12.3').to_human_full());
    });
    it('Parse native -12.3 human', function () {
      assert.strictEqual('-12.3/STM', Amount.from_json('-12.3').to_human_full());
    });
    it('Parse 123./USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD human', function () {
      assert.strictEqual('123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('123./USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full());
    });
    it('Parse 12300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD human', function () {
      assert.strictEqual('12,300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('12300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full());
    });
    it('Parse 12.3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD human', function () {
      assert.strictEqual('12.3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('12.3/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full());
    });
    it('Parse 1.2300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD human', function () {
      assert.strictEqual('1.23/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('1.2300/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full());
    });
    it('Parse -0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD human', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full());
    });
    it('Parse -0.0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD human', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-0.0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full());
    });
    it('Parse 0.0/111/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD human', function () {
      assert.strictEqual('0/111/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/111/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full());
    });
    it('Parse 0.0/12D/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD human', function () {
      assert.strictEqual('0/12D/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/12D/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').to_human_full());
    });
  });
  describe('Amount to_json', function() {
    it('10 USD', function() {
      var amount = Amount.from_human("10 USD").to_json();
      assert.strictEqual("10", amount.value);
      assert.strictEqual("USD", amount.currency);
    });
    it('10 0000000000000000000000005553440000000000', function() {
      var amount = Amount.from_human("10 0000000000000000000000005553440000000000").to_json();
      assert.strictEqual("10", amount.value);
      assert.strictEqual("USD", amount.currency);
    });
    it('10 015841551A748AD2C1F76FF6ECB0CCCD00000000', function() {
      var amount = Amount.from_human("10 015841551A748AD2C1F76FF6ECB0CCCD00000000").to_json();
      assert.strictEqual("10", amount.value);
      assert.strictEqual("015841551A748AD2C1F76FF6ECB0CCCD00000000", amount.currency);
    });
  });
  describe('Amount operations', function() {
    it('Negate native 123', function () {
      assert.strictEqual('-0.000123/STM', Amount.from_json('123').negate().to_text_full());
    });
    it('Negate native -123', function () {
      assert.strictEqual('0.000123/STM', Amount.from_json('-123').negate().to_text_full());
    });
    it('Negate non-native 123', function () {
      assert.strictEqual('-123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').negate().to_text_full());
    });
    it('Negate non-native -123', function () {
      assert.strictEqual('123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').negate().to_text_full());
    });
    it('Clone non-native -123', function () {
      assert.strictEqual('-123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').clone().to_text_full());
    });
    it('Add STM to STM', function () {
      assert.strictEqual('0.0002/STM', Amount.from_json('150').add(Amount.from_json('50')).to_text_full());
    });
    it('Add USD to USD', function () {
      assert.strictEqual('200.52/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('150.02/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').add(Amount.from_json('50.5/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Add 0 USD to 1 USD', function() {
      assert.strictEqual('1' , Amount.from_json('1/USD').add('0/USD').to_text());
    });
    it('Subtract USD from USD', function() {
      assert.strictEqual('99.52/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('150.02/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').subtract(Amount.from_json('50.5/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply 0 STM with 0 STM', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').multiply(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 0 USD with 0 STM', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 0 STM with 0 USD', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').multiply(Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply 1 STM with 0 STM', function () {
      assert.strictEqual('0/STM', Amount.from_json('1').multiply(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 1 USD with 0 STM', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 1 STM with 0 USD', function () {
      assert.strictEqual('0/STM', Amount.from_json('1').multiply(Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply 0 STM with 1 STM', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').multiply(Amount.from_json('1')).to_text_full());
    });
    it('Multiply 0 USD with 1 STM', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('1')).to_text_full());
    });
    it('Multiply 0 STM with 1 USD', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').multiply(Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD', function () {
      assert.equal('0.002/STM', Amount.from_json('200').multiply(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD', function () {
      assert.strictEqual('0.2/STM', Amount.from_json('20000').multiply(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD', function () {
      assert.strictEqual('20/STM', Amount.from_json('2000000').multiply(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD, neg', function () {
      assert.strictEqual('-0.002/STM', Amount.from_json('200').multiply(Amount.from_json('-10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD, neg, frac', function () {
      assert.strictEqual('-0.222/STM', Amount.from_json('-6000').multiply(Amount.from_json('37/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply USD with USD', function () {
      assert.strictEqual('20000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply USD with USD', function () {
      assert.strictEqual('200000000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('100000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply EUR with USD, result < 1', function () {
      assert.strictEqual('100000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply EUR with USD, neg', function () {
      assert.strictEqual('-48000000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-24000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply EUR with USD, neg, <1', function () {
      assert.strictEqual('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0.1/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('-1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply EUR with STM, factor < 1', function () {
      assert.strictEqual('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('2000')).to_text_full());
    });
    it('Multiply EUR with STM, neg', function () {
      assert.strictEqual('-500/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('5')).to_text_full());
    });
    it('Multiply EUR with STM, neg, <1', function () {
      assert.strictEqual('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('2000')).to_text_full());
    });
    it('Multiply STM with STM', function () {
      assert.strictEqual('0.0001/STM', Amount.from_json('10').multiply(Amount.from_json('10')).to_text_full());
    });
    it('Divide STM by USD', function () {
      assert.strictEqual('0.00002/STM', Amount.from_json('200').divide(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide STM by USD', function () {
      assert.strictEqual('0.002/STM', Amount.from_json('20000').divide(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide STM by USD', function () {
      assert.strictEqual('0.2/STM', Amount.from_json('2000000').divide(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide STM by USD, neg', function () {
      assert.strictEqual('-0.00002/STM', Amount.from_json('200').divide(Amount.from_json('-10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide STM by USD, neg, frac', function () {
      assert.strictEqual('-0.000162/STM', Amount.from_json('-6000').divide(Amount.from_json('37/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide USD by USD', function () {
      assert.strictEqual('200/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide USD by USD, fractional', function () {
      assert.strictEqual('57142.85714285714/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('35/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide USD by USD', function () {
      assert.strictEqual('20/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('100000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide EUR by USD, factor < 1', function () {
      assert.strictEqual('0.1/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide EUR by USD, neg', function () {
      assert.strictEqual('-12/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-24000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide EUR by USD, neg, <1', function () {
      assert.strictEqual('-0.1/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('-1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Divide EUR by STM, result < 1', function () {
      assert.strictEqual('0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('2000')).to_text_full());
    });
    it('Divide EUR by STM, neg', function () {
      assert.strictEqual('-20/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('5')).to_text_full());
    });
    it('Divide EUR by STM, neg, <1', function () {
      assert.strictEqual('-0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('2000')).to_text_full());
    });
    it('Negate native 123 human', function () {
      assert.strictEqual('-0.000123/STM', Amount.from_json('123').negate().to_human_full());
    });
    it('Negate native -123 human', function () {
      assert.strictEqual('0.000123/STM', Amount.from_json('-123').negate().to_human_full());
    });
    it('Negate non-native 123 human', function () {
      assert.strictEqual('-123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').negate().to_human_full());
    });
    it('Negate non-native -123 human', function () {
      assert.strictEqual('123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').negate().to_human_full());
    });
    it('Clone non-native -123 human', function () {
      assert.strictEqual('-123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-123/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').clone().to_human_full());
    });
    it('Add STM to STM human', function () {
      assert.strictEqual('0.0002/STM', Amount.from_json('150').add(Amount.from_json('50')).to_human_full());
    });
    it('Add USD to USD human', function () {
      assert.strictEqual('200.52/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('150.02/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').add(Amount.from_json('50.5/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Add 0 USD to 1 USD human', function() {
      assert.strictEqual('1' , Amount.from_json('1/USD').add('0/USD').to_human());
    });
    it('Subtract USD from USD human', function() {
      assert.strictEqual('99.52/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('150.02/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').subtract(Amount.from_json('50.5/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply 0 STM with 0 STM human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').multiply(Amount.from_json('0')).to_human_full());
    });
    it('Multiply 0 USD with 0 STM human', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('0')).to_human_full());
    });
    it('Multiply 0 STM with 0 USD human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').multiply(Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply 1 STM with 0 STM human', function () {
      assert.strictEqual('0/STM', Amount.from_json('1').multiply(Amount.from_json('0')).to_human_full());
    });
    it('Multiply 1 USD with 0 STM human', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('0')).to_human_full());
    });
    it('Multiply 1 STM with 0 USD human', function () {
      assert.strictEqual('0/STM', Amount.from_json('1').multiply(Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply 0 STM with 1 STM human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').multiply(Amount.from_json('1')).to_human_full());
    });
    it('Multiply 0 USD with 1 STM human', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('1')).to_human_full());
    });
    it('Multiply 0 STM with 1 USD human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').multiply(Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD human', function () {
      assert.equal('0.002/STM', Amount.from_json('200').multiply(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD human', function () {
      assert.strictEqual('0.2/STM', Amount.from_json('20000').multiply(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD human', function () {
      assert.strictEqual('20/STM', Amount.from_json('2000000').multiply(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD, neg human', function () {
      assert.strictEqual('-0.002/STM', Amount.from_json('200').multiply(Amount.from_json('-10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD, neg, frac human', function () {
      assert.strictEqual('-0.222/STM', Amount.from_json('-6000').multiply(Amount.from_json('37/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply USD with USD human', function () {
      assert.strictEqual('20,000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply USD with USD human', function () {
      assert.strictEqual('200,000,000,000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('100000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply EUR with USD, result < 1 human', function () {
      assert.strictEqual('100,000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply EUR with USD, neg human', function () {
      assert.strictEqual('-48,000,000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-24000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply EUR with USD, neg, <1 human', function () {
      assert.strictEqual('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0.1/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('-1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply EUR with STM, factor < 1 human', function () {
      assert.strictEqual('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('2000')).to_human_full());
    });
    it('Multiply EUR with STM, neg human', function () {
      assert.strictEqual('-500/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('5')).to_human_full());
    });
    it('Multiply EUR with STM, neg, <1 human', function () {
      assert.strictEqual('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').multiply(Amount.from_json('2000')).to_human_full());
    });
    it('Multiply STM with STM human', function () {
      assert.strictEqual('0.0001/STM', Amount.from_json('10').multiply(Amount.from_json('10')).to_human_full());
    });
    it('Divide STM by USD human', function () {
      assert.strictEqual('0.00002/STM', Amount.from_json('200').divide(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide STM by USD human', function () {
      assert.strictEqual('0.002/STM', Amount.from_json('20000').divide(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide STM by USD human', function () {
      assert.strictEqual('0.2/STM', Amount.from_json('2000000').divide(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide STM by USD, neg human', function () {
      assert.strictEqual('-0.00002/STM', Amount.from_json('200').divide(Amount.from_json('-10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide STM by USD, neg, frac human', function () {
      assert.strictEqual('-0.000162/STM', Amount.from_json('-6000').divide(Amount.from_json('37/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide USD by USD human', function () {
      assert.strictEqual('200/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide USD by USD, fractional human', function () {
      assert.strictEqual('57,142.85714285714/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('35/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide USD by USD human', function () {
      assert.strictEqual('20/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('100000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide EUR by USD, factor < 1 human', function () {
      assert.strictEqual('0.1/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide EUR by USD, neg human', function () {
      assert.strictEqual('-12/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-24000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide EUR by USD, neg, <1 human', function () {
      assert.strictEqual('-0.1/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('-1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Divide EUR by STM, result < 1 human', function () {
      assert.strictEqual('0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('2000')).to_human_full());
    });
    it('Divide EUR by STM, neg human', function () {
      assert.strictEqual('-20/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('5')).to_human_full());
    });
    it('Divide EUR by STM, neg, <1 human', function () {
      assert.strictEqual('-0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').divide(Amount.from_json('2000')).to_human_full());
    });
    it('Divide by zero should throw', function() {
      assert.throws(function() {
        Amount.from_json(1).divide(Amount.from_json(0));
      });
    });
    it('Divide zero by number', function() {
      assert.strictEqual('0', Amount.from_json(0).divide(Amount.from_json(1)).to_text());
    });
    it('Divide invalid by number', function() {
      assert.throws(function() {
        Amount.from_json('x').divide(Amount.from_json('1'));
      });
    });
    it('Divide number by invalid', function() {
      assert.throws(function() {
        Amount.from_json('1').divide(Amount.from_json('x'));
      });
    });
    it('amount.abs -1 == 1', function() {
      assert.strictEqual('1', Amount.from_json(-1).abs().to_text());
    });
    it('amount.copyTo native', function() {
      assert(isNaN(Amount.from_json('x').copyTo(new Amount())._value));
    });
    it('amount.copyTo zero', function() {
      assert(!(Amount.from_json(0).copyTo(new Amount())._is_negative))
    });
  });
  describe('Amount comparisons', function() {
    it('0 USD == 0 USD amount.equals string argument', function() {
      var a = '0/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9';
      assert(Amount.from_json(a).equals(a));
    });
    it('0 USD == 0 USD', function () {
      var a = Amount.from_json('0/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('0/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('0 USD == -0 USD', function () {
      var a = Amount.from_json('0/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('-0/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('0 STM == 0 STM', function () {
      var a = Amount.from_json('0');
      var b = Amount.from_json('0.0');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('0 STM == -0 STM', function () {
      var a = Amount.from_json('0');
      var b = Amount.from_json('-0');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('10 USD == 10 USD', function () {
      var a = Amount.from_json('10/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('10/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('123.4567 USD == 123.4567 USD', function () {
      var a = Amount.from_json('123.4567/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('123.4567/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('10 STM == 10 STM', function () {
      var a = Amount.from_json('10');
      var b = Amount.from_json('10');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('1.1 STM == 1.1 STM', function () {
      var a = Amount.from_json('1.1');
      var b = Amount.from_json('11.0').ratio_human(10);
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('0 USD == 0 USD (ignore issuer)', function () {
      var a = Amount.from_json('0/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('0/USD/vHFFxZj7B4NH6XyFZHRLTW9UdRRgWfoYap');
      assert(a.equals(b, true));
      assert(!a.not_equals_why(b, true));
    });
    it('1.1 USD == 1.10 USD (ignore issuer)', function () {
      var a = Amount.from_json('1.1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('1.10/USD/vHFFxZj7B4NH6XyFZHRLTW9UdRRgWfoYap');
      assert(a.equals(b, true));
      assert(!a.not_equals_why(b, true));
    });
    // Exponent mismatch
    it('10 USD != 100 USD', function () {
      var a = Amount.from_json('10/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('100/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-STM value differs.');
    });
    it('10 STM != 100 STM', function () {
      var a = Amount.from_json('10');
      var b = Amount.from_json('100');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'STM value differs.');
    });
    // Mantissa mismatch
    it('1 USD != 2 USD', function () {
      var a = Amount.from_json('1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('2/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-STM value differs.');
    });
    it('1 STM != 2 STM', function () {
      var a = Amount.from_json('1');
      var b = Amount.from_json('2');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'STM value differs.');
    });
    it('0.1 USD != 0.2 USD', function () {
      var a = Amount.from_json('0.1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('0.2/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-STM value differs.');
    });
    // Sign mismatch
    it('1 USD != -1 USD', function () {
      var a = Amount.from_json('1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('-1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-STM sign differs.');
    });
    it('1 STM != -1 STM', function () {
      var a = Amount.from_json('1');
      var b = Amount.from_json('-1');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'STM sign differs.');
    });
    it('1 USD != 1 USD (issuer mismatch)', function () {
      var a = Amount.from_json('1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('1/USD/vHFFxZj7B4NH6XyFZHRLTW9UdRRgWfoYap');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-STM issuer differs: vHFFxZj7B4NH6XyFZHRLTW9UdRRgWfoYap/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
    });
    it('1 USD != 1 EUR', function () {
      var a = Amount.from_json('1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('1/EUR/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-STM currency differs.');
    });
    it('1 USD != 1 STM', function () {
      var a = Amount.from_json('1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      var b = Amount.from_json('1');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Native mismatch.');
    });
    it('1 STM != 1 USD', function () {
      var a = Amount.from_json('1');
      var b = Amount.from_json('1/USD/v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Native mismatch.');
    });
  });

  describe('product_human', function() {
    it('Multiply 0 STM with 0 STM', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').product_human(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 0 USD with 0 STM', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 0 STM with 0 USD', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').product_human(Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply 1 STM with 0 STM', function () {
      assert.strictEqual('0/STM', Amount.from_json('1').product_human(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 1 USD with 0 STM', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 1 STM with 0 USD', function () {
      assert.strictEqual('0/STM', Amount.from_json('1').product_human(Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply 0 STM with 1 STM', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').product_human(Amount.from_json('1')).to_text_full());
    });
    it('Multiply 0 USD with 1 STM', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('1')).to_text_full());
    });
    it('Multiply 0 STM with 1 USD', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').product_human(Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD', function () {
      assert.equal('0.002/STM', Amount.from_json('200').product_human(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD', function () {
      assert.strictEqual('0.2/STM', Amount.from_json('20000').product_human(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD', function () {
      assert.strictEqual('20/STM', Amount.from_json('2000000').product_human(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD, neg', function () {
      assert.strictEqual('-0.002/STM', Amount.from_json('200').product_human(Amount.from_json('-10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply STM with USD, neg, frac', function () {
      assert.strictEqual('-0.222/STM', Amount.from_json('-6000').product_human(Amount.from_json('37/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply USD with USD', function () {
      assert.strictEqual('20000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply USD with USD', function () {
      assert.strictEqual('200000000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('100000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply EUR with USD, result < 1', function () {
      assert.strictEqual('100000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full());
    });
    it('Multiply EUR with USD, neg', function () {
      assert.strictEqual(Amount.from_json('-24000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full(), '-48000000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply EUR with USD, neg, <1', function () {
      assert.strictEqual(Amount.from_json('0.1/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('-1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_text_full(), '-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply EUR with STM, factor < 1', function () {
      assert.strictEqual(Amount.from_json('0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('2000')).to_text_full(), '0.0001/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply EUR with STM, neg', function () {
      assert.strictEqual(Amount.from_json('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('5')).to_text_full(), '-0.0005/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply EUR with STM, neg, <1', function () {
      assert.strictEqual(Amount.from_json('-0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('2000')).to_text_full(), '-0.0001/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply STM with STM', function () {
      assert.strictEqual(Amount.from_json('10000000').product_human(Amount.from_json('10')).to_text_full(), '0.0001/STM');
    });
    it('Multiply USD with XAU (dem)', function () {
      assert.strictEqual(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('10/015841551A748AD2C1F76FF6ECB0CCCD00000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD'), {reference_date: 443845330 + 31535000}).to_text_full(), '19900.00316303882/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply 0 STM with 0 STM human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').product_human(Amount.from_json('0')).to_human_full());
    });
    it('Multiply 0 USD with 0 STM human', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('0')).to_human_full());
    });
    it('Multiply 0 STM with 0 USD human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').product_human(Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply 1 STM with 0 STM human', function () {
      assert.strictEqual('0/STM', Amount.from_json('1').product_human(Amount.from_json('0')).to_human_full());
    });
    it('Multiply 1 USD with 0 STM human', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('0')).to_human_full());
    });
    it('Multiply 1 STM with 0 USD human', function () {
      assert.strictEqual('0/STM', Amount.from_json('1').product_human(Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply 0 STM with 1 STM human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').product_human(Amount.from_json('1')).to_human_full());
    });
    it('Multiply 0 USD with 1 STM human', function () {
      assert.strictEqual('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('0/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('1')).to_human_full());
    });
    it('Multiply 0 STM with 1 USD human', function () {
      assert.strictEqual('0/STM', Amount.from_json('0').product_human(Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD human', function () {
      assert.equal('0.002/STM', Amount.from_json('200').product_human(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD human', function () {
      assert.strictEqual('0.2/STM', Amount.from_json('20000').product_human(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD human', function () {
      assert.strictEqual('20/STM', Amount.from_json('2000000').product_human(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD, neg human', function () {
      assert.strictEqual('-0.002/STM', Amount.from_json('200').product_human(Amount.from_json('-10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply STM with USD, neg, frac human', function () {
      assert.strictEqual('-0.222/STM', Amount.from_json('-6000').product_human(Amount.from_json('37/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply USD with USD human', function () {
      assert.strictEqual('20,000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('10/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply USD with USD human', function () {
      assert.strictEqual('200,000,000,000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('2000000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('100000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply EUR with USD, result < 1 human', function () {
      assert.strictEqual('100,000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD', Amount.from_json('100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full());
    });
    it('Multiply EUR with USD, neg human', function () {
      assert.strictEqual(Amount.from_json('-24000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full(), '-48,000,000/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply EUR with USD, neg, <1 human', function () {
      assert.strictEqual(Amount.from_json('0.1/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('-1000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD')).to_human_full(), '-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply EUR with STM, factor < 1 human', function () {
      assert.strictEqual(Amount.from_json('0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('2000')).to_human_full(), '0.0001/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply EUR with STM, neg human', function () {
      assert.strictEqual(Amount.from_json('-100/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('5')).to_human_full(), '-0.0005/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply EUR with STM, neg, <1 human', function () {
      assert.strictEqual(Amount.from_json('-0.05/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('2000')).to_human_full(), '-0.0001/EUR/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Multiply STM with STM human', function () {
      assert.strictEqual(Amount.from_json('10000000').product_human(Amount.from_json('10')).to_human_full(), '0.0001/STM');
    });
    it('Multiply USD with XAU (dem) human', function () {
      assert.strictEqual(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').product_human(Amount.from_json('10/015841551A748AD2C1F76FF6ECB0CCCD00000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD'), {reference_date: 443845330 + 31535000}).to_human_full(), '19,900.00316303882/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
  });

  describe('ratio_human', function() {
    it('Divide USD by XAU (dem)', function () {
      assert.strictEqual(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').ratio_human(Amount.from_json('10/015841551A748AD2C1F76FF6ECB0CCCD00000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD'), {reference_date: 443845330 + 31535000}).to_text_full(), '201.0049931765529/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Divide USD by XAU (dem) human', function () {
      assert.strictEqual(Amount.from_json('2000/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').ratio_human(Amount.from_json('10/015841551A748AD2C1F76FF6ECB0CCCD00000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD'), {reference_date: 443845330 + 31535000}).to_human_full(), '201.0049931765529/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
  });

  describe('_invert', function() {
    it('Invert 1', function () {
      assert.strictEqual(Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').invert().to_text_full(), '1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Invert 20', function () {
      assert.strictEqual(Amount.from_json('20/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').invert().to_text_full(), '0.05/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Invert 0.02', function () {
      assert.strictEqual(Amount.from_json('0.02/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').invert().to_text_full(), '50/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Invert 1 human', function () {
      assert.strictEqual(Amount.from_json('1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').invert().to_human_full(), '1/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Invert 20 human', function () {
      assert.strictEqual(Amount.from_json('20/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').invert().to_human_full(), '0.05/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it('Invert 0.02 human', function () {
      assert.strictEqual(Amount.from_json('0.02/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD').invert().to_human_full(), '50/USD/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
  });

  describe('from_quality', function() {
    it('BTC/STM', function () {
      assert.strictEqual(Amount.from_quality('7B73A610A009249B0CC0D4311E8BA7927B5A34D86634581C5F0FF9FF678E1000', 'STM', NaN, {base_currency: 'BTC'}).to_text_full(), '44,970/STM');
    });
    it('BTC/STM inverse', function () {
      assert.strictEqual(Amount.from_quality('37AAC93D336021AE94310D0430FFA090F7137C97D473488C4A0918D0DEF8624E', 'STM', NaN, {inverse: true, base_currency: 'BTC'}).to_text_full(), '39,053.954453/STM');
    });
    it('STM/USD', function () {
      assert.strictEqual(Amount.from_quality('DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4D05DCAA8FE12000', 'USD', 'vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M', {base_currency: 'STM'}).to_text_full(), '0.0165/USD/vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M');
    });
    it('STM/USD inverse', function () {
      assert.strictEqual(Amount.from_quality('4627DFFCFF8B5A265EDBD8AE8C14A52325DBFEDAF4F5C32E5C22A840E27DCA9B', 'USD', 'vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M', {inverse: true, base_currency: 'STM'}).to_text_full(), '0.010251/USD/vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M');
    });
    it('BTC/USD', function () {
      assert.strictEqual(Amount.from_quality('6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC9858038D7EA4C68000', 'USD', 'vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M', {base_currency: 'BTC'}).to_text_full(), '1000/USD/vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M');
    });
    it('BTC/USD inverse', function () {
      assert.strictEqual(Amount.from_quality('20294C923E80A51B487EB9547B3835FD483748B170D2D0A455071AFD498D0000', 'USD', 'vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M', {inverse: true, base_currency: 'BTC'}).to_text_full(), '0.5/USD/vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M');
    });
    it('XAU(dem)/STM', function () {
      assert.strictEqual(Amount.from_quality('587322CCBDE0ABD01704769A73A077C32FB39057D813D4165F1FF973CAF997EF', 'STM', NaN, {base_currency: '015841551A748AD2C1F76FF6ECB0CCCD00000000', reference_date: 443845330 + 31535000}).to_text_full(), '90,452.246928/STM');
    });
    it('XAU(dem)/STM inverse', function () {
      assert.strictEqual(Amount.from_quality('F72C7A9EAE4A45ED1FB547AD037D07B9B965C6E662BEBAFA4A03F2A976804235', 'STM', NaN, {inverse: true, base_currency: '015841551A748AD2C1F76FF6ECB0CCCD00000000', reference_date: 443845330 + 31535000}).to_text_full(), '90,442.196677/STM');
    });
    it('USD/XAU(dem)', function () {
      assert.strictEqual(Amount.from_quality('4743E58E44974B325D42FD2BB683A6E36950F350EE46DD3A521B644B99782F5F', '015841551A748AD2C1F76FF6ECB0CCCD00000000', 'vHoAAsDHZKJy22wAgvX4YoF2Amcok3H6wM', {base_currency: 'USD', reference_date: 443845330 + 31535000}).to_text_full(), '0.007710100231303007/XAU (-0.5%pa)/vHoAAsDHZKJy22wAgvX4YoF2Amcok3H6wM');
    });
    it('USD/XAU(dem) inverse', function () {
      assert.strictEqual(Amount.from_quality('CDFD3AFB2F8C5DBEF75B081F7C957FF5509563266F28F36C5704A0FB0BAD8800', '015841551A748AD2C1F76FF6ECB0CCCD00000000', 'vHoAAsDHZKJy22wAgvX4YoF2Amcok3H6wM', {inverse: true, base_currency: 'USD', reference_date: 443845330 + 31535000}).to_text_full(), '0.007675186123263489/XAU (-0.5%pa)/vHoAAsDHZKJy22wAgvX4YoF2Amcok3H6wM');
    });
    it('BTC/STM human', function () {
      assert.strictEqual(Amount.from_quality('7B73A610A009249B0CC0D4311E8BA7927B5A34D86634581C5F0FF9FF678E1000', 'STM', NaN, {base_currency: 'BTC'}).to_human_full(), '44,970/STM');
    });
    it('BTC/STM inverse human', function () {
      assert.strictEqual(Amount.from_quality('37AAC93D336021AE94310D0430FFA090F7137C97D473488C4A0918D0DEF8624E', 'STM', NaN, {inverse: true, base_currency: 'BTC'}).to_human_full(), '39,053.954453/STM');
    });
    it('STM/USD human', function () {
      assert.strictEqual(Amount.from_quality('DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4D05DCAA8FE12000', 'USD', 'vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M', {base_currency: 'STM'}).to_human_full(), '0.0165/USD/vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M');
    });
    it('STM/USD inverse human', function () {
      assert.strictEqual(Amount.from_quality('4627DFFCFF8B5A265EDBD8AE8C14A52325DBFEDAF4F5C32E5C22A840E27DCA9B', 'USD', 'vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M', {inverse: true, base_currency: 'STM'}).to_human_full(), '0.010251/USD/vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M');
    });
    it('BTC/USD human', function () {
      assert.strictEqual(Amount.from_quality('6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC9858038D7EA4C68000', 'USD', 'vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M', {base_currency: 'BTC'}).to_human_full(), '1,000/USD/vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M');
    });
    it('BTC/USD inverse human', function () {
      assert.strictEqual(Amount.from_quality('20294C923E80A51B487EB9547B3835FD483748B170D2D0A455071AFD498D0000', 'USD', 'vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M', {inverse: true, base_currency: 'BTC'}).to_human_full(), '0.5/USD/vLkREfYNVHbQCGdbhiUszRoV9QJR4wS8M');
    });
    it('XAU(dem)/STM human', function () {
      assert.strictEqual(Amount.from_quality('587322CCBDE0ABD01704769A73A077C32FB39057D813D4165F1FF973CAF997EF', 'STM', NaN, {base_currency: '015841551A748AD2C1F76FF6ECB0CCCD00000000', reference_date: 443845330 + 31535000}).to_human_full(), '90,452.246928/STM');
    });
    it('XAU(dem)/STM inverse human', function () {
      assert.strictEqual(Amount.from_quality('F72C7A9EAE4A45ED1FB547AD037D07B9B965C6E662BEBAFA4A03F2A976804235', 'STM', NaN, {inverse: true, base_currency: '015841551A748AD2C1F76FF6ECB0CCCD00000000', reference_date: 443845330 + 31535000}).to_human_full(), '90,442.196677/STM');
    });
    it('USD/XAU(dem) human', function () {
      assert.strictEqual(Amount.from_quality('4743E58E44974B325D42FD2BB683A6E36950F350EE46DD3A521B644B99782F5F', '015841551A748AD2C1F76FF6ECB0CCCD00000000', 'vHoAAsDHZKJy22wAgvX4YoF2Amcok3H6wM', {base_currency: 'USD', reference_date: 443845330 + 31535000}).to_human_full(), '0.007710100231303007/XAU (-0.5%pa)/vHoAAsDHZKJy22wAgvX4YoF2Amcok3H6wM');
    });
    it('USD/XAU(dem) inverse human', function () {
      assert.strictEqual(Amount.from_quality('CDFD3AFB2F8C5DBEF75B081F7C957FF5509563266F28F36C5704A0FB0BAD8800', '015841551A748AD2C1F76FF6ECB0CCCD00000000', 'vHoAAsDHZKJy22wAgvX4YoF2Amcok3H6wM', {inverse: true, base_currency: 'USD', reference_date: 443845330 + 31535000}).to_human_full(), '0.007675186123263489/XAU (-0.5%pa)/vHoAAsDHZKJy22wAgvX4YoF2Amcok3H6wM');
    });
  });

  describe('apply interest', function() {
    it ('from_json apply interest 10 XAU', function() {
      var demAmount = Amount.from_json('10/0158415500000000C1F76FF6ECB0BAC600000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
      assert.strictEqual(demAmount.to_text_full(), '10/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
      demAmount = demAmount.applyInterest(459990264);
      assert.strictEqual(demAmount.to_text_full(), '9.294949401870435/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');

    });
    it ('from_json apply interest XAU', function() {
      var demAmount = Amount.from_json('1235.5/0158415500000000C1F76FF6ECB0BAC600000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
      assert.strictEqual(demAmount.to_text_full(), '1235.5/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
      demAmount = demAmount.applyInterest(459990264);
      assert.strictEqual(demAmount.to_text_full(), '1148.390998601092/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it ('from_human with reference date', function() {
      var demAmount = Amount.from_human('10 0158415500000000C1F76FF6ECB0BAC600000000', {reference_date:459990264});
      demAmount.set_issuer("v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD");
      assert.strictEqual(demAmount.to_text_full(), '10.75853086191915/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it ('from_json apply interest 10 XAU human', function() {
      var demAmount = Amount.from_json('10/0158415500000000C1F76FF6ECB0BAC600000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
      assert.strictEqual(demAmount.to_human_full(), '10/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
      demAmount = demAmount.applyInterest(459990264);
      assert.strictEqual(demAmount.to_human_full(), '9.294949401870435/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');

    });
    it ('from_json apply interest XAU human', function() {
      var demAmount = Amount.from_json('1235.5/0158415500000000C1F76FF6ECB0BAC600000000/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
      assert.strictEqual(demAmount.to_human_full(), '1,235.5/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
      demAmount = demAmount.applyInterest(459990264);
      assert.strictEqual(demAmount.to_human_full(), '1,148.390998601092/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
    it ('from_human with reference date human', function() {
      var demAmount = Amount.from_human('10 0158415500000000C1F76FF6ECB0BAC600000000', {reference_date:459990264});
      demAmount.set_issuer("v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD");
      assert.strictEqual(demAmount.to_human_full(), '10.75853086191915/XAU (-0.5%pa)/v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD');
    });
  });
});
