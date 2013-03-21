module.exports = (compound) ->
    console.info = (text) ->
        if process.env.NODE_ENV != "test"
            console.log text
