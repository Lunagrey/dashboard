/*
        GET about page
*/

var express = require('express');
var app = express();

console.log("in about");
app.get('/about', function(req, res) {
        res.render('../views/pages/about');
}); 