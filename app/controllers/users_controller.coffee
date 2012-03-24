checkApiAuthenticated = ->
    if req.isAuthenticated() then next() else send 403

before checkApiAuthenticated

# Return list of available users
action 'users', ->
    User.all (errors, users) ->
        if errors
            send error: "Retrieve users failed.", 500
        else
            send rows: users

