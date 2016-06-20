utils = require '../lib/passport_utils'
Adapter = require '../lib/adapter'
User = require '../models/user'
CozyInstance = require '../models/cozyinstance'
localizationManager = require '../helpers/localization_manager'
base32 = require 'thirty-two'
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
                    
            # 2FA settings has been changed    
            if body.authType isnt undefined
                data.authType = body.authType
                data.encryptedOtpKey = body.encryptedOtpKey
                data.hotpCounter = body.hotpCounter
                data.encryptedRecoveryCodes = body.recoveryCodes
                
            # Case of recovery tokens reset
            if body.recoveryCodes?
                data.encryptedRecoveryCodes = body.recoveryCodes

            if data.timezone or data.email or data.password or data.public_name\
            or data.encryptedRecoveryCodes or data.authType isnt undefined
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
                    errors.push localizationManager.t "password too short"
                    return cb null, errors

                unless utils.checkPassword oldPassword, user.password
                    errors.push localizationManager.t "current password incorrect"

                unless newPassword is newPassword2
                    errors.push localizationManager.t "passwords don't match"

                unless newPassword.length > 5
                    errors.push localizationManager.t "password too short"

                if errors.length
                    return cb null, errors

                data.password = utils.cryptPassword newPassword
                adapter.updateKeys newPassword, cb

            else
                cb()

        User.all (err, users) ->
            next err if err
            if users.length is 0
                return res.status(400).send error: localizationManager.t "no user registered"

            user = users[0]
            data = {}

            updatePassword user, req.body, data, (libErr, userErr) ->
                return res.status(500).send error: libErr if libErr
                return res.status(400).send error: userErr if userErr

                updateData user, req.body, data, (libErr, userErr) ->
                    return res.status(500).send error: libErr if libErr
                    return res.status(400).send error: userErr if userErr

                    res.send
                        success: true
                        msg: localizationManager.t 'new password set'


    # Return list of available users
    users: (req, res, next) ->
        User.all (err, users) ->
            if err
                res.status(500).send 
                    error: localizationManager.t "Retrieve users failed."
            else
                res.send rows: users


    # Return base32-encoded 2FA token
    send2FAToken: (req, res, next) ->
        User.all (err, users) ->
            if err
                res.status(400).send error: err
            else if users.length is 0
                res.status(400).send 
                    error: localizationManager.t "no user registered"
            else    
                user = users[0]
                res.status(200).send 
                    token: base32.encode(user.encryptedOtpKey).toString()


    # Return list of instances
    instances: (req, res, next) ->
        CozyInstance.all (err, instances) ->
            if err
                res.status(500).send error: localizationManager.t "retrieve instances failed"
            else
                res.send rows: instances


    # Update Cozy Instance data, create it if it does not exist.
    updateInstance: (req, res, next) ->
        {domain, locale, helpUrl, background, connectedOnce} = req.body

        unless domain? or locale? or helpUrl? or background? or connectedOnce?
            res.status(400).send
                error: true
                msg: localizationManager.t 'No accepted parameter given'

        else
            CozyInstance.all (err, instances) ->
                return next err if err
                data = {domain, locale, helpUrl, background, connectedOnce}


                if instances.length is 0
                    makeChange = CozyInstance.create.bind CozyInstance
                else
                    instance = instances[0]
                    makeChange = instance.updateAttributes.bind instance

                makeChange data, (err, instance) ->
                    return next err if err
                    console.log "reinitializing"
                    localizationManager.initialize ->
                        res.send
                            success: true,
                            msg: localizationManager.t "instance updated"
