cozydb = require 'cozydb'
fs = require 'fs'
CozyInstance = require '../models/cozyinstance'
CozyUser = require '../models/user'
Application = require '../models/application'
logs = require '../lib/logs'

module.exports =

    # This route will send an email to the support team based on the text
    # given by the user through the messageText field of the body.
    # It grabs instance infos and add them as prefix of the sent message.
    # It takes all app logs and data system logs and add them as attachment.
    message: (req, res, next) ->

        CozyUser.first (err, user) ->
            CozyInstance.first (err, instance) ->

                {locale, domain} = instance
                {email, public_name} = user
                infos = {locale, domain}

                content = '\n\n---- User config\n\n'
                content += JSON.stringify({locale, domain}) + '\n'
                content += JSON.stringify({email, public_name}) + '\n'

                content += '\n\n---- User message\n\n'
                content += req.body.messageText

                onLogs = (path) ->

                    data =
                        to: "support@cozycloud.cc"
                        subject: "Demande d'assistance depuis un Cozy"
                        content: content

                    if path?
                        data.attachments = [
                            path: path
                            contentType: "application/x-compressed-tar"
                        ]

                    cozydb.api.sendMailFromUser data, (err) =>
                        fs.unlink path
                        return next err if err

                        res.send
                            success: 'Mail successully sent to support.'

                if req.body.sendLogs
                    logs.getCompressLogs onLogs
                else
                    onLogs()
