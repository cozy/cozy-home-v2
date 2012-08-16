{HomeView} = require "views/home_view"

describe 'Manage applications', ->

    before ->
        @view = new HomeView()
        @view.render()
        @view.setListeners()

    after ->

    describe "Display installation form", ->
        it "When I click on add application button", ->
            @view.addApplicationButton.click()

        it "It displays a form to describe new app", ->
            expect(@view.addApplicationForm.is(":visible")).to.be.ok

        it "When I click on add application button", ->
            @view.addApplicationButton.click()

        it "It displays a form to describe new app", ->
            expect(@view.addApplicationForm.is(":visible")).to.not.be.ok

    describe "Add first available applications", ->
        it "When I click on install application buttonp", ->

        it "Then loading process is started and displayed", ->

        it "When loading process is finished", ->

        it "Then app is marked as installed", ->

        it "And app is listed inside my apps", ->
            

