randomstring = require("randomstring")
bcrypt = require('bcrypt')
redis = require("redis")


# Crypt given password with bcrypt algorithm.
exports.cryptPassword = (password) ->
    salt = bcrypt.genSaltSync(10)
    hash = bcrypt.hashSync(password, salt)
    hash


# Generate a random key and store it in the redis store
exports.genResetKey = () ->
    key = randomstring.generate()
    client = redis.createClient()
    client.on "error", (err) ->
        console.log "Redis error: " + err
    client.set "resetKey", key
    key

# If key match current reset key, callbacks.success is run, key do not match,
# callbacks.failure is run.
exports.checkKey = (key, callbacks) ->
    client = redis.createClient()
    client.get "resetKey", (err, res) ->
        if err
            console.log err
            send error: true,  msg: "Server error occured.", 500
        else
            if res == key
                callbacks.success(res)
            else
                callbacks.failure()


# Send email giving user email address he can connect on to change his
# password. The validity of the address depends on the given key.
exports.sendResetEmail = (user, key, callback) ->
    nodemailer = require "nodemailer"
    transport = nodemailer.createTransport("SMTP", {})
    transport.sendMail
        to : user.email
        from : "no-reply@mycozycloud.com"
        subject : "[Cozy] Reset password procedure"
        text: """
You told to your cozy that you forgot your password. No worry about that, just 
go to following url and you will be able to set a new one:

#{user.url}password/reset/#{key}
"""
    , (error, response) ->
        transport.close()
        callback(error, response)

