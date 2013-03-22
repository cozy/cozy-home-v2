utils = require("./lib/passport_utils")

EMAILREGEX = ///^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|
    (\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|
    (([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$///

# Update current user data (email and password with given ones)
# Password is encrypted with bcrypt algorithm.
action 'updateAccount', ->
    newEmail = body.email
    newTimezone = body.timezone
    oldPassword = body.password0
    newPassword = body.password1
    newPassword2 = body.password2

    changeUserData = (user) ->
        data = {}
        errors = []

        if newEmail? and newEmail.length > 0
            if EMAILREGEX.test newEmail
                data.email = newEmail
            else
                errors.push "Given email is not a proper email"

        if newTimezone?
            data.timezone = newTimezone

        if newPassword? and newPassword.length > 0
            if not utils.checkPassword(oldPassword, user.password)
                errors.push "Old password is incorrect"
            else if newPassword.length > 5
                if newPassword == newPassword2
                    data.password = utils.cryptPassword newPassword
                else
                    errors.push "Passwords don't match."
            else
                errors.push "Password is too short."


        if errors.length
            send error: true, msg: errors, 400
        else
            user.updateAttributes data, (err) ->
                if err
                    console.log err
                    send error: true, msg: 'User cannot be updated', 400
                else
                    send
                        success: true,
                        msg: 'Account informations updated successfully'

    User.all (err, users) ->
        if err
            console.log err
            send error: true, msg: "Server error occured.", 500
        else if users.length == 0
            send error: true, msg: "No user registered.", 400
        else
            changeUserData users[0]

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
    if domain?
        CozyInstance.all (err, instances) ->
            if err
                railway.logger.write err
                send error: true, msg: "Server error occured.", 500
            else if instances.length == 0
                CozyInstance.create domain: domain, (err, instance) ->
                    if err
                        railway.logger.write err
                        send error: true, msg: "Server error occured.", 500
                    send success: "true", msg: "Domain updated.", 200
            else
                instances[0].updateAttributes domain: domain, ->
                    send success: "true", msg: "Domain updated.", 200
    else
        send error: true, msg: "No domain given", 400
