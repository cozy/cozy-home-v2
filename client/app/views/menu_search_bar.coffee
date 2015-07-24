BaseView = require 'lib/base_view'

module.exports = class AppsMenu extends BaseView

    el:'#menu-applications-container'

    constructor: () ->
        substringMatcher = (strs) ->
          (q, cb) ->
            # an array that will be populated with substring matches
            matches = []
            # regex used to determine if a string contains the substring `q`
            # substrRegex = new RegExp(q, 'i')
            q = q.split(' ').join('')
            substrRegex = new RegExp(q.split('').join('[\\S]*'), 'i')
            # iterate through the pool of strings and for any string that
            # contains the substring `q`, add it to the `matches` array
            $.each strs, (i, str) ->
              if substrRegex.test(str)
                matches.push str
              return
            cb matches
            return

        states = [
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

        # states2 = [
        #     val:'Alabama', id:1
        #     val:'Alaska', id:2
        # ]
        # numbers = new Bloodhound(
        #     datumTokenizer: (d)->
        #         return Bloodhound.tokenizers.whitespace(d.num)
        #     queryTokenizer: Bloodhound.tokenizers.whitespace
        #     local: states2
        # )
        # numbers.initialize()
        # $('#search-bar').typeahead {
        #     hint      : true
        #     highlight : true
        #     minLength : 1
        #     limit     : 8
        # },
        #     displayKey: 'val'
        #     source: numbers.ttAdapter()



        # numbers2 = new Bloodhound(
        #     datumTokenizer: Bloodhound.tokenizers.whitespace
        #     queryTokenizer: Bloodhound.tokenizers.whitespace
        #     local: states
        # )

        # $('#search-bar').typeahead {
        #     hint      : true
        #     highlight : true
        #     minLength : 1
        #     limit     : 8
        # },
        #     name: 'states'
        #     source: numbers2


        # states2 = [
        #     val:'Alabama', id:1
        #     val:'Alaska', id:2
        # ]
        # blood = new Bloodhound(
        #     datumTokenizer: (d)->
        #         return Bloodhound.tokenizers.whitespace(d.val)
        #     queryTokenizer: Bloodhound.tokenizers.whitespace
        #     local: states2
        # )
        # $('#search-bar').typeahead {
        #     hint      : true
        #     highlight : true
        #     minLength : 1
        #     limit     : 8
        # },
        #     name: 'states'
        #     displayKey: 'val'
        #     source: blood



        # states2 = [
        #     val:'Alabama', id:1
        #     val:'Alaska', id:2
        #     val:'alalala', id:2
        #     val:'Alabamo', id:2
        # ]
        # blood = new Bloodhound(
        #     datumTokenizer: Bloodhound.tokenizers.obj.whitespace('val')
        #     queryTokenizer: Bloodhound.tokenizers.whitespace
        #     local: states2
        # )
        # $('#search-bar').typeahead {
        #     hint      : true
        #     highlight : true
        #     minLength : 1
        #     limit     : 8
        # },
        #     name: 'states'
        #     display: 'val'
        #     source: blood


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
            suggestion: (string)->
                tokens = typeah.typeahead('val')
                tokens = tokens.split(' ').join('') # remove spaces
                console.log string, tokens

                tokenIndex = 0
                stringIndex = 0
                matchWithHighlights = ''
                matchedPositions = []
                string = string.toLowerCase()
                while stringIndex < string.length
                    car = string[stringIndex]
                    if  car == tokens[tokenIndex]
                        matchWithHighlights += '<strong class="tt-highlight">' + car + '</strong>'
                        matchedPositions.push stringIndex
                        tokenIndex++
                        if tokenIndex >= tokens.length
                            # matches.push
                            #     match       : string
                            #     highlighted : matchWithHighlights + string.slice(stringIndex + 1)
                            #     positions   : matchedPositions
                            matchWithHighlights += string.slice(stringIndex + 1)
                            break
                    else
                        matchWithHighlights += car
                    stringIndex++

                res = '<p>' + matchWithHighlights + '</p>'
                return res


            # fuzzyMatch = (searchSet, query) ->
            #   tokens = query.toLowerCase().split('')
            #   matches = []
            #   searchSet.forEach (string) ->
            #     tokenIndex = 0
            #     stringIndex = 0
            #     matchWithHighlights = ''
            #     matchedPositions = []
            #     string = string.toLowerCase()
            #     while stringIndex < string.length
            #       if string[stringIndex] == tokens[tokenIndex]
            #         matchWithHighlights += highlight(string[stringIndex])
            #         matchedPositions.push stringIndex
            #         tokenIndex++
            #         if tokenIndex >= tokens.length
            #           matches.push
            #             match: string
            #             highlighted: matchWithHighlights + string.slice(stringIndex + 1)
            #             positions: matchedPositions
            #           break
            #       else
            #         matchWithHighlights += string[stringIndex]
            #       stringIndex++
            #     return
            #   matches



        $('.twitter-typeahead').bind 'typeahead:select', (ev, suggestion) =>
            console.log 'Selection: ' , suggestion, ev
            window.app.routers.main.navigate "apps/files/folders/be2639a48e5ee0775d5b34bebf2e6b60", true
            typeah.typeahead 'val', ''


        super

    appendView: (view) ->
