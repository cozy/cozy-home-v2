emailValidator = (err) ->
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    err() if not re.test(@email)
    
# Validators

User.validate 'email', emailValidator,
    message: 'Given email is not a proper email.'


# Request methods

User.all = (callback) ->
    User.request "all", callback

User.destroyAll = (callback) ->
    User.requestDestroy "all", callback
