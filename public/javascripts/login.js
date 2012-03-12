(function() {
  var submitPassword;

  submitPassword = function() {
    $("#login-error").hide();
    return $.ajax({
      type: 'POST',
      url: "/login/",
      data: {
        password: $("#login-password").val()
      },
      success: function(data) {
        if (data.success) {
          return require("main");
        } else {
          return $("#login-error").fadeIn();
        }
      },
      error: function() {
        return $("#login-error").fadeIn();
      },
      dataType: "json"
    });
  };

  $(document).ready(function() {
    $("#login-password").focus();
    $("#login-error").hide();
    return $("#login-password").keyup(function(event) {
      if (event.which === 13) return submitPassword();
    });
  });

}).call(this);
