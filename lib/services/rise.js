var OAuth2 = require("./oauth2")

function Rise(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

  this.code.query = {
    client_id: options.id,
    scope: options.scope || []
  }

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

module.exports = Rise