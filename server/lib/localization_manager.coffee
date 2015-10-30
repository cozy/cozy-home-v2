fs = require 'fs'
Polyglot = require 'node-polyglot'
Instance = require '../models/cozyinstance'

# Seeks the proper locale files, depending if we run from build/ or from sources
path = require 'path'
LOCALE_PATH = path.resolve __dirname, '../locales'

class LocalizationManager

    polyglot: null

    # should be run when app starts
    initialize: (callback) ->
        @retrieveLocale (err, locale) =>
            if err? then callback err
            else
                @polyglot = @getPolyglotByLocale locale
                callback null, @polyglot

    retrieveLocale: (callback) ->
        Instance.getLocale (err, locale) ->
            if err? or not locale then locale = 'en' # default value
            callback err, locale

    getPolyglotByLocale: (locale) ->
        try
            phrases = require "#{LOCALE_PATH}/#{locale}"
        catch err
            phrases = require "#{LOCALE_PATH}/en"
        return new Polyglot locale: locale, phrases: phrases

    # execute polyglot.t, for server-side localization
    t: (key, params = {}) ->
        return @polyglot?.t(key, params) or key

    # for template localization
    getPolyglot: -> return @polyglot

module.exports = new LocalizationManager()
