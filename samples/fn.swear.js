
var s1 = FM.fn.promise();
var s2 = FM.fn.promise();

setTimeout(function(){
  s1.resolve();
  s2.resolve();
}, 2000);

var s = FM.fn.swear(s1, s2).then(function(){
  console.log('Your oath was bound.');
});
