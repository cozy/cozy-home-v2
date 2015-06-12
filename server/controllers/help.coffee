cozydb = require 'cozydb'
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
                selectedApp = req.body.app or 'home'

                {locale, domain} = instance
                {email, public_name} = user
                {body} = req
                infos = {locale, domain}

                selectedApp = 'calendar'

                content = '\n\n---- User config\n\n'
                content += JSON.stringify({locale, domain}) + '\n'
                content += JSON.stringify({email, public_name}) + '\n'

                content += '\n\n---- User message\n\n'
                content += req.body.messageText

                Application.all (err, apps) ->
                    slugs = apps.map (app) -> app.slug

                    logs.getManyLogs slugs, (err, appLogs) ->
                        logs.getLogs 'data-system', (err, dsLogs) ->

                            attachments = []
                            if dsLogs?
                                attachments.push
                                    filename: "ds.log"
                                    content: dsLogs
                                    contentType: "plain/text"

                            for slug, logContent of appLogs
                                attachments.push
                                    filename: "#{slug}.log"
                                    content: logContent
                                    contentType: "text/plain"

                            data =
                                to: "frank@mycozycloud.com"
                                subject: "Demande d'assistance depuis un Cozy"
                                content: content
                                attachments: attachments

                            cozydb.api.sendMailFromUser data, (err) =>
                                return next err if err

                                res.send
                                    success: 'Mail successully sent to support.'

