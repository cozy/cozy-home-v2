submitPassword = ->
    $("#login-error").hide()
    $.ajax
        type: 'POST',
        url: "/login/",
        data: { password: $("#login-password").val() },
        success: (data) ->
            if data.success
                require("main")
            else
                $("#login-error").fadeIn()
        ,
        error: ->
            $("#login-error").fadeIn()
        ,
        dataType: "json"
    

$(document).ready ->
    $("#login-password").focus()
    $("#login-error").hide()
    $("#login-password").keyup (event) ->
        if event.which == 13
            submitPassword()
