var extend  = require('extend');
var utils   = require('./utils');
var UInt160 = require('./uint160').UInt160;
var Amount  = require('./amount').Amount;

/**
 * Meta data processing facility
 *
 * @constructor
 * @param {Object} transaction metadata
 */

function Meta(data) {
  var self = this;

  this.nodes = [ ];

  if (typeof data !== 'object') {
    throw new TypeError('Missing metadata');
  }

  if (!Array.isArray(data.AffectedNodes)) {
    throw new TypeError('Metadata missing AffectedNodes');
  }

  data.AffectedNodes.forEach(this.addNode, this);
};

Meta.nodeTypes = [
  'CreatedNode',
  'ModifiedNode',
  'DeletedNode'
];

Meta.amountFieldsAffectingIssuer = [
  'LowLimit',
  'HighLimit',
  'TakerPays',
  'TakerGets'
];

/**
 * @api private
 */

Meta.prototype.getNodeType = function(node) {
  var result = null;

  for (var i=0; i<Meta.nodeTypes.length; i++) {
    var type = Meta.nodeTypes[i];
    if (node.hasOwnProperty(type)) {
      result = type;
      break;
    }
  }

  return result;
};

/**
 * Add node to metadata
 *
 * @param {Object} node
 * @api private
 */

Meta.prototype.addNode = function(node) {
  this._affectedAccounts = void(0);
  this._affectedBooks = void(0);

  var result = { };

  if ((result.nodeType = this.getNodeType(node))) {
    node = node[result.nodeType];

    result.diffType    = result.nodeType;
    result.entryType   = node.LedgerEntryType;
    result.ledgerIndex = node.LedgerIndex;
    result.fields      = extend({ }, node.PreviousFields, node.NewFields, node.FinalFields);
    result.fieldsPrev  = node.PreviousFields || { };
    result.fieldsNew   = node.NewFields || { };
    result.fieldsFinal = node.FinalFields || { };

    // getAffectedBooks will set this
    // result.bookKey   = undefined;

    this.nodes.push(result);
  }
};

/**
 * Get affected nodes array
 *
 * @param {Object} filter options
 * @return {Array} nodes
 */

Meta.prototype.getNodes = function(options) {
  if (typeof options === 'object') {
    return this.nodes.filter(function(node) {
      if (options.nodeType && options.nodeType !== node.nodeType) {
        return false;
      }
      if (options.entryType && options.entryType !== node.entryType) {
        return false;
      }
      if (options.bookKey && options.bookKey !== node.bookKey) {
        return false;
      }
      return true;
    });
  } else {
    return this.nodes;
  }
};

/**
 * Execute a function on each affected node.
 *
 * The callback is passed two parameters. The first is a node object which looks
 * like this:
 *
 *   {
 *     // Type of diff, e.g. CreatedNode, ModifiedNode
 *     nodeType: 'CreatedNode'
 *
 *     // Type of node affected, e.g. VStreamState, AccountRoot
 *     entryType: 'VStreamState',
 *
 *     // Index of the ledger this change occurred in
 *     ledgerIndex: '01AB01AB...',
 *
 *     // Contains all fields with later versions taking precedence
 *     //
 *     // This is a shorthand for doing things like checking which account
 *     // this affected without having to check the nodeType.
 *     fields: {...},
 *
 *     // Old fields (before the change)
 *     fieldsPrev: {...},
 *
 *     // New fields (that have been added)
 *     fieldsNew: {...},
 *
 *     // Changed fields
 *     fieldsFinal: {...}
 *   }
 *
 * The second parameter to the callback is the index of the node in the metadata
 * (first entry is index 0).
 */

[
 'forEach',
 'map',
 'filter',
 'every',
 'some',
 'reduce'
].forEach(function(fn) {
  Meta.prototype[fn] = function() {
    return Array.prototype[fn].apply(this.nodes, arguments);
  };
});

Meta.prototype.each = Meta.prototype.forEach;

Meta.prototype.getAffectedAccounts = function(from) {
  if (this._affectedAccounts) {
    return this._affectedAccounts;
  }

  var accounts = [ ];

  // This code should match the behavior of the C++ method:
  // TransactionMetaSet::getAffectedAccounts
  for (var i=0; i<this.nodes.length; i++) {
    var node = this.nodes[i];
    var fields = (node.nodeType === 'CreatedNode') ? node.fieldsNew : node.fieldsFinal;
    for (var fieldName in fields) {
      var field = fields[fieldName];
      if (typeof field === 'string' && UInt160.is_valid(field)) {
        accounts.push(field);
      } else if (~Meta.amountFieldsAffectingIssuer.indexOf(fieldName)) {
        var amount = Amount.from_json(field);
        var issuer = amount.issuer();
        if (issuer.is_valid() && !issuer.is_zero()) {
          accounts.push(issuer.to_json());
        }
      }
    }
  }

  this._affectedAccounts = utils.arrayUnique(accounts);

  return  this._affectedAccounts;
};

Meta.prototype.getAffectedBooks = function() {
  if (this._affectedBooks) {
    return this._affectedBooks;
  }

  var books = [ ];

  for (var i=0; i<this.nodes.length; i++) {
    var node = this.nodes[i];

    if (node.entryType !== 'Offer') {
      continue;
    }

    var gets = Amount.from_json(node.fields.TakerGets);
    var pays = Amount.from_json(node.fields.TakerPays);
    var getsKey = gets.currency().to_json();
    var paysKey = pays.currency().to_json();

    if (getsKey !== 'STM') {
      getsKey += '/' + gets.issuer().to_json();
    }

    if (paysKey !== 'STM') {
      paysKey += '/' + pays.issuer().to_json();
    }

    var key = getsKey + ':' + paysKey;

    // Hell of a lot of work, so we are going to cache this. We can use this
    // later to good effect in OrderBook.notify to make sure we only process
    // pertinent offers.
    node.bookKey = key;

    books.push(key);
  }

  this._affectedBooks = utils.arrayUnique(books);

  return this._affectedBooks;
};

exports.Meta = Meta;
