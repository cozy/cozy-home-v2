logging = require '../../lib/logging'

module.exports = (compound) ->

	if process.env.NODE_ENV isnt "test"
      console.log = =>
          logging.write Array::join.call arguments, ' '

      console.info = =>
          logging.write Array::join.call arguments, ' '

      console.error = =>
          logging.write Array::join.call arguments, ' '

      console.warm = =>
          logging.write Array::join.call arguments, ' '
  else
      console.info = =>
