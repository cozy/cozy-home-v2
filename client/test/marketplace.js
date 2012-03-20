(function() {
  var waits;

  waits = function(callback, time) {
    var func;
    func = function() {
      return callback();
    };
    return setTimeout(func, time);
  };

  describe('Navigation', function() {
    it('When I display home page', function(done) {
      app.routers.main.navigate("home", true);
      return waits(done, 300);
    });
    it('Then it displays 0 app installed', function() {
      return expect($(".installed-app").length).to.be(0);
    });
    it('When I display marketplace page', function(done) {
      app.routers.main.navigate("market", true);
      return waits(done, 300);
    });
    return it('Then it displays 2 apps available', function() {
      return expect($(".app").length).to.be(2);
    });
  });

  describe('Installation', function() {
    it('When I click on hello 01 installation', function(done) {
      $("#hello-world-01 .button").click();
      return waits(done, 300);
    });
    it('Then it displays a message to tell me that installation is done', function() {
      return expect($("#hello-world-01 .info-text").html()).to.be("Installed!");
    });
    it('When I display home page', function(done) {
      app.routers.main.navigate("home", true);
      return waits(done, 600);
    });
    it('Then it displays 1 app installed', function() {
      return expect($(".installed-app").length).to.be(1);
    });
    return it('And it displays a link to the application', function() {
      return expect($("#hello-world-01 a").length).to.be(1);
    });
  });

  describe('Uninstallation', function() {
    it('And I click on first app remove button', function(done) {
      $("#hello-world-01 .button").click();
      return waits(done, 600);
    });
    it('Then a message is displayed to tell me that removal is done', function() {
      return expect($("#hello-world-01 .info-text").html()).to.be("Removed!");
    });
    it('When I display home page', function(done) {
      app.routers.main.navigate("home", true);
      return waits(done, 600);
    });
    return it('Then it displays 0 apps installed', function() {
      return expect($(".installed-app").length).to.be(1);
    });
  });

}).call(this);
