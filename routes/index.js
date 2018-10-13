
/*
 * GET home page.
 */

var express = require('express');
var router = express();

router.use('/about', function(req, res) {
  res.render('../views/pages/about');
});

router.get('/', (req, res) => {
  var drinks = [
      { name: 'Bloody Mary', drunkness: 3 },
      { name: 'Martini', drunkness: 5 },
      { name: 'Scotch', drunkness: 10 }
  ];
  var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
  res.render('../views/pages/index', {
      drinks: drinks,
      tagline: tagline,
  });
});

module.exports = router;