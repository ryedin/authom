var OAuth2 = require("./oauth2")

function Rise(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

  var me = this;
  this.resetCodeQuery = function() {
    me.code.query = {
      client_id: options.id,
      scope: options.scope || []
    }
  };
  me.resetCodeQuery();  

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret
  }

  this.user.query = {}

  this.on("request", this.onRequest.bind(this))
}

Rise.prototype = new OAuth2

Rise.prototype.code = {
  protocol: "http",
  host: "localhost",
  pathname: "/oauth/authorize"
}

Rise.prototype.token = {
  method: "POST",
  host:   "localhost",
  path:   "/oauth/access_token"
}

Rise.prototype.user = {
  host: "localhost",
  path: "/_rest/user/me"
}

var _onStart = Rise.prototype.onStart;
Rise.prototype.onStart = function(req, res) {

  //since we allow mucking with this.code (for qs stuff below),
  //we must make sure it's cleaned up here so the stuff that the previous request sent doesn't
  //go again
  this.resetCodeQuery();

  //allow passing on querystring stuff to rise
  if (req.query) {
    for (var key in req.query) this.code.query[key] = req.query[key];
    delete req.url.query;
    delete req.url.search;
  }

  _onStart.apply(this, arguments);
}

module.exports = Rise