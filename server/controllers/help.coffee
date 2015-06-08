cozydb = require 'cozydb'
CozyInstance = require '../models/cozyinstance'


module.exports =

    # This route will send an email to the support team based on the text
    # given by the user through the messageText field of the body.
    # It grabs instance infos and add them as prefix of the sent message.
    message: (req, res, next) ->
        CozyInstance.first (err, instance) ->
            {locale, domain} = instance
            {body} = req
            infos = {locale, domain}

            data =
                to: "support@cozycloud.cc"
                subject: "Demande d'assistance depuis un Cozy"
                content: "#{JSON.stringify infos}\n\n#{body.messageText}"
            cozydb.api.sendMailFromUser data, (err) =>
                return next err if err

                res.send success: 'Mail successully sent to support.'

