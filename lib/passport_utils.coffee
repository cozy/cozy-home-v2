bcrypt = require('bcrypt')

# Crypt given password with bcrypt algorithm.
exports.cryptPassword = (password) ->
    salt = bcrypt.genSaltSync(10)
    hash = bcrypt.hashSync(password, salt)
    hash
