var _mapper = FM.fn.partial(function(a, b){
  return a.map(b);
}, 'array', 'function')

var iterable = _mapper([1,2,3]);

var f = function(v){
  return v + 2;
};

result = iterable(f);
