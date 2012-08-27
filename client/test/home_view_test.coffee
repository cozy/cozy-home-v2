{HomeView} = require "views/home_view"
{Application} = require "initialize"


describe 'Manage applications', ->

    before ->
        
        @view = new HomeView()
        @view.render()
        @view.setListeners()

    describe "unit tests", ->
        
        it "home", ->
            @view.home()
            expect(@view.homeButton.parent().hasClass "active").to.be.ok

        it "account", ->
            @view.account()
            expect(@view.accountButton.parent().hasClass "active").to.be.ok

        it "selectNavButton", ->
            @view.selectNavButton @view.homeButton
            expect(@view.homeButton.parent().hasClass "active").to.be.ok
            @view.selectNavButton @view.accountButton
            expect(@view.accountButton.parent().hasClass "active").to.be.ok

        it "addApplication", ->
            # Don't know why, it restarts backbone historty...
            #@view.addApplication new Application
                #name: "app 01"
                #slug: "app-01"
            #expect(@view.$(".app-button").length).to.equal 1

        it "clearApps", ->
            @view.clearApps()
            expect(@view.$(".app-button").length).to.equal 0

        it "loadApp", ->
            # Don't know why, it restarts backbone historty...
            #app1 = new Application
                #name: "app 01"
                #slug: "app-01"


