/*
        GET about page
*/

var express = require('express');
var router = express();

router.get('/about', function(req, res) {
        console.log("caca");
        res.render('../views/pages/about');
});

module.exports = router;