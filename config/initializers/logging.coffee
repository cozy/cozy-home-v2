logging = require '../../lib/logging'

module.exports = (compound) ->

	if process.env.NODE_ENV isnt "test"
	    console.log = (text) =>	
		    logging.write text

	    console.info = (text) =>
	    	logging.write text	

	    console.error = (text) =>
		    logging.write text

	    console.warm = (text) =>
		    logging.write text