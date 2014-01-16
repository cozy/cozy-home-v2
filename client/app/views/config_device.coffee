BaseView = require 'lib/base_view'
ColorButton = require 'widgets/install_button'

# Row displaying device name and attributes
module.exports = class DeviceRow extends BaseView
    className: "line config-device clearfix"
    tagName: "div"
    template: require 'templates/config_device'

    getRenderData: ->
        device: @model.attributes


    ### Constructor ####

    constructor: (options) ->
        @id = "device-btn-#{options.model.id}"
        super

    afterRender: =>
        @removeButton = new ColorButton @$ ".remove-device"
        @docType = @$('.doctype-label')
        @docType.hide()
        @docType.html ''
        if @model.get("configuration").length is 0            
            deviceDiv = $ "<div class='docTypeLine'> <strong>#{t('no specific data synchronised')} </strong> </div>"
            @docType.append deviceDiv
        else
            deviceDiv = $ "<div class='dataLine'> <strong> #{t('synchronised data')}    : </strong> </div>"
            @docType.append deviceDiv
            for docType in Object.keys(@model.get("configuration"))
                deviceDiv = $ "<div class='docTypeLine'> <strong> #{docType}: </strong> #{@model.get('configuration')[docType]} </div>"
                @docType.append deviceDiv
        @docType.slideDown()