homeTemplate = require('../templates/home')
appButtonTemplate = require "../templates/application_button"
appIframeTemplate = require "../templates/application_iframe"
AppCollection = require('collections/application').ApplicationCollection
User = require("../models/user").User


# View describing main screen for user once he is logged
class exports.HomeView extends Backbone.View
  id: 'home-view'

  constructor: ->
    super()
    @apps = new AppCollection @

  ### Functions ###

  logout: =>
    user = new User()
    user.logout
        success: (data) =>
            @content.show()
            @frames.hide()
            app?.routers.main.navigate 'login', true
        error: =>
            alert "Server error occured, logout failed."

  # Display application manager page, hides app frames, active home button.
  home: =>
    @content.show()
    @frames.hide()
    app?.routers.main.navigate 'home', true
    @selectNavButton @homeButton

  # Display account manager page, hides app frames, active account button.
  account: =>
    @content.show()
    @frames.hide()
    app?.routers.main.navigate 'account', true
    @selectNavButton @accountButton

  # Small trick to size properly iframe.
  setFrameSize: =>
    header = @$ "#header"
    @frames.height $(window).height() - header.height()
    
  # Desactivate all buttons and activate given button (visual activation).
  selectNavButton: (button) ->
    @buttons.find("li").removeClass "active"
    button.parent().addClass "active"

  # Remove all cozy from apps menu.
  clearApps: =>
      @$(".app-button a").unbind()
      @$(".app-button").remove()

  # Add an app button to cozy apps menu
  addApplication: (application) =>
    @buttons.find(".nav:last").append appButtonTemplate(app: application)
    @buttons.find("#" + application.slug).click @onAppButtonClicked
  
  # When an app button is clicked button is activated
  # and corresponding app is loaded in a dedicated iframe.
  onAppButtonClicked: (event) =>
      id = event.target.id
      app?.routers.main.navigate "/apps/#{id}", true
      
  loadApp: (slug) ->
      @frames.show()
      frame = @$("##{slug}-frame")
      if frame.length == 0
          @frames.append appIframeTemplate(id: slug)
          frame = @$("##{slug}-frame")

      @content.hide()
      @$("#app-frames iframe").hide()
      frame.show()
      @selectNavButton @$("##{slug}")
      @selectedApp = slug
      
  ### Configuration ###

  fetch: ->
    @apps.fetch
        success: =>
          # Weird trick to set current app tab active when apps are loaded.
          @selectNavButton @$("##{@selectedApp}") if @selectedApp?
          @selectedApp = null


  render: ->
    $(@el).html homeTemplate()
    @el

  setListeners: ->
    @logoutButton = @$("#logout-button")
    @logoutButton.click @logout
    @accountButton = @$("#account-button")
    @accountButton.click @account
    @homeButton = @$("#home-button")
    @homeButton.click @home
    
    @buttons = @$("#buttons")
    @selectNavButton @homeButton
    @frames = @$("#app-frames")
    @content = @$("#content")
    @buttons.fadeIn()

    $(window).resize @setFrameSize
    @setFrameSize()

