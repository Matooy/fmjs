var m = FM.time.monitor(1800);

var d = FM.fn.instance(Date, '2015-04-28');

window.addEventListener('resize', function(){

  m(
    window.innerHeight,
    function(p){
      (p === window.innerHeight)
        && console.log('Resized and kept innerHeight 1.8sec');
    }
  );

});
