var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser = require('body-parser');

var app = module.exports = loopback();

app.use(bodyParser.json()); // for parsing application/json
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({ extended: true })); 

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
