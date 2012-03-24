###
# Actions to manage authentication : login, logout, registration.
###


passport = require("passport")


# Returns true (key "success") if user is authenticated, false either.
# If user is not authenticated, it adds a flag to tell if user is registered
# or not.
action 'isAuthenticated', ->

    answer = (err, users) ->
        if err
            console.log err
            send error: true, nouser: false, 500
        else if users.length
            send error: true, nouser: false
        else
            send error: true, nouser: true

    if not req.isAuthenticated()
        User.all answer
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


# TODO use bcrypt to store password.
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
        bcrypt = require('bcrypt')
        salt = bcrypt.genSaltSync(10)
        hash = bcrypt.hashSync(password, salt)
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

