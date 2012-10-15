utils = require("../../lib/passport_utils")

# Update current user data (email and password with given ones)
# Password is encrypted with bcrypt algorithm.
action 'updateAccount', ->
    newEmail = req.body.email
    newPassword = req.body.password1
    newPassword2 = req.body.password2

    changeUserData = (user) ->
        data = {}
        errors = []

        if newEmail? and newEmail.length > 0
            re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if re.test newEmail
                data.email = newEmail
            else
                errors.push "Given email is not a proper email"

        if newPassword? and newPassword.length > 0
            if newPassword.length > 5
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
