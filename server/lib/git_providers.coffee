request = require 'request-json'
url = require 'url'

# Interface to implement to add a Git provider"
# getManifest: (callback) ->
#   where callback is (error, json data from the manifest)
# getStars: (callback) ->
#   where callback is (error, number of "stars" for the repository)

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

        client.get path + '/package.json', (err, res, body) =>
            callback err, body

    getStars: (callback) ->
        client = request.newClient "https://api.github.com/"
        path = "repos/#{@basePath}/stargazers"
        client.get path, (err, res, body) =>
            callback err, body.length


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

    getStars: (callback) ->
        # No "stars" nor "likes" are available so we use a random value
        # as an incentive for the users

        # random number between 5 and 35
        stars = Math.floor(Math.random() * 30 + 5)
        callback null, stars