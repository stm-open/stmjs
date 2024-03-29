/**
 * Data type map.
 *
 * Mapping of type ids to data types. The type id is specified by the high
 */
var TYPES_MAP = exports.types = [
  void(0),

  // Common
  'Int16',    // 1
  'Int32',    // 2
  'Int64',    // 3
  'Hash128',  // 4
  'Hash256',  // 5
  'Amount',   // 6
  'VL',       // 7
  'Account',  // 8

  // 9-13 reserved
  void(0),    // 9
  void(0),    // 10
  void(0),    // 11
  void(0),    // 12
  void(0),    // 13

  'Object',   // 14
  'Array',    // 15

  // Uncommon
  'Int8',     // 16
  'Hash160',  // 17
  'PathSet',  // 18
  'Vector256' // 19
];

/**
 * Field type map.
 *
 * Mapping of field type id to field type name.
 */

var FIELDS_MAP = exports.fields = {
  // Common types
  1: { // Int16
    1: 'LedgerEntryType',
    2: 'TransactionType'
  },
  2: { // Int32
    2: 'Flags',
    3: 'SourceTag',
    4: 'Sequence',
    5: 'PreviousTxnLgrSeq',
    6: 'LedgerSequence',
    7: 'CloseTime',
    8: 'ParentCloseTime',
    9: 'SigningTime',
    10: 'Expiration',
    11: 'TransferRate',
    12: 'WalletSize',
    13: 'OwnerCount',
    14: 'DestinationTag',
    // Skip 15
    16: 'HighQualityIn',
    17: 'HighQualityOut',
    18: 'LowQualityIn',
    19: 'LowQualityOut',
    20: 'QualityIn',
    21: 'QualityOut',
    22: 'StampEscrow',
    23: 'BondAmount',
    24: 'LoadFee',
    25: 'OfferSequence',
    26: 'FirstLedgerSequence',
    27: 'LastLedgerSequence',
    28: 'TransactionIndex',
    29: 'OperationLimit',
    30: 'ReferenceFeeUnits',
    31: 'ReserveBase',
    32: 'ReserveIncrement',
    33: 'SetFlag',
    34: 'ClearFlag'
  },
  3: { // Int64
    1: 'IndexNext',
    2: 'IndexPrevious',
    3: 'BookNode',
    4: 'OwnerNode',
    5: 'BaseFee',
    6: 'ExchangeRate',
    7: 'LowNode',
    8: 'HighNode'
  },
  4: { // Hash128
    1: 'EmailHash'
  },
  5: { // Hash256
    1: 'LedgerHash',
    2: 'ParentHash',
    3: 'TransactionHash',
    4: 'AccountHash',
    5: 'PreviousTxnID',
    6: 'LedgerIndex',
    7: 'WalletLocator',
    8: 'RootIndex',
    9: 'AccountTxnID',
    16: 'BookDirectory',
    17: 'InvoiceID',
    18: 'Nickname',
    19: 'Feature'
  },
  6: { // Amount
    1: 'Amount',
    2: 'Balance',
    3: 'LimitAmount',
    4: 'TakerPays',
    5: 'TakerGets',
    6: 'LowLimit',
    7: 'HighLimit',
    8: 'Fee',
    9: 'SendMax',
    16: 'MinimumOffer',
    17: 'StreamEscrow',
    18: 'DeliveredAmount'
  },
  7: { // VL
    1: 'PublicKey',
    2: 'MessageKey',
    3: 'SigningPubKey',
    4: 'TxnSignature',
    5: 'Generator',
    6: 'Signature',
    7: 'Domain',
    8: 'FundCode',
    9: 'RemoveCode',
    10: 'ExpireCode',
    11: 'CreateCode',
    12: 'MemoType',
    13: 'MemoData'
  },
  8: { // Account
    1: 'Account',
    2: 'Owner',
    3: 'Destination',
    4: 'Issuer',
    7: 'Target',
    8: 'RegularKey'
  },
  14: { // Object
    1: void(0),  //end of Object
    2: 'TransactionMetaData',
    3: 'CreatedNode',
    4: 'DeletedNode',
    5: 'ModifiedNode',
    6: 'PreviousFields',
    7: 'FinalFields',
    8: 'NewFields',
    9: 'TemplateEntry',
    10: 'Memo'
  },
  15: { // Array
    1: void(0),  //end of Array
    2: 'SigningAccounts',
    3: 'TxnSignatures',
    4: 'Signatures',
    5: 'Template',
    6: 'Necessary',
    7: 'Sufficient',
    8: 'AffectedNodes',
    9: 'Memos'
  },

  // Uncommon types
  16: { // Int8
    1: 'CloseResolution',
    2: 'TemplateEntryType',
    3: 'TransactionResult'
  },
  17: { // Hash160
    1: 'TakerPaysCurrency',
    2: 'TakerPaysIssuer',
    3: 'TakerGetsCurrency',
    4: 'TakerGetsIssuer'
  },
  18: { // PathSet
    1: 'Paths'
  },
  19: { // Vector256
    1: 'Indexes',
    2: 'Hashes',
    3: 'Features'
  }
};

var INVERSE_FIELDS_MAP = exports.fieldsInverseMap = { };

Object.keys(FIELDS_MAP).forEach(function(k1) {
  Object.keys(FIELDS_MAP[k1]).forEach(function(k2) {
    INVERSE_FIELDS_MAP[FIELDS_MAP[k1][k2]] = [ Number(k1), Number(k2) ];
  });
});


var REQUIRED = exports.REQUIRED = 0,
    OPTIONAL = exports.OPTIONAL = 1,
    DEFAULT  = exports.DEFAULT  = 2;

var base = [
  [ 'TransactionType'    , REQUIRED ],
  [ 'Flags'              , OPTIONAL ],
  [ 'SourceTag'          , OPTIONAL ],
  [ 'LastLedgerSequence' , OPTIONAL ],
  [ 'Account'            , REQUIRED ],
  [ 'Sequence'           , REQUIRED ],
  [ 'Fee'                , REQUIRED ],
  [ 'OperationLimit'     , OPTIONAL ],
  [ 'SigningPubKey'      , REQUIRED ],
  [ 'TxnSignature'       , OPTIONAL ]
];

exports.tx = {
  AccountSet: [3].concat(base, [
    [ 'EmailHash'          , OPTIONAL ],
    [ 'WalletLocator'      , OPTIONAL ],
    [ 'WalletSize'         , OPTIONAL ],
    [ 'MessageKey'         , OPTIONAL ],
    [ 'Domain'             , OPTIONAL ],
    [ 'TransferRate'       , OPTIONAL ]
  ]),
  TrustSet: [20].concat(base, [
    [ 'LimitAmount'        , OPTIONAL ],
    [ 'QualityIn'          , OPTIONAL ],
    [ 'QualityOut'         , OPTIONAL ]
  ]),
  OfferCreate: [7].concat(base, [
    [ 'TakerPays'          , REQUIRED ],
    [ 'TakerGets'          , REQUIRED ],
    [ 'Expiration'         , OPTIONAL ]
  ]),
  OfferCancel: [8].concat(base, [
    [ 'OfferSequence'      , REQUIRED ]
  ]),
  SetRegularKey: [5].concat(base, [
    [ 'RegularKey'         , REQUIRED ]
  ]),
  Payment: [0].concat(base, [
    [ 'Destination'        , REQUIRED ],
    [ 'Amount'             , REQUIRED ],
    [ 'SendMax'            , OPTIONAL ],
    [ 'Paths'              , DEFAULT  ],
    [ 'InvoiceID'          , OPTIONAL ],
    [ 'DestinationTag'     , OPTIONAL ]
  ]),
  Contract: [9].concat(base, [
    [ 'Expiration'         , REQUIRED ],
    [ 'BondAmount'         , REQUIRED ],
    [ 'StampEscrow'        , REQUIRED ],
    [ 'StreamEscrow'       , REQUIRED ],
    [ 'CreateCode'         , OPTIONAL ],
    [ 'FundCode'           , OPTIONAL ],
    [ 'RemoveCode'         , OPTIONAL ],
    [ 'ExpireCode'         , OPTIONAL ]
  ]),
  RemoveContract: [10].concat(base, [
    [ 'Target'             , REQUIRED ]
  ]),
  EnableFeature: [100].concat(base, [
    [ 'Feature'            , REQUIRED ]
  ]),
  SetFee: [101].concat(base, [
    [ 'Features'           , REQUIRED ],
    [ 'BaseFee'            , REQUIRED ],
    [ 'ReferenceFeeUnits'  , REQUIRED ],
    [ 'ReserveBase'        , REQUIRED ],
    [ 'ReserveIncrement'   , REQUIRED ]
  ])
};

var sleBase = [
  ['LedgerIndex',          OPTIONAL],
  ['LedgerEntryType',      REQUIRED],
  ['Flags',                REQUIRED]
];

exports.ledger = {
  AccountRoot: [97].concat(sleBase,[
    ['Sequence',           REQUIRED],
    ['PreviousTxnLgrSeq',  REQUIRED],
    ['TransferRate',       OPTIONAL],
    ['WalletSize',         OPTIONAL],
    ['OwnerCount',         REQUIRED],
    ['EmailHash',          OPTIONAL],
    ['PreviousTxnID',      REQUIRED],
    ['AccountTxnID',       OPTIONAL],
    ['WalletLocator',      OPTIONAL],
    ['Balance',            REQUIRED],
    ['MessageKey',         OPTIONAL],
    ['Domain',             OPTIONAL],
    ['Account',            REQUIRED],
    ['RegularKey',         OPTIONAL]]),
  Contract: [99].concat(sleBase,[
    ['PreviousTxnLgrSeq',  REQUIRED],
    ['Expiration',         REQUIRED],
    ['BondAmount',         REQUIRED],
    ['PreviousTxnID',      REQUIRED],
    ['Balance',            REQUIRED],
    ['FundCode',           OPTIONAL],
    ['RemoveCode',         OPTIONAL],
    ['ExpireCode',         OPTIONAL],
    ['CreateCode',         OPTIONAL],
    ['Account',            REQUIRED],
    ['Owner',              REQUIRED],
    ['Issuer',             REQUIRED]]),
  DirectoryNode: [100].concat(sleBase,[
    ['IndexNext',          OPTIONAL],
    ['IndexPrevious',      OPTIONAL],
    ['ExchangeRate',       OPTIONAL],
    ['RootIndex',          REQUIRED],
    ['Owner',              OPTIONAL],
    ['TakerPaysCurrency',  OPTIONAL],
    ['TakerPaysIssuer',    OPTIONAL],
    ['TakerGetsCurrency',  OPTIONAL],
    ['TakerGetsIssuer',    OPTIONAL],
    ['Indexes',            REQUIRED]]),
  EnabledFeatures: [102].concat(sleBase,[
    ['Features',           REQUIRED]]),
  FeeSettings: [115].concat(sleBase,[
    ['ReferenceFeeUnits',  REQUIRED],
    ['ReserveBase',        REQUIRED],
    ['ReserveIncrement',   REQUIRED],
    ['BaseFee',            REQUIRED],
    ['LedgerIndex',        OPTIONAL]]),
  GeneratorMap: [103].concat(sleBase,[
    ['Generator',          REQUIRED]]),
  LedgerHashes: [104].concat(sleBase,[
    ['LedgerEntryType',      REQUIRED],
    ['Flags',                REQUIRED],
    ['FirstLedgerSequence',  OPTIONAL],
    ['LastLedgerSequence',   OPTIONAL],
    ['LedgerIndex',          OPTIONAL],
    ['Hashes',               REQUIRED]]),
  Nickname: [110].concat(sleBase,[
    ['LedgerEntryType',     REQUIRED],
    ['Flags',               REQUIRED],
    ['LedgerIndex',         OPTIONAL],
    ['MinimumOffer',        OPTIONAL],
    ['Account',             REQUIRED]]),
  Offer: [111].concat(sleBase,[
    ['LedgerEntryType',     REQUIRED],
    ['Flags',               REQUIRED],
    ['Sequence',            REQUIRED],
    ['PreviousTxnLgrSeq',   REQUIRED],
    ['Expiration',          OPTIONAL],
    ['BookNode',            REQUIRED],
    ['OwnerNode',           REQUIRED],
    ['PreviousTxnID',       REQUIRED],
    ['LedgerIndex',         OPTIONAL],
    ['BookDirectory',       REQUIRED],
    ['TakerPays',           REQUIRED],
    ['TakerGets',           REQUIRED],
    ['Account',             REQUIRED]]),
  VStreamState: [114].concat(sleBase,[
    ['LedgerEntryType',     REQUIRED],
    ['Flags',               REQUIRED],
    ['PreviousTxnLgrSeq',   REQUIRED],
    ['HighQualityIn',       OPTIONAL],
    ['HighQualityOut',      OPTIONAL],
    ['LowQualityIn',        OPTIONAL],
    ['LowQualityOut',       OPTIONAL],
    ['LowNode',             OPTIONAL],
    ['HighNode',            OPTIONAL],
    ['PreviousTxnID',       REQUIRED],
    ['LedgerIndex',         OPTIONAL],
    ['Balance',             REQUIRED],
    ['LowLimit',            REQUIRED],
    ['HighLimit',           REQUIRED]])
}

exports.metadata = [
  [ 'TransactionIndex'     , REQUIRED ],
  [ 'TransactionResult'    , REQUIRED ],
  [ 'AffectedNodes'        , REQUIRED ]
];

exports.ter = {
  tesSUCCESS: 0,
  tecCLAIM: 100,
  tecPATH_PARTIAL: 101,
  tecUNFUNDED_ADD: 102,
  tecUNFUNDED_OFFER: 103,
  tecUNFUNDED_PAYMENT: 104,
  tecFAILED_PROCESSING: 105,
  tecDIR_FULL: 121,
  tecINSUF_RESERVE_LINE: 122,
  tecINSUF_RESERVE_OFFER: 123,
  tecNO_DST: 124,
  tecNO_DST_INSUF_STM: 125,
  tecNO_LINE_INSUF_RESERVE: 126,
  tecNO_LINE_REDUNDANT: 127,
  tecPATH_DRY: 128,
  tecUNFUNDED: 129,
  tecMASTER_DISABLED: 130,
  tecNO_REGULAR_KEY: 131,
  tecOWNERS: 132
};
