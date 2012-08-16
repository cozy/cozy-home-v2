{HomeView} = require "views/home_view"
{Application} = require "models/application"

describe 'Manage applications', ->

    before ->
        @view = new HomeView()
        @view.render()
        @view.setListeners()

    describe "unit test", ->
        
        it "addAppRow", ->
            @view.addAppRow new Application
                name: "app 01"
            expect(@view.$(".application").length).to.equal 1

        it "clearApps", ->
            @view.clearApps()
            expect(@view.$(".application").length).to.equal 0

        it "checkData", ->
            data = {}
            expect(@view.checkData data).to.be.ok
            data = name: "test"
            expect(@view.checkData data).to.be.ok
            data = name: "test", description: undefined
            expect(@view.checkData data).to.not.be.ok
            data = name: "test", description: ""
            expect(@view.checkData data).to.not.be.ok
            data = name: "test", description: "desc"
            expect(@view.checkData data).to.be.ok

        it "displayInfo", ->
            @view.displayInfo "test"
            expect(@view.infoAlert.is(":visible")).to.be.ok
            expect(@view.infoAlert.html()).to.equal "test"

        it "displayError", ->
            @view.displayError "test"
            expect(@view.errorAlert.is(":visible")).to.be.ok
            expect(@view.errorAlert.html()).to.equal "test"
            expect(@view.infoAlert.is(":visible")).to.not.be.ok


    describe "Display installation form", ->
        it "When I click on add application button", ->
            @view.addApplicationButton.click()

        it "It displays a form to describe new app", ->
            expect(@view.addApplicationForm.is(":visible")).to.be.ok

        it "When I click on add application button", ->
            @view.addApplicationButton.click()

        it "It displays a form to describe new app", ->
            expect(@view.addApplicationForm.is(":visible")).to.not.be.ok


    describe "Add a new application", ->

        describe "Wrong data", ->
            it "When I click on install application button", ->
                @data =
                    name: "My App"
                    slug: "my-app"
                    description: "Awesome app"
                    state: "running"
                    index: 0
                    git: "git@github.com:mycozycloud/my-app.git"
                @view.appNameField.val @data.name
                @view.installAppButton.click()

            it "Then error message is diplayed", ->
                expect(@view.errorAlert.is(":visible")).to.be.ok
                expect(@view.infoAlert.is(":visible")).to.not.be.ok

            
        #describe "Right data", ->

            #it "When I click on install application button", ->
                #@server.respondWith("POST", "/api/apps/install",
                #                200, { "Content-Type": "application/json" },
                #                JSON.stringify data)
                #@view.installAppButton.click()
                
                #it "Then loading process is started and displayed", ->
                #expect(@view.appInstallIndicator.is(":visible")).to.be.ok

                #it "When loading process is finished", ->
                #expect(@view.appInstallIndicator.is(":visible")).to.not.be.ok
                
                #it "Then app is marked as installed", ->
                #expect(@view.appInstallSucceses.is(":visible")).to.be.ok

                #it "And app is listed inside my apps", ->
                #expect(@view.$(".application").length).to.equal 1

