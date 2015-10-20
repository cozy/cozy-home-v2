utils = require '../lib/passport_utils'
Adapter = require '../lib/adapter'
User = require '../models/user'
CozyInstance = require '../models/cozyinstance'

adapter = new Adapter()

EMAILREGEX = ///^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|
    (\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|
    (([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$///


# Update current user data (email and password with given ones)
# Password is encrypted with bcrypt algorithm.
module.exports =


    updateAccount: (req, res, next) ->

        updateData = (user, body, data, cb) ->
            if body.timezone?
                #TODO CHECK TIMEZONE VALIDITY
                data.timezone = body.timezone

            if body.public_name?
                data.public_name = body.public_name

            if body.email?
                if body.email.length > 0
                    if EMAILREGEX.test body.email
                        data.email = body.email
                    else
                        errors = ["error proper email"]
                        return cb null, errors
                else
                    errors = ["error email empty"]
                    return cb null, errors

            if data.timezone or data.email or data.password or data.public_name
                adapter.updateUser user, data, (err) ->
                    cb err, null
            else
                cb null

        updatePassword = (user, body, data, cb) ->
            oldPassword = body.password0
            newPassword = body.password1
            newPassword2 = body.password2

            errors = []

            if newPassword?
                if newPassword.length < 5
                    errors.push "The new password is too short."
                    return cb null, errors

                unless utils.checkPassword oldPassword, user.password
                    errors.push "The current password is incorrect."

                unless newPassword is newPassword2
                    errors.push "The new passwords don't match."

                unless newPassword.length > 5
                    errors.push "The new password is too short."

                if errors.length
                    return cb null, errors

                data.password = utils.cryptPassword newPassword
                adapter.updateKeys newPassword, cb

            else
                cb()

        User.all (err, users) ->
            next err if err
            if users.length is 0
                return res.send 400, error: "No user registered"

            user = users[0]
            data = {}

            updatePassword user, req.body, data, (libErr, userErr) ->
                return res.send 500, error: libErr if libErr
                return res.send 400, error: userErr if userErr

                updateData user, req.body, data, (libErr, userErr) ->
                    return res.send 500, error: libErr if libErr
                    return res.send 400, error: userErr if userErr

                    res.send
                        success: true
                        msg: 'Your new password is set'


    # Return list of available users
    users: (req, res, next) ->
        User.all (err, users) ->
            if err
                res.send 500, error: "Retrieve users failed."
            else
                res.send rows: users


    # Return list of instances
    instances: (req, res, next) ->
        CozyInstance.all (err, instances) ->
            if err
                res.send 500, error: "Retrieve instances failed."
            else
                res.send rows: instances


    # Update Cozy Instance data, create it if it does not exist.
    updateInstance: (req, res, next) ->
        {domain, locale, helpUrl, background, connectedOnce} = req.body

        if domain? or locale? or helpUrl? or background? or connectedOnce?
            CozyInstance.all (err, instances) ->
                data = {domain, locale, helpUrl, background, connectedOnce}

                if err then next err

                else if instances.length is 0
                    CozyInstance.create data, (err, instance) ->
                        if err then next err
                        else
                            res.send success: true, msg: 'Instance updated.'

                else
                    instances[0].updateAttributes data, ->
                        res.send success: true, msg: 'Instance updated.'

        else
            res.send 400, error: true, msg: 'No accepted parameter given'

