###
# Actions to manage authentication : login, logout, registration.
###

passport = require("passport")
redis = require("redis")
utils = require("../../lib/passport_utils")


# Returns true (key "success") if user is authenticated, false either.
# If user is not authenticated, it adds a flag to tell if user is registered
# or not.
action 'isAuthenticated', ->

    checkUserExistence = (err, users) ->
        if err
            console.log err
            send error: true, nouser: false, 500
        else if users.length
            send error: true, nouser: false
        else
            send error: true, nouser: true

    if not req.isAuthenticated()
        User.all checkUserExistence
    else
        send success: true, msg: "User is authenticated."


# Check user credentials and keep user authentication through session. 
action 'login', ->

    answer = (err) ->
        if err
            send error: true,  msg: "Login failed"
        else
            send success: true,  msg: "Login succeeds"

    authenticator = passport.authenticate 'local', (err, user) ->
        if err
            console.log err
            send error: true,  msg: "Server error occured.", 500
        else if user is undefined or not user
            console.log err if err
            send error: true,  msg: "Wrong email or password", 400
        else
            req.logIn user, {}, answer

    req.body["username"] = "owner"
    authenticator(req, res, next)


# Clear authentication credentials from session for current user.
action 'logout', ->

    req.logOut()
    send success: true, msg: "Log out succeeds."


# Create new user with provided email and password. Password is encrypted
# with bcrypt algorithm. 
# If an user is already registered, no new user is created and an error is
# returned.
# TODO Check email and password validity
action 'register', ->

    email = req.body.email
    password = req.body.password

    answer = (err) ->
        if err
            console.log err
            send error: true,  msg: "Server error occured.", 500
        else
            send success: true, msg: "Register succeeds."

    createUser = () ->
        hash = utils.cryptPassword password

        user = new User
            email: email
            owner: true
            password: hash
            activated: true

        if user.isValid()
            user.save answer
        else
            send error: true,  msg: user.errors.email[0], 400

    if password? and password.length > 4
        User.all (err, users) ->
            if err
                console.log err
                send error: true,  msg: "Server error occured.", 500
            else if users.length
                send error: true,  msg: "User already registered.", 400
            else
                createUser()
    else
        send error: true,  msg: "Password is too short", 400


# Update current user data (email and password with given ones)
# Password is encrypted with bcrypt algorithm.
action 'changePassword', ->
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
                    send success: true, msg: 'Password updated successfully'

    User.all (err, users) ->
        if err
            console.log err
            send error: true,  msg: "Server error occured.", 500
        else if users.length == 0
            send error: true,  msg: "No user registered.", 400
        else
            changeUserData users[0]

        
# Generate a random key to allow user to connect to his cozy and change his 
# password without being logged in.
action "forgotPassword", ->
    User.all (err, users) ->
        if err
            console.log err
            send error: true,  msg: "Server error occured.", 500
        else if users.length == 0
            redirect "/"
        else
            user = users[0]
            key = utils.genResetKey()

            utils.sendResetEmail user, key, (err, result)->
                console.log err if err
                send success: "An email has been sent to your email address, follow its instructions to get a new password."


# Check key validity, then redirect to password reset view or to root route
# if key is not valid.
action "resetForm", ->
    utils.checkKey params.key,
        success: -> redirect "/#password/reset/#{params.key}"
        failure: -> redirect "/"

# Check key validity. If key is valid, the user password is change with its
# data.
action "resetPassword", ->
    key = params.key
    newPassword = req.body.password1

    checkKey = (user) ->
        utils.checkKey key,
            success: ->
               client = redis.createClient()
               client.set "resetKey", "", ->
                   changeUserData user
            failure: -> send error: "Key is not valid.", 500


    changeUserData = (user) ->
        data = {}

        if newPassword? and newPassword.length > 5
            data.password = utils.cryptPassword newPassword
        
            user.updateAttributes data, (err) ->
                if err
                    console.log err
                    send error: 'User cannot be updated', 400
                else
                    send success: 'Password updated successfully'
        else
            send error: 'Password is too short', 400


    User.all (err, users) ->
        if err
            console.log err
            send error: true,  msg: "Server error occured.", 500
        else if users.length == 0
            send error: true,  msg: "No user registered.", 400
        else
            checkKey users[0]

