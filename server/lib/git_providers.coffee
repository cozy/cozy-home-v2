request = require 'request-json'
url = require 'url'

# Interface to implement to add a Git provider"
# getManifest: (callback) ->
#   where callback is (error, json data from the manifest)

class GitProvider

    constructor: (repoDescriptor) ->
        @repoUrl = repoDescriptor.git
        @repoBranch = repoDescriptor.branch

# Github provider
module.exports.GithubProvider = class GithubProvider extends GitProvider

    constructor: (repoDescriptor) ->
        super repoDescriptor
        @basePath = (@repoUrl).substring(19, (@repoUrl.length - 4))

    getManifest: (callback) ->

        client = request.newClient "https://raw.github.com/"
        if @repoBranch?
            path = @basePath + '/' + @repoBranch
        else
            path = @basePath + '/master'

        client.get path + '/package.json', (err, res, body) ->
            callback err, body


# Cozy private Gitlab provider
# -- MesInfos project only
module.exports.CozyGitlabProvider = class CozyGitlabProvider extends GitProvider

    getManifest: (callback) ->
        repo = url.parse(@repoUrl, true)
        domain = "#{repo.protocol}//#{repo.host}"
        client = request.newClient domain

        @basePath = repo.pathname.replace('.git', '')
        path = "#{@basePath}/raw/master/package.json"
        client.get path, (err, res, body) ->
            err = body.error if body.error?
            callback err, body
