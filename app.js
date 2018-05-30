var express = require('express');
var controller = require('./controller');

var app = express();

app.set('view engine', 'ejs');

app.use(express.static('./assets'))

controller(app);

app.listen(3000);

console.log('listening on port 3000');