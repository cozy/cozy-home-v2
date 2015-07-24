BaseView = require 'lib/base_view'
request = require 'lib/request'


# View that displays:
# * available links to find support.
# * a widget to send a message easily to the cozy support email.
module.exports = class exports.HelpView extends BaseView
    id: 'help-view'
    template: require 'templates/help'

    events:
        'click #send-message-button': 'onSendMessageClicked'


    afterRender: ->
        @sendMessageButton = @$ '#send-message-button'
        @sendMessageInput = @$ '#send-message-textarea'
        @alertMessageError = @$ '#send-message-error'
        @alertMessageSuccess = @$ '#send-message-success'

        @configureHelpUrl()


    # If a special help url is defined at the instance level, it's the one used
    # for it.
    configureHelpUrl: ->
        helpUrl = window.app.instance?.helpUrl
        if helpUrl?
            template = require 'templates/help_url'
            $(@$el.find('.line')[1]).prepend template helpUrl: helpUrl


    # When send message is clicked, the content of the message textarea is
    # send to the server. That way he can send an email to the Cozy support
    # team.
    onSendMessageClicked: =>
        @alertMessageError.hide()
        @alertMessageSuccess.hide()

        messageText = @sendMessageInput.val()
        if messageText.length > 0
            @sendMessageButton.spin true
            request.post "help/message", {messageText}, (err) =>
                @sendMessageButton.spin false
                if err
                    @alertMessageError.show()
                else
                    @alertMessageSuccess.show()

