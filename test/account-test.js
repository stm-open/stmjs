var assert = require('assert');
var Account = require('../src/js/stream/account').Account;

describe('Account', function(){

  describe('#_publicKeyToAddress()', function(){

    it('should throw an error if the key is invalid', function(){
      try {
        Account._publicKeyToAddress('not a real key');
      } catch (e) {
        assert(e);
      }
    });

    it('should return unchanged a valid UINT160', function(){
      assert('vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd' === Account._publicKeyToAddress('vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd'));
    });

    it('should parse a hex-encoded public key as a UINT160', function(){
      assert('vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd' === Account._publicKeyToAddress('02cfb10fd5616017bc898f37857852cdd7769741f79121e5742e4ba9e5ccf0064a'));
    
      assert('vnfbgS1nag52xSZhi4Vt4kdWJJqrodG8qc' === Account._publicKeyToAddress('02249a0d51831b5144fe9ca5f9612dd0150b4b05f6b0262cd0ba064285e8c8384e'));
    
      assert('vHFFxZj7B4NH6XyFZHRLTW9UdRRgWfoYap' === Account._publicKeyToAddress('024b54354352ce8bac16a8bba022a63691e86ffc8b893012fdc3f0eecb2c2fbccf'));

      assert('v4q8oh5e1s9D5H4dZuUG4fk5DjU6c8S8hD' === Account._publicKeyToAddress('03772abd3a4f08310108cbf0ab8b4786cc800ea61a8edfdbc239d68c119d3e0e7c'));
    });

  });

  describe('#publicKeyIsActive()', function(){

    it('should respond true if the public key corresponds to the account address and the master key IS NOT disabled', function(){

      var account = new Account({
            on: function(){},
            request_account_info: function(address, callback) {
              if (address === 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd') {
                callback(null, { account_data: { 
                  Account: 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd',
                  Flags: 65536,
                  LedgerEntryType: 'AccountRoot'
                }});
              }
            }
          }, 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd');
      account.publicKeyIsActive('02cfb10fd5616017bc898f37857852cdd7769741f79121e5742e4ba9e5ccf0064a', function(err, is_valid){
        assert(err === null);
        assert(is_valid === true);
      });

    });

    it('should respond false if the public key corresponds to the account address and the master key IS disabled', function(){

      var account = new Account({
            on: function(){},
            request_account_info: function(address, callback) {
              if (address === 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd') {
                callback(null, { account_data: { 
                  Account: 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd',
                  Flags: parseInt(65536 | 0x00100000),
                  LedgerEntryType: 'AccountRoot'
                }});
              }
            }
          }, 'vKXCummUHnenhYudNb9UoJ4mGBR75vFcgz');
      account.publicKeyIsActive('02cfb10fd5616017bc898f37857852cdd7769741f79121e5742e4ba9e5ccf0064a', function(err, is_valid){
        assert(err === null);
        assert(is_valid === false);
      });

    });

    it('should respond true if the public key corresponds to the regular key', function(){

      var account = new Account({
            on: function(){},
            request_account_info: function(address, callback) {
              if (address === 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd') {
                callback(null, { account_data: { 
                  Account: 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd',
                  Flags: parseInt(65536 | 0x00100000),
                  LedgerEntryType: 'AccountRoot',
                  RegularKey: 'v1kqJfVSTWKEkog6tw7t1EBnUhMqx6RQ9'
                }});
              }
            }
          }, 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd');
      account.publicKeyIsActive('0372e50f40711dba97d337b459cf247ac84bdf5242d43ce1f1aa67ae94a1a19626', function(err, is_valid){
        assert(err === null);
        assert(is_valid === true);
      });

    });

    it('should respond false if the public key does not correspond to an active public key for the account', function(){

      var account = new Account({
            on: function(){},
            request_account_info: function(address, callback) {
              if (address === 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd') {
                callback(null, { account_data: { 
                  Account: 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd',
                  Flags: parseInt(65536 | 0x00100000),
                  LedgerEntryType: 'AccountRoot',
                  RegularKey: 'vNw4ozCG514KEjPs5cDrqEcdsi31Jtfm5r'
                }});
              }
            }
          }, 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd');
      account.publicKeyIsActive('02cfb10fd5616017bc898f37857852cdd7769741f79121e5742e4ba9e5ccf0064a', function(err, is_valid){
        assert(err === null);
        assert(is_valid === false);
      });

    });

    it('should respond false if the public key is invalid', function(){

      var account = new Account({
            on: function(){},
            request_account_info: function(address, callback) {
              if (address === 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd') {
                callback(null, { account_data: { 
                  Account: 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd',
                  Flags: parseInt(65536 | 0x00100000),
                  LedgerEntryType: 'AccountRoot',
                  RegularKey: 'vNw4ozCG514KEjPs5cDrqEcdsi31Jtfm5r'
                }});
              }
            }
          }, 'vBBc2hyGvXgUj5Cb7XRs4b6UEoahgRWGPd');
      account.publicKeyIsActive('not a real public key', function(err, is_valid){
        assert(err);
      });

    });

    it('should assume the master key is valid for unfunded accounts', function(){

      var account = new Account({
            on: function(){},
            request_account_info: function(address, callback) {
              if (address === 'vnfbgS1nag52xSZhi4Vt4kdWJJqrodG8qc') {
                callback({ error: 'remoteError',
                  error_message: 'Remote reported an error.',
                  remote:
                   { account: 'vnfbgS1nag52xSZhi4Vt4kdWJJqrodG8qc',
                     error: 'actNotFound',
                     error_code: 15,
                     error_message: 'Account not found.',
                     id: 3,
                     ledger_current_index: 6391106,
                     request:
                      { account: 'vnfbgS1nag52xSZhi4Vt4kdWJJqrodG8qc',
                        command: 'account_info',
                        id: 3,
                        ident: 'vnfbgS1nag52xSZhi4Vt4kdWJJqrodG8qc' },
                     status: 'error',
                     type: 'response' },
                  result: 'remoteError',
                  engine_result: 'remoteError',
                  result_message: 'Remote reported an error.',
                  engine_result_message: 'Remote reported an error.',
                  message: 'Remote reported an error.'
                });
              }
            }
          }, 'vnfbgS1nag52xSZhi4Vt4kdWJJqrodG8qc');
      account.publicKeyIsActive('02249a0d51831b5144fe9ca5f9612dd0150b4b05f6b0262cd0ba064285e8c8384e', function(err, is_valid){
        assert(!err);
        assert(is_valid);
      });

    });

  });

});
