var m = FM.time.monitor(1800);

window.addEventListener('resize', function(){

  m(
    window.innerHeight,
    function(p){
      (p === window.innerHeight)
        && console.log('[time.monitor] Resized and kept innerHeight 1.8sec');
    }
  );

});
