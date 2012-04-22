###
# Actions to manage authentication : login, logout, registration.
###


passport = require("passport")


# Crypt given password with bcrypt algorithm.
cryptPassword = (password) ->
    bcrypt = require('bcrypt')
    salt = bcrypt.genSaltSync(10)
    hash = bcrypt.hashSync(password, salt)
    hash


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
    send success: "Log out succeeds."


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
        # Encrypt password
        hash = cryptPassword password

        # Create user
        user = new User
            email: email
            owner: true
            password: hash
            activated: true

        user.save answer

    User.all (err, users) ->
        if err
            console.log err
            send error: true,  msg: "Server error occured.", 500
        else if users.length
            send error: true,  msg: "User already registered.", 400
        else
            createUser()


# Update current user data (email and password with given ones)
# Password is encrypted with bcrypt algorithm.
action 'changePassword', ->
    newEmail = req.body.email
    newPassword = req.body.password1

    changeUserData = (user) ->
        data = {}

        if newEmail? and newEmail.length > 0
            data.email = newEmail

        if newPassword? and newPassword.length > 0
            data.password = cryptPassword newPassword
        
        user.updateAttributes data, (err) ->
            if err
                console.log err
                send error: 'User cannot be updated', 400
            else
                send success: 'Password updated successfully'

    User.all (err, users) ->
        if err
            console.log err
            send error: true,  msg: "Server error occured.", 500
        else if users.length == 0
            send error: true,  msg: "No user registered.", 400
        else
            changeUserData users[0]

