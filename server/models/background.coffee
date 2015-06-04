cozydb = require 'cozydb'


# Model to handle background uploaded by the user.
module.exports = Background = cozydb.getModel 'Background',
    binary: cozydb.NoSchema
