waits = (callback, time) ->
  func = () -> callback()
  setTimeout func, time


describe 'Navigation', ->

  it 'When I display home page', (done) ->
    app.routers.main.navigate "home", true
    waits(done, 300)

  it 'Then it displays 0 app installed', ->
    expect($(".installed-app").length).to.be(0)

  it 'When I display marketplace page', (done) ->
    app.routers.main.navigate "market", true
    waits(done, 300)

  it 'Then it displays 2 apps available',  ->
    expect($(".app").length).to.be(2)


describe 'Installation',  ->

  it 'When I click on hello 01 installation', (done) ->
    $("#hello-world-01 .button").click()
    waits(done, 300)
      
  it 'Then it displays a message to tell me that installation is done', () ->
    expect($("#hello-world-01 .info-text").html()).to.be("Installed!")

  it 'When I display home page', (done) ->
    app.routers.main.navigate "home", true
    waits(done, 600)
      
  it 'Then it displays 1 app installed', () ->
    expect($(".installed-app").length).to.be(1)

  it 'And it displays a link to the application', () ->
    expect($("#hello-world-01 a").length).to.be(1)


describe 'Uninstallation',  ->

  it 'And I click on first app remove button', (done) ->
    $("#hello-world-01 .button").click()
    waits(done, 600)

  it 'Then a message is displayed to tell me that removal is done', () ->
    expect($("#hello-world-01 .info-text").html()).to.be("Removed!")

  it 'When I display home page', (done) ->
    app.routers.main.navigate "home", true
    waits(done, 600)

  it 'Then it displays 0 apps installed', () ->
    expect($(".installed-app").length).to.be(1)

