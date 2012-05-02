window.app = {}
app.routers = {}
app.models = {}
app.collections = {}
app.views = {}

MainRouter = require('routers/main_router').MainRouter
HomeView = require('views/home_view').HomeView
MarketView = require('views/market').MarketView
LoginView = require('views/login_view').LoginView
RegisterView = require('views/register_view').RegisterView
AccountView = require('views/account_view').AccountView
ResetView = require('views/reset_view').ResetView

# Check if user is authenticated, it it is the cas, he is redirected to login
# page.
checkAuthentication = ->
    $.ajax
        type: "GET"
        url: "authenticated/"
        success: (data) ->
            if data.success
                if Backbone.history.getFragment() is ''
                    app.routers.main.navigate 'home', true
                else if data.nouser
                    app.routers.main.navigate app.views.register.path, true
            else
                app.routers.main.navigate 'login', true

        error: (data) ->
            app.routers.main.navigate 'login', true


# app bootstrapping on document ready
$(document).ready ->
    app.initialize = ->
        app.routers.main = new MainRouter()
        app.views.home = new HomeView()
        app.views.market = new MarketView()
        app.views.login = new LoginView()
        app.views.register = new RegisterView()
        app.views.account = new AccountView()
        app.views.reset = new ResetView()

        if window.location.hash.indexOf("password/reset") < 0
            checkAuthentication()

    app.initialize()
    Backbone.history.start()

