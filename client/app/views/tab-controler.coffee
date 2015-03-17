#  ------------------------------------------------
#  -- structure of the tablists, tabs and panels --
#  ------------------------------------------------
#
# tablists : somewhere in the dom :
#     div(role='tablist', aria-controls='panelsCont')
#       # aria-controls is the class of the element containing the tabpanels
#
#  panelsContainers : anywhere else a div with the class 'panelsCont'
#  containing the tabpanel (role='tabpanel', aria-hidden='false')
#     .panelsCont
#          div(role='tabpanel', aria-hidden='false')
#               # content
#           div(role='tabpanel', aria-hidden='true')
#               # content
#           ... as many tabpanels
#
#  Question : shouldn't the panelCont be designated by its ID rather than
#  its class ?
#
#  use case 1 : static html
#   . create the html with the different tab lists (you can create as many as
#     want)
#   . tabControler = require 'path/to/tabConroler'
#   . tabConroler.initializeTabs( rootElementContainingAllTabLists )
#   . done !
#
#  use case 2 : decide dynamically the tabs you need and insert them one by one
#   . NOTE : when the tabs are initialized you can NOT add new tabs.panel
#   . create the html with the empty tabllists and divs that will contain
#     the panels
#   . create divs for tabs and panels and declare them ex :
#       . tab = document.createElement('div')
#         tab.textContent = 'my first tab'
#         panel = document.createElement('div')
#         tab.textContent = 'my first panel'
#         tabControler = require 'path/to/tabConroler'
#         params =
#           tab   : tab
#           panel : panel
#           name  : 'panel-class-name'
#         tabControler.addTab(panelsContainer, tabsContainer,params)
#         # add as many tabs as expected and initialize
#         tabConroler.initializeTabs( rootElementContainingAllTabLists )
#

module.exports = tabControler =
    initializeTabs:(element) ->
        tablists = element.querySelectorAll('[role=tablist]')
        Array.prototype.forEach.call( tablists, (tablist)->
            panelList = tablist.getAttribute('aria-controls')
            panelList = document.querySelector(".#{panelList}")
            tablist.addEventListener 'click', (event) =>
                if event.target.getAttribute('role') != 'tab'
                    return
                panel = event.target.getAttribute 'aria-controls'
                panel = panelList.querySelector(".#{panel}")
                for pan in panelList.children
                    if pan.getAttribute('role') != 'tabpanel'
                        continue
                    if pan != panel
                        pan.setAttribute('aria-hidden',true)
                    else
                        pan.setAttribute('aria-hidden',false)
                        panelSelectEvt = new Event('panelSelect',
                                                    bubbles:true,
                                                    cancelable:false)
                        pan.dispatchEvent(panelSelectEvt)
                for tab in tablist.querySelectorAll('[role=tab]')
                    if tab == event.target
                        event.target.setAttribute('aria-selected',true)
                    else
                        tab.setAttribute('aria-selected', false)
        )


    #
    # panelsContainer : [element] # element containing the panels
    # tabsContainer   : [element] # element containing the tabs
    # params =
    #     tab         : [element] # the tab element to insert
    #     panel       : [element] # the panel element to insert
    #     name        : [String]  # class name of the panel
    #
    addTab: (panelsContainer, tabsContainer, params) ->
        tab = params.tab
        tab.setAttribute('role','tab')
        tab.setAttribute('aria-controls', params.name)
        tab.setAttribute('aria-selected', false)
        tabsContainer.appendChild(tab)
        panel = params.panel
        panel.classList.add(params.name)
        panel.setAttribute('role','tabpanel')
        panel.setAttribute('aria-hidden', true)
        panel.setAttribute('aria-selected', true)
        panelsContainer.appendChild(panel)
