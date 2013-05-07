logging = require '../../lib/logging'

module.exports = (compound) ->

    console.log = (text) =>		
        logging.write text

    console.info = (text) =>		
       logging.write text

    console.error = (text) =>
        logging.write text

    console.warm = (text) =>
        logging.write text