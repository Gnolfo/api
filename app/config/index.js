var path = require('path');
var convict = require('convict');

/**
 * Convict config schema
 */
var config = convict({
  debug: {
    doc: 'Whether debugging is on or off',
    format: Boolean,
    default: false,
    env: 'API_DEBUG'
  },
  debugKey: {
    doc: 'Allow for apiDevKey param in API to check API results without token',
    format: String,
    default: 'P6zKj29yauZJDjFV',
    env: 'API_DEBUG_KEY'
  },
  env: {
    doc: 'The current application environment',
    format: ['local', 'mobile', 'staging', 'production' ],
    default: 'local',
    env: 'API_NODE_ENV'
  },
  port: {
    doc: 'The port to bind to',
    format: 'port',
    default: 5000,
    env: 'API_PORT'
  },
  version: {
    doc: 'API Version Number',
    format: String,
    default: 'v1',
    env: 'API_API_VERSION'
  },
  sessionKey: {
    doc: 'Express Session Key',
    format: String,
    default: '94F862AD-5A17-A414-F199-3CE9B8AC8E1C',
    env: 'API_SESSION_KEY'
  },
  inviteOnly: {
    doc: 'Invite Only',
    format: Boolean,
    default: false,
    env: 'API_INVITE_ONLY'
  },
  inviteCap: {
    doc: 'Invitation Cap Per User',
    format: Number,
    default: 15,
    env: 'API_INVITE_CAP'
  },
  bugsnag: {
    doc: 'Bugsnag API Key',
    format: String,
    default: '',
    env: 'API_BUGSNAG'
  },
  hashID: {
    secret: {
      doc: 'Hash ID Encryption Key',
      format: String,
      default: '60A9392B-710C-9C34-E9B0-B80412CB0341',
      env: 'API_HASH_ID_SECRET'
    },
    length: {
      doc: 'Hash ID String Length',
      format: Number,
      default: 6,
      env: 'API_HASH_ID_LENGTH'
    },
    alphabet: {
      doc: 'Hash ID Alphabet to use if creating Hashes ( remove vowels to prevent accidental words )',
      format: String,
      default: 'BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz',
      env: 'API_HASH_ID_ALPHABET'
    }
  },
  database: {
    api: {
      host: {
        doc: 'API MySQL Host',
        format: String,
        default: 'localhost',
        env: 'API_API_HOST'
      },
      database: {
        doc: 'API MySQL Database',
        format: String,
        default: 'api_database',
        env: 'API_API_DATABASE'
      },
      username: {
        doc: 'API MySQL Username',
        format: String,
        default: 'root',
        env: 'API_API_USERNAME'
      },
      password: {
        doc: 'API MySQL Password',
        format: String,
        default: '',
        env: 'API_API_PASSWORD'
      }
    }
  },
  secret: {
    doc: 'App secret key',
    format: String,
    default: '45c723a8a5efffa02b724a74be4be289',
    env: 'API_APP_SECRET'
  },
  router: {
    caseSensitive: {
      doc: 'Whether routes are case-sensitive',
      format: Boolean,
      default: true
    },
    mergeParams: {
      doc: 'Whether child routes should merge with parent route params',
      format: Boolean,
      default: true
    }
  },
  sentry_dsn: {
    doc: 'The Sentry DSN for Sentry logging',
    format: String,
    env: 'API_SENTRY_DSN',
    default: ''
  },
  elasticsearch: {
    host: {
      doc: 'The Elasticsearch host/connection string/URL',
      format: String,
      env: 'API_ELASTIC_SEARCH',
      default: 'http://localhost:9200'
    },
    indexName: {
      doc: 'The name of the API Elasticsearch index',
      format: String,
      default: 'api'
    }
  },
  mandrill: {
    key: {
      doc: 'API Key for Mandrill, which is used for sending email. Can be retrieved/changed at: https://mandrillapp.com/settings/',
      format: String,
      env: 'API_MANDRILL_API_KEY'
    }
  }
});

var env = config.get('env');

try {
  config.loadFile(path.join(__dirname, env + '.json'));
  config.validate({strict: true});
} catch(e) {
  if(e.message.indexOf('configuration param') === -1){
    console.error('INVALID CONFIG: ' + e.name + ' - ' + e.message);
  }
}

module.exports = config;
