
(function($,window,undefined){

  $.fn.spin = function(doSpin) {
    if(doSpin){
      this.width(this.outerWidth());
      this.height(this.outerHeight());
      this.data('spinner-content-was', this.contents());
      spinWhite = this.hasClass('btn') && !this.hasClass('spin-black');
      this.html('<div class="spinholder">' +
        '<img src="img/spinner' + (spinWhite ? '-white': '') + '.svg" />' +
        '</div>');
    }else{
      this.css({width: '', height: ''});
      this.empty().append(this.data('spinner-content-was'));
    }
    return this;
  };

})(jQuery,this);
