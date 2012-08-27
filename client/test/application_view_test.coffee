{ApplicationsView} = require "views/applications_view"
{Application} = require "models/application"

describe 'Manage applications', ->

    before ->
        @view = new ApplicationsView()
        @view.render()
        @view.setListeners()

    describe "unit tests", ->
        
        it "addAppRow", ->
            @view.addAppRow new Application
                name: "app 01"
            expect(@view.$(".application").length).to.equal 1

        it "clearApps", ->
            @view.clearApps()
            expect(@view.$(".application").length).to.equal 0

        it "checkData", ->
            data = git: "https://github.com/mycozycloud/cozy-notes.git"
            expect(@view.checkData(data).error).to.not.be.ok
            data.name = "test"
            expect(@view.checkData(data).error).to.not.be.ok
            data.description = undefined
            expect(@view.checkData(data).error).to.be.ok
            data.description = ""
            expect(@view.checkData(data).error).to.be.ok
            data.description = "desc"
            expect(@view.checkData(data).error).to.not.be.ok
            data.git = "blabla"
            expect(@view.checkData(data).error).to.be.ok

        it "displayInfo", ->
            @view.displayInfo "test"
            expect(@view.infoAlert.is(":visible")).to.be.ok
            expect(@view.infoAlert.html()).to.equal "test"

        it "displayError", ->
            @view.displayError "test"
            expect(@view.errorAlert.is(":visible")).to.be.ok
            expect(@view.errorAlert.html()).to.equal "test"
            expect(@view.infoAlert.is(":visible")).to.not.be.ok

        it "onManageAppsClicked", ->
            @view.addAppRow new Application
                name: "app 01"
            @view.onManageAppsClicked()
            expect(@view.$(".application-outer").is("visible")).to.be.ok
            expect(@view.isManaging).to.be.ok
            @view.onManageAppsClicked()
            expect(@view.$(".application-outer").is("visible")).not.to.be.ok


    describe "Display installation form", ->
        it "When I click on add application button", ->
            @view.addApplicationModal.hide()
            @view.addApplicationButton.click()

        it "It displays a form to describe new app", ->
            expect(@view.addApplicationModal.is(":visible")).to.be.ok

        it "When I click on add application button", ->
            @view.addApplicationButton.click()

        it "It hides the form", ->
            expect(@view.addApplicationModal.is(":visible")).to.not.be.ok

        it "When I display the form and I click on close button", ->
            @view.addApplicationButton.click()
            @view.addApplicationCloseCross.click()

        it "It hides the form", ->
            expect(@view.addApplicationModal.is(":visible")).to.not.be.ok


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
                @view.installAppButton.button.click()

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

