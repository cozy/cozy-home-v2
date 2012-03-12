###
# Actions to manage authentication : login, logout, registration.
###

passport = require("passport")


# Render browser UI for login.
# TODO enable layout with jade templates
action 'login', ->
    layout false
    render title: "Cozy Home : sign in"

# Returns true (key "success") if user is authenticated, false either.
# If user is not authenticated, it adds a flag to tell if user is registered
# or not.
action 'isAuthenticated', ->
    if not req.isAuthenticated()
        User.all (err, users) ->
            if not err and users.length
                send success: false, nouser: false
            else
                send success: false, nouser: true
    else
        send success: true

# Check user credentials and keep user authentication through session. 
action 'login', ->

    answer = (err) ->
        if err
            send success: false,  msg: "Login failed"
        else
            send success: true,  msg: "Login succeeds"

    authenticator = passport.authenticate 'local', (err, user) ->
        if err or user is undefined or not user
            send success: false,  msg: "Wrong email or password", 403
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

    createUser = () ->
        user = new User
            email: email
            owner: true
            password: password
            activated: true

        user.save (err) ->
            if err
                console.log err
                send error: "Error occured"
            else
                send success: "Register succeeds."

    User.all (err, users) ->
        if err
            console.log err
            send error: "Error occured"
        else if users.length
            send error: "User already registered"
        else
            createUser()



