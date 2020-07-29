var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var bcrypt = require('bcrypt');

var url = 'mongodb://localhost:27017/test';

// HOME PAGE
router.get('/', function(req, res, next) {
  res.render('index');
});

// LISTING DATA FROM THE DATABASE ON THE HTML PAGE
router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});

// INSERTING NEW USERS ON THE HTML PAGE
router.post('/insert', function(req, res, next) {
  const saltRounds = 10;
  var item = {
    name: req.body.name,
    email: req.body.email,
    hash: req.body.password,
    location: "base"
  };

  // PASSWORD HASHING
  bcrypt.hash(item.hash, saltRounds).then(function(hash) {
    item.hash=hash;
    mongo.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log(item);
      db.collection('user-data').insertOne(item, function(err, result) {
        assert.equal(null, err);
        console.log('Item inserted');
        db.close();
      });
    });
  });
  res.redirect('/');
});

// UPDATE USER ON THE HTML PAGE
router.post('/update', function(req, res, next) {
  var item = {
    name: req.body.title,
    email: req.body.content,
    hash: req.body.author
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

// DELETE USER BY ID ON THE HTLM PAGE
router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});


/*
router.post('/signup', function(req, res) {
var item = {
name: req.body.name,
email: req.body.email,
hash: req.body.password
};

mongo.connect(url, function(err, db) {
assert.equal(null, err);
db.collection('user-data').insertOne(item, function(err, result) {
assert.equal(null, err);
console.log('Item inserted');
db.close();
});
});
});
*/

// LOGIN WITH EMAIL AND PASSWORD ON PHONE
router.post('/login', function(req, res) {
  var item = {
    email: req.body.email,
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').findOne(item, function(err, result) {

      //IF EMAIL FOUND
      if(result != null){

        bcrypt.compare(req.body.password, result.hash).then(function(result) {
          if(result) { //CORRECT PASSWORD
            const objToSend = {
              name: result.name,
              email: result.email
            };
            assert.equal(null, err);
            res.status(200).send(JSON.stringify(objToSend));
            console.log('success');
            db.close();
          } else { //INCORRECT PASSWORD
            assert.equal(null, err);
            res.status(400).send();
            console.log('failed');
            db.close();
          };
        });

      } else { //NO EMAIL FOUND
        assert.equal(null, err);
        res.status(400).send();
        console.log('no email found');
        db.close();
      };
    });
  });
});


// LOGIN WITH EMAIL AND PASSWORD ON PHONE
router.post('/tag', function(req, res) {


  var item = {
    email: req.body.email,
  };

  var item2 = {
    location: req.body.location,
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').findOne(item, function(err, result) {

      //IF EMAIL FOUND
      if(result != null){

        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          db.collection('user-data').updateOne({"email": item.email}, {$set: item2}, function(err, result) {
            assert.equal(null, err);
            console.log('Item updated');
            db.close();
          });
        });

        assert.equal(null, err);
        res.status(200).send();
        console.log('success');


      } else { //NO EMAIL FOUND
        assert.equal(null, err);
        res.status(400).send();
        console.log('no email found');
        db.close();
      };
    });
  });
});



module.exports = router;
