'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  //Amazon S3
  aws_access_key_id : 'AKIAJHFTEX2RNWVBU44A',//your_access_key;
  aws_secret_access_key : 'HP6g3L1cP6i09PTMyhasUHY8FNsNMl4uJugQ4ciJ',// your_secret_key;

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'majorkey-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
  },

  uploads: {
    photoUpload: {
      dest: path.join(__dirname, '../../uploads/users/img/profile/'), // Profile upload destination path
      limits: {
        fileSize: 10 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    },
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});
