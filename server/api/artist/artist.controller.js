/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/artist              ->  index
 * POST    /api/artist              ->  create
 * GET     /api/artist/:id          ->  show
 * PUT     /api/artist/:id          ->  upsert
 * PATCH   /api/artist/:id          ->  patch
 * DELETE  /api/artist/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Artist from './artist.model';
import multer from 'multer';
import config from '../../config/environment';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';

global.appRoot = path.resolve(__dirname);

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Artists
export function index(req, res) {
  return Artist.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Artist from the DB
export function show(req, res) {
  return Artist.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Artist in the DB
export function create(req, res) {
  return Artist.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Artist in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Artist.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Artist in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Artist.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Artist from the DB
export function destroy(req, res) {
  return Artist.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

//upload photo
export function uploadPhoto(req,res) {
  var relativePath = '';
  var upload = multer(config.uploads.photoUpload).single('newPhoto');
  var photoUploadFileFilter = require(path.resolve('server/config/multer')).photoUploadFileFilter;
  var isStart = false;

  upload(req, res, function (err) {
    if(err) {
      return res.end("Error uploading file.");
    }
    else {
        
      config.uploads.photoUpload.dest.split('/').forEach(function(subStr) {
        if (subStr === 'uploads') {
          isStart = true;
        }
        if (isStart) {
          relativePath += '/';
          relativePath += subStr;
        }
      });
      var photoUrl = relativePath + req.file.filename;
      console.log(path.join(__dirname, '../..' + photoUrl));
      

      // res.end(photoUrl);
      AWS.config.update({accessKeyId: config.aws_access_key_id, secretAccessKey: config.aws_secret_access_key});
      console.log(appRoot);
      fs.readFile(path.join(__dirname, '../..' + photoUrl), (err,data) => {
          if(err) throw err;
          var s3 = new AWS.S3();
          var s3_param = {
             Bucket: 'entusic-account-images',
             Key: req.file.filename,
             Expires: 60,
             ContentType: req.file.mimetype,
             ACL: 'public-read',
             Body: data
          };
          s3.putObject(s3_param, function(err, data){
             if(err){
                console.log(err);
             } else {
              var return_data = {
                 signed_request: data,
                 url: 'https://s3-us-west-1.amazonaws.com/entusic-account-images/'+req.file.filename
              }; 
              console.log('return data - ////////// --------------');
              console.log(return_data.url);
              res.end(return_data.url);
               // return res.render('upload', {data : return_data, title : 'Upload Image : success', message : { type: 'success', messages : [ 'Uploaded Image']}});
             }
          });
      });
    }
  });

  // console.log('/// ----------- Upload');
  //  console.log(req.newPhoto);
  //  console.log(appRoot + '/uploads');
  //  if(!req.file) {
  //     return res.render('upload', {title : 'Upload Image', message : { type: 'danger', messages : [ 'Failed uploading image. 1x001']}});
  //  } else {
  //     fs.rename(req.file.path, appRoot + '/uploads/' + req.file.originalname, function(err){
  //        if(err){
  //           return res.render('upload', {title : 'Upload Image', message : { type: 'danger', messages : [ 'Failed uploading image. 1x001']}});
  //        } else {
  //           //pipe to s3
  //           AWS.config.update({accessKeyId: config.aws_access_key_id, secretAccessKey: config.aws_secret_access_key});
  //           var fileBuffer = fs.readFileSync(appRoot + '/uploads/' + req.file.originalname);
  //           console.log(fileBuffer);
  //           var s3 = new AWS.S3();
  //           var s3_param = {
  //              Bucket: 'poshbellies',
  //              Key: req.file.originalname,
  //              Expires: 60,
  //              ContentType: req.file.mimetype,
  //              ACL: 'public-read',
  //              Body: fileBuffer
  //           };
  //           s3.putObject(s3_param, function(err, data){
  //              if(err){
  //                 console.log(err);
  //              } else {
  //               var return_data = {
  //                  signed_request: data,
  //                  url: 'https://poshbellies.s3.amazonaws.com/'+req.file.originalname
                   
  //               }; 
  //               console.log('return data - ////////// --------------');
  //               console.log(return_data);
  //                return res.render('upload', {data : return_data, title : 'Upload Image : success', message : { type: 'success', messages : [ 'Uploaded Image']}});
                
  //              }
  //           });
            
           
  //        }
  //     })
  //  }
}