BaseView = require 'lib/base_view'

module.exports = class SearchBarView extends BaseView

    el:'.navbar'

    regExpHistory: {}

    # for qwant features
    onSearchClick: (e) ->
        # select automatically the value when click on the search bar
        e.target.select()

    searchWebQwant: (e) ->
        # do the web search qwant
        if e.keyCode and e.keyCode is 13
            # get the query
            query = encodeURIComponent(e.target.value)
            # do the intent
            intent =
                action: 'goto'
                params: "qwant/search/web/#{query}"
            window.postMessage(intent, window.location.origin)

    handleSubmit: (e) ->
        @searchWebQwant e

    constructor: () ->
        qwantMode = window.urlArguments && window.urlArguments.modes && window.urlArguments.modes.indexOf 'qwant_search' isnt -1
        @qwantEnable = (window.DEV_ENV or qwantMode or window.ENABLE_QWANT_SEARCH) and (window.qwantInstalled)
        @BEN_DEMO = window.BEN_DEMO

        if @qwantEnable and @BEN_DEMO
            qwantSearchDataset = ["web", 'images']
            qwantSource = (items) =>
                (query, cb) =>
                    cb ["QwantWeb-#{query}", "QwantImages-#{query}"]
            qwantDisplay = (query) =>
                if query.indexOf('QwantWeb-') >= 0
                    query = query.replace("QwantWeb-", "")
                    return "Qwant web for #{query}"
                if query.indexOf('QwantImages-') >= 0
                    query = query.replace("QwantImages-", "")
                    return "Qwant images for #{query}"

            substringMatcher = (items) =>
                (query, cb) =>
                    # an array that will be populated with the item wich matches
                    matches = []
                    if query.length <= 3
                        cb []

                    # regexs used to determine if a string matches
                    queryWords = query.toLowerCase().trim().split(' ')
                    regExpList = []
                    for word in queryWords
                        if !reg = @regExpHistory[word]
                            reg = new RegExp( word.split('').join('.*?'), 'g' )
                            @regExpHistory[word] = reg
                        regExpList.push reg

                    # iterate through the pool of strings to find those that matche
                    # all the regexp
                    for item in items
                        itemMatched = true
                        for regExp in regExpList
                            if not regExp.test(item.toLowerCase())
                                itemMatched = false
                                break
                            regExp.lastIndex = 0
                        if itemMatched
                            matches.push item

                    cb matches

            states = [
                # "/Administratif/edf/toto"
                "/Administratif"
                "/Administratif/Bank statements"
                "/Administratif/Bank statements/Bank Of America"
                "/Administratif/Bank statements/Deutsche Bank"
                "/Administratif/Bank statements/Société Générale"
                "/Administratif/CPAM"
                "/Administratif/EDF"
                "/Administratif/EDF/Contrat"
                "/Administratif/EDF/Factures"
                "/Administratif/Emploi"
                "/Administratif/Impôts"
                "/Administratif/Logement"
                "/Administratif/Logement/Loyer 158 rue de Verdun"
                "/Administratif/Orange"
                "/Administratif/Pièces identité"
                "/Administratif/Pièces identité/Carte identité"
                "/Administratif/Pièces identité/Passeport"
                "/Administratif/Pièces identité/Permis de conduire"
                "/Appareils photo"
                "/Boulot"
                "/Cours ISEN"
                "/Cours ISEN/CIR"
                "/Cours ISEN/CIR/LINUX"
                "/Cours ISEN/CIR/MICROCONTROLEUR"
                "/Cours ISEN/CIR/RESEAUX"
                "/Cours ISEN/CIR/TRAITEMENT_SIGNAL"
                "/Divers photo"
                "/Divers photo/wallpapers"
                "/Films"
                "/Notes"
                "/Notes/Communication"
                "/Notes/Notes techniques"
                "/Notes/Recrutement"
                "/Projet appartement à Lyon"
                "/Vacances Périgord"
            ]

            trackCharsToHighlight = (item, charsToHighlight,startIndex,word)->
                charsToHighlight[startIndex] = true
                nChars = item.length
                charIndex = startIndex
                wordIndex = 1
                while charIndex < nChars
                    char = item[charIndex]
                    if  char == word[wordIndex]
                        charsToHighlight[charIndex] = true
                        if ++wordIndex >= word.length
                            return
                    charIndex++
                return

            highlightItem = (item,charsToHighlight) ->
                res = '<p>'
                previousWasToHighlight = undefined
                for isToHighlight, n in charsToHighlight
                    if isToHighlight == previousWasToHighlight
                       res +=  item[n]
                    else
                        if previousWasToHighlight
                            res += '</strong>' + item[n]
                        else
                            res += '<strong class="tt-highlight">' + item[n]
                    previousWasToHighlight = isToHighlight
                if previousWasToHighlight
                    return res += '</strong></p>'
                else
                    return res += '</p>'


            typeah = $('#search-bar')

            # if MIX
            typeah.typeahead {
              hint      : true
              highlight : true
              minLength : 1
              limit     : 8
            },
            {
                name: 'qwant'
                source: qwantSource(qwantSearchDataset)
                display: qwantDisplay
                templates:
                  header: () =>
                      return "<p class='sourceTitle'>Search in application Qwant</p>"
            },
            {
              name: 'states'
              source: substringMatcher(states)
              templates:
                header: () =>
                    return "<p class='sourceTitle'>Search in application Files</p>"
                suggestion: (item)=>
                    queryWords = typeah.typeahead('val').toLowerCase().trim().split(' ')
                    itemLC = item.toLowerCase()
                    fullWordsToHighlight = Array(item.length)

                    for word in queryWords
                        wordRegexp = @regExpHistory[word]
                        wordRegexp.lastIndex = 0
                        fullWordMatch_N = 0
                        fuzzyWordsToHighlight = Array(item.length)

                        # for each word of the query look for an occurence to
                        # highlight
                        while match = wordRegexp.exec(itemLC)
                            # if the occurence is a contiguous string, keep it
                            if match[0].length == word.length
                                fullWordMatch_N++
                                trackCharsToHighlight(itemLC, fullWordsToHighlight,match.index,word)
                            # else keep it only if so far there was no full match
                            else if fullWordMatch_N == 0
                                trackCharsToHighlight(itemLC, fuzzyWordsToHighlight,match.index,word)
                        # if there were only fuzzy match, fusionnates the fuzzy
                        # chars to highllight with the full match chars.
                        if fullWordMatch_N == 0
                            for isToHighlight,n in fuzzyWordsToHighlight
                                if isToHighlight
                                    fullWordsToHighlight[n] = true

                    return html = highlightItem(item,fullWordsToHighlight)
            }





            $('.twitter-typeahead').bind 'typeahead:select', (ev, suggestion) =>
                console.log 'Selection: ' , suggestion, ev
                # if qwant web feature
                if suggestion and suggestion.indexOf('QwantWeb-') >= 0
                    suggestion = suggestion.replace("QwantWeb-", "")
                    typeah.typeahead 'val', ''
                    query = encodeURIComponent(suggestion)
                    # do the intent
                    intent =
                        action: 'goto'
                        params: "qwant/search/web/#{query}"
                    window.postMessage(intent, window.location.origin)
                # if qwant images feature
                else if suggestion and suggestion.indexOf('QwantImages-') >= 0
                    suggestion = suggestion.replace("QwantImages-", "")
                    typeah.typeahead 'val', ''
                    query = encodeURIComponent(suggestion)
                    # do the intent
                    intent =
                        action: 'goto'
                        params: "qwant/search/images/#{query}"
                    window.postMessage(intent, window.location.origin)
                else
                    # search in files
                    window.app.routers.main.navigate "apps/files/folders/be2639a48e5ee0775d5b34bebf2e6b60", true
                    typeah.typeahead 'val', ''

            $('.twitter-typeahead').bind 'typeahead:cursorchange', (ev, suggestion) =>
                # if qwant web feature
                if suggestion and suggestion.indexOf('QwantWeb-') >= 0
                    suggestion = suggestion.replace("QwantWeb-", "")
                    typeah.typeahead 'val', suggestion
                # if qwant images feature
                if suggestion and suggestion.indexOf('QwantImages-') >= 0
                    suggestion = suggestion.replace("QwantImages-", "")
                    typeah.typeahead 'val', suggestion


        else if @BEN_DEMO
            substringMatcher = (items) =>
                (query, cb) =>
                    # an array that will be populated with the item wich matches
                    matches = []

                    # regexs used to determine if a string matches
                    queryWords = query.toLowerCase().trim().split(' ')
                    regExpList = []
                    for word in queryWords
                        if !reg = @regExpHistory[word]
                            reg = new RegExp( word.split('').join('.*?'), 'g' )
                            @regExpHistory[word] = reg
                        regExpList.push reg

                    # iterate through the pool of strings to find those that matche
                    # all the regexp
                    for item in items
                        itemMatched = true
                        for regExp in regExpList
                            if not regExp.test(item.toLowerCase())
                                itemMatched = false
                                break
                            regExp.lastIndex = 0
                        if itemMatched
                            matches.push item

                    cb matches

            states = [
                # "/Administratif/edf/toto"
                "/Administratif"
                "/Administratif/Bank statements"
                "/Administratif/Bank statements/Bank Of America"
                "/Administratif/Bank statements/Deutsche Bank"
                "/Administratif/Bank statements/Société Générale"
                "/Administratif/CPAM"
                "/Administratif/EDF"
                "/Administratif/EDF/Contrat"
                "/Administratif/EDF/Factures"
                "/Administratif/Emploi"
                "/Administratif/Impôts"
                "/Administratif/Logement"
                "/Administratif/Logement/Loyer 158 rue de Verdun"
                "/Administratif/Orange"
                "/Administratif/Pièces identité"
                "/Administratif/Pièces identité/Carte identité"
                "/Administratif/Pièces identité/Passeport"
                "/Administratif/Pièces identité/Permis de conduire"
                "/Appareils photo"
                "/Boulot"
                "/Cours ISEN"
                "/Cours ISEN/CIR"
                "/Cours ISEN/CIR/LINUX"
                "/Cours ISEN/CIR/MICROCONTROLEUR"
                "/Cours ISEN/CIR/RESEAUX"
                "/Cours ISEN/CIR/TRAITEMENT_SIGNAL"
                "/Divers photo"
                "/Divers photo/wallpapers"
                "/Films"
                "/Notes"
                "/Notes/Communication"
                "/Notes/Notes techniques"
                "/Notes/Recrutement"
                "/Projet appartement à Lyon"
                "/Vacances Périgord"
            ]

            trackCharsToHighlight = (item, charsToHighlight,startIndex,word)->
                charsToHighlight[startIndex] = true
                nChars = item.length
                charIndex = startIndex
                wordIndex = 1
                while charIndex < nChars
                    char = item[charIndex]
                    if  char == word[wordIndex]
                        charsToHighlight[charIndex] = true
                        if ++wordIndex >= word.length
                            return
                    charIndex++
                return

            highlightItem = (item,charsToHighlight) ->
                res = '<p>'
                previousWasToHighlight = undefined
                for isToHighlight, n in charsToHighlight
                    if isToHighlight == previousWasToHighlight
                       res +=  item[n]
                    else
                        if previousWasToHighlight
                            res += '</strong>' + item[n]
                        else
                            res += '<strong class="tt-highlight">' + item[n]
                    previousWasToHighlight = isToHighlight
                if previousWasToHighlight
                    return res += '</strong></p>'
                else
                    return res += '</p>'

            typeah = $('#search-bar')
            typeah.typeahead {
              hint      : true
              highlight : true
              minLength : 1
              limit     : 8
            },
              name: 'states'
              source: substringMatcher(states)
              templates:
                suggestion: (item)=>
                    queryWords = typeah.typeahead('val').toLowerCase().trim().split(' ')
                    itemLC = item.toLowerCase()
                    fullWordsToHighlight = Array(item.length)

                    for word in queryWords
                        wordRegexp = @regExpHistory[word]
                        wordRegexp.lastIndex = 0
                        fullWordMatch_N = 0
                        fuzzyWordsToHighlight = Array(item.length)

                        # for each word of the query look for an occurence to
                        # highlight
                        while match = wordRegexp.exec(itemLC)
                            # if the occurence is a contiguous string, keep it
                            if match[0].length == word.length
                                fullWordMatch_N++
                                trackCharsToHighlight(itemLC, fullWordsToHighlight,match.index,word)
                            # else keep it only if so far there was no full match
                            else if fullWordMatch_N == 0
                                trackCharsToHighlight(itemLC, fuzzyWordsToHighlight,match.index,word)
                        # if there were only fuzzy match, fusionnates the fuzzy
                        # chars to highllight with the full match chars.
                        if fullWordMatch_N == 0
                            for isToHighlight,n in fuzzyWordsToHighlight
                                if isToHighlight
                                    fullWordsToHighlight[n] = true

                    return html = highlightItem(item,fullWordsToHighlight)





            $('.twitter-typeahead').bind 'typeahead:select', (ev, suggestion) =>
                console.log 'Selection: ' , suggestion, ev
                window.app.routers.main.navigate "apps/files/folders/be2639a48e5ee0775d5b34bebf2e6b60", true
                typeah.typeahead 'val', ''


        else if @qwantEnable
            @events = {
                "keyup #search-bar": "handleSubmit"
                'click #search-bar': "onSearchClick"
            }

        super

    appendView: (view) ->
