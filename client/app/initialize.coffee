{BrunchApplication} = require 'helpers'

MainRouter = require('routers/main_router').MainRouter
HomeView = require('views/home_view').HomeView
LoginView = require('views/login_view').LoginView
RegisterView = require('views/register_view').RegisterView
AccountView = require('views/account_view').AccountView
ResetView = require('views/reset_view').ResetView
ApplicationsView = require('views/applications_view').ApplicationsView

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


class exports.Application extends BrunchApplication
  # This callback would be executed on document ready event.
  # If you have a big application, perhaps it's a good idea to
  # group things by their type e.g. `@views = {}; @views.home = new HomeView`.
  initialize: ->
    @initializeJQueryExtensions()

    @routers = {}
    @views = {}

    @routers.main = new MainRouter()
    @views.home = new HomeView()
    @views.login = new LoginView()
    @views.register = new RegisterView()
    @views.account = new AccountView()
    @views.reset = new ResetView()
    @views.applications = new ApplicationsView()

    
    # render layout
    console.log @views.home.render()
    $("body").html @views.home.render()
    @views.home.setListeners()

    if window.location.hash.indexOf("password/reset") < 0
        checkAuthentication()


window.app = new exports.Application
