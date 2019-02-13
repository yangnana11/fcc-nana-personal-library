/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true });

module.exports = function (app) {
  const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    comments: {
      type: Array,
      default: []
    },
    commentcount: {
      type: Number,
      default: 0
    }
  }, {
    versionKey: false // You should be aware of the outcome after set to false
  });
  var Book = mongoose.model('Book',bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err,result) => {
        if (err) {
          res.json(err);
        } else {        
          res.json(result);
        }
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      let book = new Book({
        title
      });
      book.save((err, result)=> {
        if (err) {
          res.json(err);
        } else {
          res.json(result);          
        }
      });
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, result)=> {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err,result) => {
        if (err) {
          res.json(err);
        } else {               
          res.json(result);
        }
      })
    })
    
    .post(function(req, res){      
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.update(
        { _id: bookid }, 
        { $push: { comments: comment } , $inc: { commentcount: 1 }},
        function(err, result) {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        }
      );
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, (err,result) => {
        if (err) {
          res.json(err);
        } else {
          res.json({result: 'delete successful'});
        }
      });
    });
  
};
