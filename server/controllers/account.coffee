utils = require '../lib/passport_utils'
Adapter = require '../lib/adapter'
User = require '../models/user'
CozyInstance = require '../models/cozyinstance'
UserPreference = require '../models/user_preference'

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

            if body.email? and body.email.length > 0
                if EMAILREGEX.test body.email
                    data.email = body.email
                else
                    errors = ["Given email is not a proper email"]
                    return cb null, errors

            if data.timezone or data.email or data.password
                adapter.updateUser user, data, (err) ->
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


        User.all (err, users) ->
            next err if err
            if users.length is 0
                return res.send 400, error: "No user registered"

            user = users[0]
            data = {}


            updatePassword user, req.body, data, (libErr, userErr) =>
                return res.send 500, error: libErr if libErr
                return res.send 400, error: userErr if userErr

                updateData user, req.body, data, (libErr, userErr) =>
                    return res.send 500, error: libErr if libErr
                    return res.send 400, error: userErr if userErr

                    res.send
                        success: true,
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

    # Update Cozy Instance domain, create it if it does not exist.
    updateInstance: (req, res, next) ->
        domain = req.body.domain
        locale = req.body.locale
        helpUrl = req.body.helpUrl

        if domain? or locale? or helpUrl
            CozyInstance.all (err, instances) ->
                if err then next err
                else if instances.length is 0
                    data =
                        domain: domain
                        locale: locale
                        helpUrl: helpUrl
                    CozyInstance.create data, (err, instance) ->
                        if err then next err
                        else
                            res.send success: true, msg: 'Instance updated.'
                else
                    data = domain: domain, locale: locale, helpUrl: helpUrl
                    instances[0].updateAttributes data, ->
                        res.send success: true, msg: 'Instance updated.'
        else
            res.send 400, error: true, msg: 'No domain or locale given'

    getUserPreference: (req, res, next) ->
        UserPreference.all (err, preferences) ->
            next err if err?
            if preferences.length > 0
                res.send 200, preferences[0]
            else
                res.send 500, error: 'No user preference found'

    setUserPreference: (req, res, next) ->

        UserPreference.all (err, preferences) ->
            next err if err?
            if preferences.length is 0
                UserPreference.create req.body, (err) ->
                    next err if err?
                    res.send 201, success: true
            else
                preferences[0].updateAttributes req.body, (err) ->
                    next err if err?
                    res.send success: true

