BaseView = require 'lib/base_view'
request = require 'lib/request'

module.exports = class PopoverDescriptionView extends BaseView
    id: 'market-popover-description-view'
    className: 'modal md-modal md-effect-1'
    tagName: 'div'
    template: require 'templates/popover_description'

    events:
        'click #cancelbtn':'onCancelClicked'
        'click #confirmbtn':'onConfirmClicked'

    initialize: (options) ->
        super
        @confirmCallback = _.once options.confirm
        @cancelCallback = options.cancel
        @label = if options.label? then options.label else t 'install'
        @$("#confirmbtn").html @label


    afterRender: ->
        @body = @$ ".md-body"
        @header = @$ ".md-header h3"
        @header.html @model.get 'displayName'

        @body.addClass 'loading'
        @body.html t('please wait data retrieval') + \
            '<div class="spinner-container" />'
        @body.find('.spinner-container').spin true
        @model.getMetaData
            success: =>
                @body.removeClass 'loading'
                @renderDescription()
            error: (error) =>
                @body.removeClass 'loading'
                @body.addClass 'error'
                if error.responseText.indexOf('Not Found') isnt -1
                    @body.html t 'package.json not found'
                else if error.responseText.indexOf('unknown provider') isnt -1
                    @body.html t 'unknown provider'
                    @$("#confirmbtn").hide()
                else
                    @body.html """
                        #{t 'error connectivity issue'}
                        #{error.responseText}
                        """

        @overlay = $ '.md-overlay'
        @overlay.click =>
            @hide()

    renderDescription: =>

        @body.html ""

        # Update displayName for applications not in marketplace
        @header = @$ ".md-header h3"
        @header.html @model.get 'displayName'

        description = @model.get 'description'
        if description?
            localeKey = "#{@model.get 'name'} description"
            localeDesc = t localeKey
            if localeDesc is localeKey
                # description is not translated
                localeDesc = t description
        else
            # for applications not in the market
            localeDesc = @model.get 'remoteDescription'
        # applications not in the market may have no description
        if localeDesc?
            @header.parent().append "<p class=\"line\"> #{localeDesc} </p>"

        permissions = @model.get("permissions")
        if not permissions? or Object.keys(permissions).length is 0
            permissionsDiv = $ """
                <div class='permissionsLine'>
                    <h5>#{t('no specific permissions needed')} </h5>
                </div>
            """
            @body.append permissionsDiv
        else

            # Hide a fake permission screen behind a the flag `BEN_DEMO`
            if window.BEN_DEMO
                @body.append "<h4>#{t('required permissions')}</h4>"
                headerDiv = $ "<div class='permissionsLine header flag-ben-demo'>
                        <div class='fake-checkbox checked'><div class='circle'></div></div>
                        <div class='doctype-name'>Doctype</div>
                        <div class='doctype-filter'>Filtre</div>
                        <div class='doctype-use'>Usage</div>"
                @body.append headerDiv

                filtersType = [
                    'Accès restreint aux documents possédant le tag "Travail".'
                    'Accès restreint aux documents possédant le tag "Personnel".'
                    'Accès restreint aux documents possédant le tag "Vacances".'
                    'Accès restreint aux documents créés il y a plus de deux semaines.'
                    'Accès restreint aux documents créé il y a plus de deux semaines.'
                ]

                for docType, permission of @model.get("permissions")
                    hasFilter = (Math.round(Math.random() * 100) + 1) <= 50
                    isShared = (Math.round(Math.random() * 100) + 1) <= 50


                    if hasFilter
                        filterTag = "&nbsp;"
                    else
                        drawFilterType = Math.round(Math.random() * filtersType.length)
                        filterType = filtersType[drawFilterType]
                        filterTag = "<i class='fa fa-filter'></i>
                                     <div class='tooltip'>#{filterType}</div>"

                    if isShared
                        sharedClass = ""
                        sharedTag = "Local <div class='tooltip'>Cette donnée ne sera utilisée qu'en local et ne sortira pas de Cozy.</div>"
                    else
                        sharedClass = "shared"
                        sharedTag = "Partagé <div class='tooltip'>L'application demande l'autorisation d'envoyer cette donnée à l'extérieur. En savoir plus…</div>"

                    permissionsDiv = $ "<div class='permissionsLine flag-ben-demo'>
                            <div class='fake-checkbox checked'><div class='circle'></div></div>
                            <div class='doctype-name'>#{docType}</div>
                            <div class='doctype-filter'>#{filterTag}</div>
                            <div class='doctype-use #{sharedClass}'>#{sharedTag}</div>"
                    @body.append permissionsDiv

            # Production case
            else
                @body.append "<h5>#{t('required permissions')}</h5>"
                for docType, permission of @model.get("permissions")
                    permissionsDiv = $ """
                      <div class='permissionsLine'>
                        <strong> #{docType} </strong>
                        <p> #{permission.description} </p>
                      </div>
                    """
                    @body.append permissionsDiv

        @handleContentHeight()
        @body.slideDown()
        #@body.niceScroll() # must be done in the end to avoid weird render

    handleContentHeight: ->
        @body.css 'max-height', "#{$(window).height() / 2}px"
        $(window).on 'resize', =>
            @body.css 'max-height', "#{$(window).height() / 2}px"


    show: =>
        @$el.addClass 'md-show'
        @overlay.addClass 'md-show'
        setTimeout =>
            @$('.md-content').addClass 'md-show'
        , 300
        document.addEventListener 'keydown', @onCancelClicked

    hide: =>
        @body.getNiceScroll().hide()
        $('.md-content').fadeOut =>
            @overlay.removeClass 'md-show'
            @$el.removeClass 'md-show'
            @remove()
        $('#home-content').removeClass 'md-open'
        document.removeEventListener 'keydown', @onCancelClicked

    onCancelClicked: (event) =>
        return if event.keyCode? and event.keyCode isnt 27
        @hide()
        @cancelCallback(@model)

    onConfirmClicked: ->
        @confirmCallback @model
