ObjectPicker = require 'views/object-picker'

module.exports = class IntentManager


    registerIframe : (iframe, remoteOrigin)->
        talker = new Talker(iframe.contentWindow, remoteOrigin)
        talker.onMessage = @handleIntent


    handleIntent : (message) =>
        # console.log "HOME / IntentManager, received message ", message
        intent = message.data
        switch intent.type
            when 'goto'
                window.app.routers.main.navigate "apps/#{intent.params}", true
            when 'pickObject'
                new ObjectPicker(intent.params , (newPhotoChosen, dataUrl) ->
                    message.respond(
                        newPhotoChosen :newPhotoChosen
                        dataUrl        :dataUrl
                    )
                )



