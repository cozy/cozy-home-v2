{ApplicationCollection} = require "collections/application"
{Application} = require "models/application"
{HomeView} = require "views/home_view"

describe 'Application Collection', ->

    before ->
        @view = new HomeView()
        @view.render()
        @view.setListeners()
        @apps = new ApplicationCollection @view

    after ->


    describe "binding reset", ->

        it "When I add 3 apps silently to the collection and fire reset event", ->
            @apps.add new Application
                name: "app 01"
                , silent: true
            @apps.add new Application
                name: "app 02"
                , silent: true
            @apps.add new Application
                name: "app 03"
                , silent: true
            @apps.onReset()

        it "Then it displays 3 apps inside app list", ->
            expect(@view.$("#app-list .application").length).to.equal 3

    describe "binding add", ->

        it "When I add 1 app to the collection", ->
            @view.clearApps()
            @apps.reset []
            @apps.add new Application
                name: "app 01"
                

        it "Then it displays 1 app inside app list", ->
            expect(@view.$("#app-list .application").length).to.equal 1

