/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import base58 from './api/shorten/base58';
import Url from './api/shorten/shorten.model';
import config from './config/environment';

export default function(app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/artists', require('./api/artist'));
  app.use('/api/campaigns', require('./api/campaign'));
  app.use('/api/charge', require('./api/charge'));
  app.use('/api/shorten', require('./api/shorten'));
  
  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  app.route('/:encoded_id')
    .get((req, res) => {
      var base58Id = req.params.encoded_id;

      var id = base58.decode(base58Id);

      // check if url already exists in database
      Url.findOne({_id: id}, function (err, doc){
        if (doc) {
          res.redirect(doc.long_url);
        } else {
          res.redirect(config.webhost);
        }
      });
    })
  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
