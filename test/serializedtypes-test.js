var utils            = require('./testutils');
var assert           = require('assert');
var SerializedObject = utils.load_module('serializedobject').SerializedObject;
var types            = utils.load_module('serializedtypes');
var amountConstants  = require('../src/js/stream/amount').consts;
var BigInteger       = require('../src/js/jsbn/jsbn').BigInteger;

var config = require('./testutils').get_config();

describe('Serialized types', function() {
  describe('Int8', function() {
    it('Serialize 0', function () {
      var so = new SerializedObject();
      types.Int8.serialize(so, 0);
      assert.strictEqual(so.to_hex(), '00');
    });
    it('Serialize 123', function () {
      var so = new SerializedObject();
      types.Int8.serialize(so, 123);
      assert.strictEqual(so.to_hex(), '7B');
    });
    it('Serialize 255', function () {
      var so = new SerializedObject();
      types.Int8.serialize(so, 255);
      assert.strictEqual(so.to_hex(), 'FF');
    });
    it('Fail to serialize 256', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int8.serialize(so, 256);
      });
    });
    it('Fail to serialize -1', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int8.serialize(so, -1);
      });
    });
    it('Serialize 5.5 (should floor)', function () {
      var so = new SerializedObject();
      types.Int8.serialize(so, 5.5);
      assert.strictEqual(so.to_hex(), '05');
    });
    it('Serialize 255.9 (should floor)', function () {
      var so = new SerializedObject();
      types.Int8.serialize(so, 255.9);
      assert.strictEqual(so.to_hex(), 'FF');
    });
    it('Fail to serialize null', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int8.serialize(so, null);
      });
    });
    it('Fail to serialize "bla"', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int8.serialize(so, 'bla');
      });
    });
    it('Fail to serialize {}', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int8.serialize(so, {});
      });
    });
  });

  describe('Int16', function() {
    it('Serialize 0', function () {
      var so = new SerializedObject();
      types.Int16.serialize(so, 0);
      assert.strictEqual(so.to_hex(), '0000');
    });
    it('Serialize 123', function () {
      var so = new SerializedObject();
      types.Int16.serialize(so, 123);
      assert.strictEqual(so.to_hex(), '007B');
    });
    it('Serialize 255', function () {
      var so = new SerializedObject();
      types.Int16.serialize(so, 255);
      assert.strictEqual(so.to_hex(), '00FF');
    });
    it('Serialize 256', function () {
      var so = new SerializedObject();
      types.Int16.serialize(so, 256);
      assert.strictEqual(so.to_hex(), '0100');
    });
    it('Serialize 65535', function () {
      var so = new SerializedObject();
      types.Int16.serialize(so, 65535);
      assert.strictEqual(so.to_hex(), 'FFFF');
    });
    it('Fail to serialize 65536', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int8.serialize(so, 65536);
      });
    });
    it('Fail to serialize -1', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int16.serialize(so, -1);
      });
    });
    it('Serialize 123.5 (should floor)', function () {
      var so = new SerializedObject();
      types.Int16.serialize(so, 123.5);
      assert.strictEqual(so.to_hex(), '007B');
    });
    it('Serialize 65535.5 (should floor)', function () {
      var so = new SerializedObject();
      types.Int16.serialize(so, 65535.5);
      assert.strictEqual(so.to_hex(), 'FFFF');
    });
    it('Fail to serialize null', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int16.serialize(so, null);
      });
    });
    it('Fail to serialize "bla"', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int16.serialize(so, 'bla');
      });
    });
    it('Fail to serialize {}', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int16.serialize(so, {});
      });
    });
  });

  describe('Int32', function() {
    it('Serialize 0', function () {
      var so = new SerializedObject();
      types.Int32.serialize(so, 0);
      assert.strictEqual(so.to_hex(), '00000000');
    });
    it('Serialize 123', function () {
      var so = new SerializedObject();
      types.Int32.serialize(so, 123);
      assert.strictEqual(so.to_hex(), '0000007B');
    });
    it('Serialize 255', function () {
      var so = new SerializedObject();
      types.Int32.serialize(so, 255);
      assert.strictEqual(so.to_hex(), '000000FF');
    });
    it('Serialize 256', function () {
      var so = new SerializedObject();
      types.Int32.serialize(so, 256);
      assert.strictEqual(so.to_hex(), '00000100');
    });
    it('Serialize 0xF0F0F0F0', function () {
      var so = new SerializedObject();
      types.Int32.serialize(so, 0xF0F0F0F0);
      assert.strictEqual(so.to_hex(), 'F0F0F0F0');
    });
    it('Serialize 0xFFFFFFFF', function () {
      var so = new SerializedObject();
      types.Int32.serialize(so, 0xFFFFFFFF);
      assert.strictEqual(so.to_hex(), 'FFFFFFFF');
    });
    it('Fail to serialize 0x100000000', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int8.serialize(so, 0x100000000);
      });
    });
    it('Fail to serialize -1', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int32.serialize(so, -1);
      });
    });
    it('Serialize 123.5 (should floor)', function () {
      var so = new SerializedObject();
      types.Int32.serialize(so, 123.5);
      assert.strictEqual(so.to_hex(), '0000007B');
    });
    it('Serialize 4294967295.5 (should floor)', function () {
      var so = new SerializedObject();
      types.Int32.serialize(so, 4294967295.5);
      assert.strictEqual(so.to_hex(), 'FFFFFFFF');
    });
    it('Fail to serialize null', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int32.serialize(so, null);
      });
    });
    it('Fail to serialize "bla"', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int32.serialize(so, 'bla');
      });
    });
    it('Fail to serialize {}', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int32.serialize(so, {});
      });
    });
    it('Parse 0', function () {
      var val = '00000000';
      var so = new SerializedObject(val);
      var num = types.Int32.parse(so);
      assert.strictEqual(num, parseInt(val, 16));
    });
    it('Parse 1', function () {
      var val = '00000001';
      var so = new SerializedObject(val);
      var num = types.Int32.parse(so);
      assert.strictEqual(num, parseInt(val, 16));
    });
    it('Parse UINT32_MAX', function () {
      var val = 'FFFFFFFF';
      var so = new SerializedObject(val);
      var num = types.Int32.parse(so);
      assert.strictEqual(num, parseInt(val, 16));
    });
  });

  describe('Int64', function() {
    it('Serialize 0', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 0);
      assert.strictEqual(so.to_hex(), '0000000000000000');
    });
    it('Serialize 123', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 123);
      assert.strictEqual(so.to_hex(), '000000000000007B');
    });
    it('Serialize 255', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 255);
      assert.strictEqual(so.to_hex(), '00000000000000FF');
    });
    it('Serialize 256', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 256);
      assert.strictEqual(so.to_hex(), '0000000000000100');
    });
    it('Serialize 0xF0F0F0F0', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 0xF0F0F0F0);
      assert.strictEqual(so.to_hex(), '00000000F0F0F0F0');
    });
    it('Serialize 0xFFFFFFFF', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 0xFFFFFFFF);
      assert.strictEqual(so.to_hex(), '00000000FFFFFFFF');
    });
    it('Serialize 0x100000000', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 0x100000000);
      assert.strictEqual(so.to_hex(), '0000000100000000');
    });
    it('Fail to serialize 0x100000000', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int8.serialize(so, 0x100000000);
      });
    });
    it('Fail to serialize -1', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int64.serialize(so, -1);
      });
    });
    it('Serialize 123.5 (should floor)', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 123.5);
      assert.strictEqual(so.to_hex(), '000000000000007B');
    });
    it('Serialize 4294967295.5 (should floor)', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 4294967295.5);
      assert.strictEqual(so.to_hex(), '00000000FFFFFFFF');
    });
    it('Does not get confused when the high bit is set', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, "8B2386F26F8E232B");
      assert.strictEqual(so.to_hex(), '8B2386F26F8E232B');
      var so = new SerializedObject("8B2386F26F8E232B");
      var num = types.Int64.parse(so);
      // We get a positive number
      assert.strictEqual(num.toString(16), '8b2386f26f8e232b');
    });
    it('Serialize "0123456789ABCDEF"', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, '0123456789ABCDEF');
      assert.strictEqual(so.to_hex(), '0123456789ABCDEF');
    });
    it('Serialize "F0E1D2C3B4A59687"', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, 'F0E1D2C3B4A59687');
      assert.strictEqual(so.to_hex(), 'F0E1D2C3B4A59687');
    });
    it('Serialize BigInteger("FFEEDDCCBBAA9988")', function () {
      var so = new SerializedObject();
      types.Int64.serialize(so, new BigInteger('FFEEDDCCBBAA9988', 16));
      assert.strictEqual(so.to_hex(), 'FFEEDDCCBBAA9988');
    });
    it('Fail to serialize BigInteger("-1")', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int64.serialize(so, new BigInteger('-1', 10));
      });
    });
    it('Fail to serialize "10000000000000000"', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int64.serialize(so, '10000000000000000');
      });
    });
    it('Fail to serialize "110000000000000000"', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int64.serialize(so, '110000000000000000');
      });
    });
    it('Fail to serialize null', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int64.serialize(so, null);
      });
    });
    it('Fail to serialize "bla"', function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int64.serialize(so, 'bla');
      });
    });
    it('Fail to serialize {}',  function () {
      var so = new SerializedObject();
      assert.throws(function () {
        types.Int64.serialize(so, {});
      });
    });
    it('Parse "0123456789ABCDEF"', function () {
      var so = new SerializedObject("0123456789ABCDEF");
      var num = types.Int64.parse(so);
      assert.strictEqual(num.toString(10), '81985529216486895');
    });
  });

  describe('Hash128', function() {
    it('Serialize 0', function () {
      var so = new SerializedObject();
      types.Hash128.serialize(so, '00000000000000000000000000000000');
      assert.strictEqual(so.to_hex(), '00000000000000000000000000000000');
    });
    it('Serialize 102030405060708090A0B0C0D0E0F000', function () {
      var so = new SerializedObject();
      types.Hash128.serialize(so, '102030405060708090A0B0C0D0E0F000');
      assert.strictEqual(so.to_hex(), '102030405060708090A0B0C0D0E0F000');
    });
    it('Serialize HASH128_MAX', function () {
      var so = new SerializedObject();
      types.Hash128.serialize(so, 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
      assert.strictEqual(so.to_hex(), 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    });
    it('Parse 0', function () {
      var val = '00000000000000000000000000000000';
      var so = new SerializedObject(val);
      var num = types.Hash128.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
    it('Parse 1', function () {
      var val = '00000000000000000000000000000001';
      var so = new SerializedObject(val);
      var num = types.Hash128.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
    it('Parse HASH128_MAX', function () {
      var val = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      var so = new SerializedObject(val);
      var num = types.Hash128.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
  });

  describe('Hash160', function() {
    it('Serialize 0', function () {
      var hex = '0000000000000000000000000000000000000000';
      var base58 = 'vvvvvvvvvvvvvvvvvvvvvhoLrTp';
      var so = new SerializedObject();
      types.Hash160.serialize(so, base58);
      assert.strictEqual(so.to_hex(), hex);

      so = new SerializedObject();
      types.Hash160.serialize(so, hex);
      assert.strictEqual(so.to_hex(), hex);
    });
    it('Serialize 1', function () {
      var hex = '0000000000000000000000000000000000000001';
      var base58 = 'vvvvvvvvvvvvvvvvvvvvBZbrji';
      var so = new SerializedObject();
      types.Hash160.serialize(so, base58);
      assert.strictEqual(so.to_hex(), hex);

      so = new SerializedObject();
      types.Hash160.serialize(so, hex);
      assert.strictEqual(so.to_hex(), hex);
    });
    it('Serialize FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', function () {
      var hex = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      var base58 = 'vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi';
      var so = new SerializedObject();
      types.Hash160.serialize(so, base58);
      assert.strictEqual(so.to_hex(), hex);

      so = new SerializedObject();
      types.Hash160.serialize(so, hex);
      assert.strictEqual(so.to_hex(), hex);
    });
    it('Parse 0', function () {
      var val = '0000000000000000000000000000000000000000';
      var so = new SerializedObject(val);
      var num = types.Hash160.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
    it('Parse 1', function () {
      var val = '0000000000000000000000000000000000000001';
      var so = new SerializedObject(val);
      var num = types.Hash160.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
    it('Parse HASH160_MAX', function () {
      var val = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      var so = new SerializedObject(val);
      var num = types.Hash160.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
    it('Parse 0 as JSON', function () {
      // Hash160 should be returned as hex in JSON, unlike
      // addresses.
      var val = '0000000000000000000000000000000000000000';
      var so = new SerializedObject(val);
      var num = types.Hash160.parse(so);
      assert.strictEqual(num.to_json(), val);
    });
  });

  describe('Hash256', function() {
    it('Serialize 0', function () {
      var so = new SerializedObject();
      types.Hash256.serialize(so, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.strictEqual(so.to_hex(), '0000000000000000000000000000000000000000000000000000000000000000');
    });
    it('Serialize 1', function () {
      var so = new SerializedObject();
      types.Hash256.serialize(so, '0000000000000000000000000000000000000000000000000000000000000001');
      assert.strictEqual(so.to_hex(), '0000000000000000000000000000000000000000000000000000000000000001');
    });
    it('Serialize HASH256_MAX', function () {
      var so = new SerializedObject();
      types.Hash256.serialize(so, 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
      assert.strictEqual(so.to_hex(), 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    });
    it('Parse 0', function () {
      var val = '0000000000000000000000000000000000000000000000000000000000000000';
      var so = new SerializedObject(val);
      var num = types.Hash256.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
    it('Parse 1', function () {
      var val = '0000000000000000000000000000000000000000000000000000000000000000';
      var so = new SerializedObject(val);
      var num = types.Hash256.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
    it('Parse HASH256_MAX', function () {
      var val = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      var so = new SerializedObject(val);
      var num = types.Hash256.parse(so);
      assert.strictEqual(num.to_hex(), val);
    });
  });

  describe('Amount', function() {
    it('Serialize 0 STM', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '0');
      assert.strictEqual(so.to_hex(), '4000000000000000');
    });
    it('Serialize 1 STM', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '1');
      assert.strictEqual(so.to_hex(), '4000000000000001');
    });
    it('Serialize -1 STM', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '-1');
      assert.strictEqual(so.to_hex(), '0000000000000001');
    });
    it('Serialize 213 STM', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '213');
      assert.strictEqual(so.to_hex(), '40000000000000D5');
    });
    it('Serialize 270544960 STM', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '270544960');
      assert.strictEqual(so.to_hex(), '4000000010203040');
    });
    it('Serialize 1161981756646125568 STM', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '1161981756646125696');
      assert.strictEqual(so.to_hex(), '5020304050607080');
    });
    it('Serialize 1/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '1/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh');
      assert.strictEqual(so.to_hex(), 'D4838D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E8');
    });
    it('Serialize 87654321.12345678/EUR/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '87654321.12345678/EUR/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh');
      assert.strictEqual(so.to_hex(), 'D65F241D335BF24E0000000000000000000000004555520000000000B5F762798A53D543A014CAF8B297CFF8F2F937E8');
    });
    it('Serialize -1/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, '-1/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh');
      assert.strictEqual(so.to_hex(), '94838D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E8');
    });
    it('Serialize 15/STM/vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi', function () {
      // This actually appears in the ledger, so we need to be able to serialize
      // Transaction #A2AD66C93C7B7277CD5AEB718A4E82D88C7099129948BC66A394EE38B34657A9
      var so = new SerializedObject();
      types.Amount.serialize(so, {
        "value":"1000",
        "currency":"STM",
        "issuer":"vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi"
      });
      assert.strictEqual(so.to_hex(), 'D5438D7EA4C6800000000000000000000000000053544D0000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    });
    // Test support for 20-byte hex raw currency codes
    it('Serialize 15/015841551A748AD23FEFFFFFFFEA028000000000/1', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, {
        "value":"1000",
        "currency":"015841551A748AD23FEFFFFFFFEA028000000000",
        "issuer":"vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi"
      });
      assert.strictEqual(so.to_hex(), 'D5438D7EA4C68000015841551A748AD23FEFFFFFFFEA028000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    });
    it('Serialize max_value/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh', function () {
      var so = new SerializedObject();
      types.Amount.serialize(so, amountConstants.max_value+'/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh');
      assert.strictEqual(so.to_hex(), 'EC6386F26FC0FFFF0000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E8');
    });
    it('Parse 1 STM', function () {
      var so = new SerializedObject('4000000000000001');
      assert.strictEqual(types.Amount.parse(so).to_json(), '1');
    });
    it('Parse -1 STM', function () {
      var so = new SerializedObject('0000000000000001');
      assert.strictEqual(types.Amount.parse(so).to_json(), '-1');
    });
    it('Parse 213 STM', function () {
      var so = new SerializedObject('40000000000000D5');
      assert.strictEqual(types.Amount.parse(so).to_json(), '213');
    });
    it('Parse 270544960 STM', function () {
      var so = new SerializedObject('4000000010203040');
      assert.strictEqual(types.Amount.parse(so).to_json(), '270544960');
    });
    it('Parse 1161981756646125568 STM', function () {
      var so = new SerializedObject('5020304050607080');
      assert.strictEqual(types.Amount.parse(so).to_json(), '1161981756646125696');
    });
    it('Parse 1/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh', function () {
      var so = new SerializedObject('D4838D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E8');
      assert.strictEqual(types.Amount.parse(so).to_text_full(), '1/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh');
    });
    it('Parse 87654321.12345678/EUR/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh', function () {
      var so = new SerializedObject('D65F241D335BF24E0000000000000000000000004555520000000000B5F762798A53D543A014CAF8B297CFF8F2F937E8');
      assert.strictEqual(types.Amount.parse(so).to_text_full(), '87654321.12345678/EUR/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh');
    });
    it('Parse -1/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh', function () {
      var so = new SerializedObject('94838D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E8');
      assert.strictEqual(types.Amount.parse(so).to_text_full(), '-1/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh');
    });
    it('Parse max_value/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh', function () {
      var so = new SerializedObject('EC6386F26FC0FFFF0000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E8');
      assert.strictEqual(types.Amount.parse(so).to_text_full(), amountConstants.max_value+'/USD/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh');
    });
  });

  describe('Account', function() {
    it('Serialize 0', function () {
      var hex = '0000000000000000000000000000000000000000';
      var base58 = 'vvvvvvvvvvvvvvvvvvvvvhoLrTp';
      var so = new SerializedObject();
      types.Account.serialize(so, base58);
      assert.strictEqual(so.to_hex(), "14"+hex);

      so = new SerializedObject();
      types.Account.serialize(so, hex);
      assert.strictEqual(so.to_hex(), "14"+hex);
    });
    it('Serialize 1', function () {
      var hex = '0000000000000000000000000000000000000001';
      var base58 = 'vvvvvvvvvvvvvvvvvvvvBZbrji';
      var so = new SerializedObject();
      types.Account.serialize(so, base58);
      assert.strictEqual(so.to_hex(), "14"+hex);

      so = new SerializedObject();
      types.Account.serialize(so, hex);
      assert.strictEqual(so.to_hex(), "14"+hex);
    });
    it('Serialize FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', function () {
      var hex = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      var base58 = 'vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi';
      var so = new SerializedObject();
      types.Account.serialize(so, base58);
      assert.strictEqual(so.to_hex(), "14"+hex);

      so = new SerializedObject();
      types.Account.serialize(so, hex);
      assert.strictEqual(so.to_hex(), "14"+hex);
    });
    it('Parse 0', function () {
      var val = '140000000000000000000000000000000000000000';
      var so = new SerializedObject(val);
      var num = types.Account.parse(so);
      assert.strictEqual(num.to_json(), 'vvvvvvvvvvvvvvvvvvvvvhoLrTp');
    });
    it('Parse 1', function () {
      var val = '140000000000000000000000000000000000000001';
      var so = new SerializedObject(val);
      var num = types.Account.parse(so);
      assert.strictEqual(num.to_json(), 'vvvvvvvvvvvvvvvvvvvvBZbrji');
    });
    it('Parse HASH160_MAX', function () {
      var val = '14FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      var so = new SerializedObject(val);
      var num = types.Account.parse(so);
      assert.strictEqual(num.to_json(), 'vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi');
    });
  });

  describe('PathSet', function() {
    it('Serialize single empty path [[]]', function () {
      var so = new SerializedObject();
      types.PathSet.serialize(so, [[]]);
      assert.strictEqual(so.to_hex(), '00');
    });
    it('Serialize [[e],[e,e]]', function () {
      var so = new SerializedObject();
      types.PathSet.serialize(so, [[ {
        account:   123,
        currency:  'USD',
        issuer:    789
      }],
      [{
        account:   123,
        currency:  'BTC',
        issuer:    789
      },
      {
        account:   987,
        currency:  'EUR',
        issuer:    321
      }]]);
      assert.strictEqual(so.to_hex(), '31000000000000000000000000000000000000007B00000000000000000000000055534400000000000000000000000000000000000000000000000315FF31000000000000000000000000000000000000007B000000000000000000000000425443000000000000000000000000000000000000000000000003153100000000000000000000000000000000000003DB0000000000000000000000004555520000000000000000000000000000000000000000000000014100'); //TODO: Check this independently
    });
    it('Serialize path through STM', function () {
      var hex = '31000000000000000000000000000000000000000200000000000000000000000055534400000000000000000000000000000000000000000000000003FF1000000000000000000000000000000000000000003100000000000000000000000000000000000000040000000000000000000000004555520000000000000000000000000000000000000000000000000500';
      var json = [
        [ {
          account:   "vvvvvvvvvvvvvvvvvvvvHeBwGj",
          currency:  'USD',
          issuer:    "vvvvvvvvvvvvvvvvvvvvQekEQA"
        }],
        [{
          currency: "STM"
        }, {
          account:   "vvvvvvvvvvvvvvvvvvvv7FYBiS",
          currency:  'EUR',
          issuer:    "vvvvvvvvvvvvvvvvvvvvgh65WR"
        }]
      ];

      var so = new SerializedObject();
      types.PathSet.serialize(so, json);
      assert.strictEqual(so.to_hex(), hex);

      so = new SerializedObject(hex);
      var parsed_path = SerializedObject.jsonify_structure(types.PathSet.parse(so));
      assert.deepEqual(parsed_path, json);
    });
    it('Serialize path through STM IOUs', function () {
      var hex = '31000000000000000000000000000000000000000200000000000000000000000055534400000000000000000000000000000000000000000000000003FF1000000000000000000000000053544D00000000003100000000000000000000000000000000000000040000000000000000000000004555520000000000000000000000000000000000000000000000000500';
      var json = [
        [ {
          account:   "vvvvvvvvvvvvvvvvvvvvHeBwGj",
          currency:  'USD',
          issuer:    "vvvvvvvvvvvvvvvvvvvvQekEQA"
        }],
        [{
          currency: "STM",
          non_native: true
        }, {
          account:   "vvvvvvvvvvvvvvvvvvvv7FYBiS",
          currency:  'EUR',
          issuer:    "vvvvvvvvvvvvvvvvvvvvgh65WR"
        }]
      ];

      var so = new SerializedObject();
      types.PathSet.serialize(so, json);
      assert.strictEqual(so.to_hex(), hex);

      so = new SerializedObject(hex);
      var parsed_path = SerializedObject.jsonify_structure(types.PathSet.parse(so));
      assert.deepEqual(parsed_path, json);
    });
    it('Serialize path through STM IOUs (realistic example)', function () {
      // Appears in the history
      // TX #0CBB429C456ED999CC691DFCC8E62E8C8C7E9522C2BEA967FED0D7E2A9B28D13
      // Note that STM IOUs are no longer allowed, so this functionality is
      // for historic transactions only.

      var hex = '315F78FDBE1B812E914EA267159BBBC8A78E40B38100000000000000000000000042544300000000005F78FDBE1B812E914EA267159BBBC8A78E40B38131FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0000000000000000000000004254430000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3169F1CEF849BDD7A7B7AC214A9EA941969AE76231000000000000000000000000425443000000000069F1CEF849BDD7A7B7AC214A9EA941969AE7623130000000000000000000000000555344000000000069F1CEF849BDD7A7B7AC214A9EA941969AE76231FF315F78FDBE1B812E914EA267159BBBC8A78E40B38100000000000000000000000042544300000000005F78FDBE1B812E914EA267159BBBC8A78E40B38131FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0000000000000000000000004254430000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF31E915CA69262E0FCCFC1898522E329C7F4B140B1B0000000000000000000000004254430000000000E915CA69262E0FCCFC1898522E329C7F4B140B1B30000000000000000000000000555344000000000069F1CEF849BDD7A7B7AC214A9EA941969AE76231FF315F78FDBE1B812E914EA267159BBBC8A78E40B38100000000000000000000000042544300000000005F78FDBE1B812E914EA267159BBBC8A78E40B381310EDB77E3D2E00BF694D9BC703E31AECD830ABF2200000000000000000000000042544300000000000EDB77E3D2E00BF694D9BC703E31AECD830ABF221000000000000000000000000053544D000000000030000000000000000000000000555344000000000069F1CEF849BDD7A7B7AC214A9EA941969AE7623100';
      var json = [
        [{
          "account": "v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V",
          "currency": "BTC",
          "issuer": "v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V"
        }, {
          "account": "vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi",
          "currency": "BTC",
          "issuer": "vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi"
        }, {
          "account": "vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr",
          "currency": "BTC",
          "issuer": "vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr"
        }, {
          "currency": "USD",
          "issuer": "vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr"
        }],
        [{
          "account": "v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V",
          "currency": "BTC",
          "issuer": "v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V"
        }, {
          "account": "vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi",
          "currency": "BTC",
          "issuer": "vQLbzfJH5BT1FS9apRLKV3G8dWEA5njaQi"
        }, {
          "account": "v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb",
          "currency": "BTC",
          "issuer": "v4ESYjqYri1kw9wzsF6oNZ3yWbe4o9oHZb"
        }, {
          "currency": "USD",
          "issuer": "vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr"
        }],
        [{
          "account": "v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V",
          "currency": "BTC",
          "issuer": "v96F3qes4tqCc1TCXrzeKnL7arKrwDXq5V"
        }, {
          "account": "vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq",
          "currency": "BTC",
          "issuer": "vpMZ4cVDTFgHDeLFw5xQco66o5QDcrBpeq"
        }, {
          "currency": "STM",
          "non_native": true
        }, {
          "currency": "USD",
          "issuer": "vwCBdHoQJhm35i39VCJLSDEwo11BcaQUjr"
        }]
      ];

      var so = new SerializedObject();
      types.PathSet.serialize(so, json);
      assert.strictEqual(so.to_hex(), hex);

      so = new SerializedObject(hex);
      var parsed_path = SerializedObject.jsonify_structure(types.PathSet.parse(so));
      assert.deepEqual(parsed_path, json);
    });
    it('Parse single empty path [[]]', function () {
      var so = new SerializedObject('00');
      var parsed_path = SerializedObject.jsonify_structure(types.PathSet.parse(so));
      assert.deepEqual(parsed_path, [[]]);
    });
    it('Parse [[e],[e,e]]', function () {
      var so = new SerializedObject('31000000000000000000000000000000000000000200000000000000000000000055534400000000000000000000000000000000000000000000000003FF310000000000000000000000000000000000000002000000000000000000000000425443000000000000000000000000000000000000000000000000033100000000000000000000000000000000000000040000000000000000000000004555520000000000000000000000000000000000000000000000000500');

      var parsed_path = types.PathSet.parse(so);
      var comp = [ [ { account: 'vvvvvvvvvvvvvvvvvvvvHeBwGj',
                       currency: 'USD',
                       issuer: 'vvvvvvvvvvvvvvvvvvvvQekEQA' } ],
                   [ { account: 'vvvvvvvvvvvvvvvvvvvvHeBwGj',
                       currency: 'BTC',
                       issuer: 'vvvvvvvvvvvvvvvvvvvvQekEQA' },
                     { account: 'vvvvvvvvvvvvvvvvvvvv7FYBiS',
                       currency: 'EUR',
                       issuer: 'vvvvvvvvvvvvvvvvvvvvgh65WR' } ] ];
      assert.deepEqual(SerializedObject.jsonify_structure(parsed_path, ""), comp);
    });
  });

  describe('Object', function() {
    it('Can parse objects with VL encoded Vector256', function() {
      var hex = '110064220000000058000360186E008422E06B72D5B275E29EE3BE9D87A370F424E0E7BF613C4659098214289D19799C892637306AAAF03805EDFCDF6C28B8011320081342A0AB45459A54D8E4FA1842339A102680216CF9A152BCE4F4CE467D8246';
      var so  = new SerializedObject(hex);
      var as_json = so.to_json();
      var expected_json = { 
        'LedgerEntryType': 'DirectoryNode',
        'Flags': 0,
        'RootIndex': '000360186E008422E06B72D5B275E29EE3BE9D87A370F424E0E7BF613C465909',
        'Owner': 'vh6kN9s7spSb3rdr6H8ZGYzsddSLeEUGmc',
        'Indexes':[ 
          '081342A0AB45459A54D8E4FA1842339A102680216CF9A152BCE4F4CE467D8246' 
        ] 
      };
      assert.deepEqual(as_json, expected_json);
      assert.strictEqual(SerializedObject.from_json(expected_json).to_hex(), hex)
    });
    it('Serialize empty object {}', function () {
      var so = new SerializedObject();
      types.Object.serialize(so, {});
      assert.strictEqual(so.to_hex(), 'E1');
    });
    it('Parse empty object {}', function () {
      var so = new SerializedObject('E1');
      var parsed_object = types.Object.parse(so)
      assert.deepEqual(parsed_object, { });
    });
    it('Serialize simple object {TakerPays:"87654321.12345678/EUR/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh", TakerGets:213, Fee:"789"}', function () {
      var so = new SerializedObject();
      types.Object.serialize(so, {
        TakerPays:  '87654321.12345678/EUR/vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh',
        TakerGets:  '213',
        Fee:        789
      });
      assert.strictEqual(so.to_hex(), '64D65F241D335BF24E0000000000000000000000004555520000000000B5F762798A53D543A014CAF8B297CFF8F2F937E86540000000000000D5684000000000000315E1');
      //TODO: Check independently.
    });
    it('Parse same object', function () {
      var so = new SerializedObject('64D65F241D335BF24E0000000000000000000000004555520000000000B5F762798A53D543A014CAF8B297CFF8F2F937E86540000000000000D5684000000000000315E1');
      var parsed_object=types.Object.parse(so);
	  var comp =  { TakerPays:
					   { value: '87654321.12345678',
						 currency: 'EUR',
						 issuer: 'vHb9CJAWyB4vj91VRWn96DkukG4bwdtyTh' },
					  TakerGets: '213',
					  Fee: '789' };
      assert.deepEqual(SerializedObject.jsonify_structure(parsed_object, ""), comp);
      //TODO: Check independently.
    });

    it('Serialize simple object {DestinationTag:123, QualityIn:456, QualityOut:789}', function () {
      var so = new SerializedObject();
      types.Object.serialize(so, {DestinationTag:123, QualityIn:456, QualityOut:789});
      assert.strictEqual(so.to_hex(), '2E0000007B2014000001C8201500000315E1');
      //TODO: Check independently.
    });
    it('Parse simple object {DestinationTag:123, QualityIn:456, QualityOut:789}', function () { //2E0000007B22000001C82400000315E1 2E0000007B2002000001C8200200000315E1
      var so = new SerializedObject('2E0000007B2014000001C8201500000315E1');
      var parsed_object=types.Object.parse(so);
      assert.deepEqual(parsed_object, { DestinationTag:123, QualityIn:456, QualityOut:789 });
      //TODO: Check independently.
    });
  });

  describe('Array', function() {
    it('Serialize empty array []', function () {
      var so = new SerializedObject();
      types.Array.serialize(so, []);
      assert.strictEqual(so.to_hex(), 'F1');
    });
    it('Parse empty array []', function () {
      var so = new SerializedObject('F1');
      var parsed_object=types.Array.parse(so);
      assert.deepEqual(parsed_object, []);
    });
    it('Serialize 3-length array [{TakerPays:123}); {TakerGets:456}, {Fee:789}]', function () {
      var so = new SerializedObject();
      types.Array.serialize(so, [{TakerPays:123}, {TakerGets:456}, {Fee:789}]);
      //TODO: Check this manually
      assert.strictEqual(so.to_hex(), '64400000000000007B6540000000000001C8684000000000000315F1');
    });
    it('Parse the same array', function () {
      var so = new SerializedObject('64400000000000007B6540000000000001C8684000000000000315F1');
      var parsed_object=types.Array.parse(so);
	  var comp = [ { TakerPays: '123' }, { TakerGets: '456' }, { Fee: '789' } ];
      assert.deepEqual(SerializedObject.jsonify_structure(parsed_object, ""), comp);
    });
    it('Serialize 3-length array [{DestinationTag:123}); {QualityIn:456}, {Fee:789}]', function () {
      var so = new SerializedObject();
      types.Array.serialize(so, [{DestinationTag:123}, {QualityIn:456}, {Fee:789}]);
      //TODO: Check this manually
      assert.strictEqual(so.to_hex(), '2E0000007B2014000001C8684000000000000315F1');
    });
    it('Parse the same array 2', function () {
      var so = new SerializedObject('2E0000007B2014000001C8684000000000000315F1');
      var parsed_object = types.Array.parse(so);
	  var comp = [ { DestinationTag: 123 }, { QualityIn: 456 }, { Fee: '789' } ];
      //TODO: Is this correct? Return some things as integers, and others as objects?
      assert.deepEqual( SerializedObject.jsonify_structure(parsed_object, ""), comp);
    });
  });
});

// vim:sw=2:sts=2:ts=8:et
