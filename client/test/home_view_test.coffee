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


