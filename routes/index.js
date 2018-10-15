
/*
 * GET home page.
 */

var express = require('express');
var router = express();
//var aboutRouter = require('./about');

//router.get('/userlist', function(req, res) {
//  var db = req.db;
//  var collection = db.get('usercollection');
//  collection.find({},{},function(e,docs){
//      res.render('userlist', {
//          "userlist" : docs
//      });
//  });
//});

router.get('/', (req, res) => {
  console.log("non");
  var drinks = [
      { name: 'Bloody Mary', drunkness: 3 },
      { name: 'Martini', drunkness: 5 },
      { name: 'Scotch', drunkness: 10 }
  ];
  var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
  console.log("caca");
//  var aboutRouter = require('./about');
  res.render('../views/pages/index', {
      drinks: drinks,
      tagline: tagline 
      //aboutRouter: aboutRouter
  });
});

module.exports = router;