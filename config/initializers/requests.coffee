checkError = (err) ->
    if err
        console.log "An error occured while creating request"

all = -> emit doc._id, doc
User.defineRequest "all", all, checkError
CozyInstance.defineRequest "all", all, checkError

allSlug = -> emit doc.slug, doc
Application.defineRequest "all", allSlug, checkError
