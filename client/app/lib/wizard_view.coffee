BaseView = require './base_view'

module.exports = class WizardView extends BaseView
    tagName: 'dialog'
    className: 'wizard'

    template: require './templates/wizard'
    context: 'wizard'


    bindStepsEvents: ->
        events =
            'click .next': 'next'
            'click .close': 'close'

        for step in @steps
            continue unless step.choices?
            for label, action of step.choices
                events["click ##{step.slug}-#{label}"] = action
        @delegateEvents events


    initialize: ->
        super
        @steps = [] unless @steps?
        @isDialogEnabled = !!@el.showModal
        @bindStepsEvents()


    dispose: ->
        @undelegateEvents()
        @remove()


    getRenderData: ->
        context: @context
        steps: @steps


    show: ->
        @currentIndex = @$el.find('.progress [aria-selected=true]').index()
        @progress()

        if @isDialogEnabled
            @el.showModal()
        else
            @el.setAttribute 'open', true
            document.addEventListener 'keydown', @close
            @$backdrop = $('<div/>', {'class': 'backdrop'}).insertAfter @$el


    close: (event) =>
        return if event.keyCode? and event.keyCode isnt 27
        event.preventDefault?()

        @el.removeAttribute 'open'
        document.removeEventListener 'keyup', @close
        @$backdrop.remove() unless @isDialogEnabled


    next: ->
        @currentIndex++
        @displayStep()


    displayStep: ->
        @steps[@currentIndex].beforeShow?.call @

        @$('[role=tabpanel]')
            .not(":eq(#{@currentIndex})").attr('aria-hidden', true).end()
            .eq(@currentIndex).attr('aria-hidden', false)

        @$('[role=tab]')
            .not(":eq(#{@currentIndex})").attr('aria-selected', false).end()
            .eq(@currentIndex).attr('aria-selected', true)

        @progress()


    progress: ->
        adv = 0 | @currentIndex / (@steps.length - 1) * 100
        @$('.progress').attr 'class', "progress adv-#{adv}"

        @$(".progress li:lt(#{@currentIndex})").addClass 'past'
