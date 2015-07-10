
var sample = 2;

FM.vr.monitor(sample, 1000, function(def){
  return sample === def;
})(
  function(def){
    console.log('Monitored variable "sample" is still ' + def);
  },
  function(def){
    console.log('Monitored variable "sample" was changed to ' + sample + ' from ' + def);
    return false;
  }
);

result = sample = 4;
