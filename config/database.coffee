fs = require 'fs'

if process.env.NODE_ENV is "production"
    name = process.env.name
    password = fs.readFileSync "/etc/cozy/tokens/#{name}.token"


module.exports =
    development:
        driver: "cozy-adapter"

    test:
        driver: "cozy-adapter"

    production:
        driver: "cozy-adapter"
        username: name
        password: password
