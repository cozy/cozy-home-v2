utils = require("./lib/passport_utils")
Adapter = require './lib/adapter'

adapter = new Adapter()
utils = require("./lib/passport_utils")

EMAILREGEX = ///^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|
    (\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|
    (([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$///

handleError = (msg, code, err) ->
    console.log err if err
    send error: true, msg: msg, code

# Update current user data (email and password with given ones)
# Password is encrypted with bcrypt algorithm.
action 'updateAccount', ->

    updateData = (user, body, data, cb) ->

        if body.timezone?
            data.timezone = body.timezone
            #TODO CHECK TIMEZONE VALIDITY

        if body.email? and body.email.length > 0
            if EMAILREGEX.test body.email
                data.email = body.email
            else
                cb null, "Given email is not a proper email"

        if data.timezone or data.email
            user.updateAttributes data, (err) ->
                cb err, null
        else
            cb null

    updatePassword = (user, body, data, cb) ->

        oldPassword = body.password0
        newPassword = body.password1
        newPassword2 = body.password2


        unless newPassword? and newPassword.length > 0
            return cb null

        errors = []

        unless utils.checkPassword(oldPassword, user.password)
            errors.push "Old password is incorrect."

        unless newPassword == newPassword2
            errors.push "Passwords don't match."

        unless newPassword.length > 5
            errors.push "Password is too short."

        if errors.length
            return cb null, errors

        data.password = utils.cryptPassword newPassword
        adapter.updateKeys newPassword, cb


    User.all (err, users) ->
        return handleError "Server error occured", 500, err if err
        return handleError "No user registered", 400 if users.length is 0

        user = users[0]
        data = {}

        updatePassword user, body, data, (libErr, userErr) =>
            return handleError "Cant update user", 400, libErr if libErr
            return send error: true, msg: userErr, 400 if userErr

            updateData user, body, data, (libErr, userErr) =>
                return handleError "Cant update user", 500, libErr if libErr
                return send error: true, msg: userErr, 400 if userErr

                send
                    success: true,
                    msg: 'Account informations updated successfully'




# Return list of available users
action 'users', ->
    User.all (errors, users) ->
        if errors
            send error: "Retrieve users failed.", 500
        else
            send rows: users

# Return list of instances
action 'instances', ->
    CozyInstance.all (errors, instances) ->
        if errors
            send error: "Retrieve instances failed.", 500
        else
            send rows: instances

# Update Cozy Instance domain, create it if it does not exist.
action 'updateInstance', ->
    domain = body.domain
    locale = body.locale
    if domain? or locale?
        CozyInstance.all (err, instances) ->
            if err
                railway.logger.write err
                send error: true, msg: "Server error occured.", 500
            else if instances.length == 0
                data = domain: domain, locale: locale
                CozyInstance.create data, (err, instance) ->
                    if err
                        railway.logger.write err
                        send error: true, msg: "Server error occured.", 500
                    else
                        send success: "true", msg: "Domain updated.", 200
            else
                data = domain: domain, locale: locale
                instances[0].updateAttributes data, ->
                    send success: "true", msg: "Domain updated.", 200
    else
        send error: true, msg: "No domain given", 400
