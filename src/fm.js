(function(root, def){

  'use strict';

  var
    version     = '0.0.1'
  , description = 'This is WIP forever.'
  , license     = 'MIT'

  // If you want to bind to other namespace,
  // please change this value.
  // For example, `underxcore`, `xepto` or something.
  , namespace   = 'FM'
  ;

  // Load
  root[namespace] = def({
      'version'     : version
    , 'description' : description
    , 'license'     : license
    , 'namespace'   : namespace
  });

})(this, function($){

  // haha, finally, i cant use underscore and jquery anymore.
  var _ = {};

  // Prepare.
  _._  = $;
  _.ar = {} // Array
  _.vr = {} // Variable
  _.nm = {} // Number
  _.st = {} // String
  _.fn = {} // Functon
  _.ob = {} // Object

  // ------ Options ------ //
  // Math
  _.math = {};
  // File
  _.file = {};
  // DOM
  _.dom = {};
  // Html
  _.html = {};
  // Event
  _.event = {};




  /* variable.type :: a -> String
   *
   * More specified types.
   *
   * Nan  -> 'NaN'
   * 1.2  -> 'float'
   * 1    -> 'integer'
   * [1]  -> 'array'
   * null -> 'null'
   */
  _.vr.type = function(v){
    var t = typeof v;

    // No doubt.
    if(v === NaN) return 'NaN';
    if(v === Infinity) return 'Infinity';
    if(v === undefined) return 'undefined';
    if(v === null) return 'null';

    switch(t){
      case 'number':
        var vi = parseInt(v);
        if(vi && (vi === v || vi === (v*-1)))
          return 'integer';
        if(vi && vi && Math.floor(v) !== v)
          return 'float';
      case 'object':
        if(toString.call(v) === '[object Array]')
          return 'array';
      case 'string':
      case 'boolean':
      case 'symbol':
      case 'function':
      default:
        break;
    }

    return t;
  }


  _.vr.empty = function(v){
    return (typeof v === 'undefined' || v === null || v === 0 || !v);
  }


  _.vr.is_f = function(v){
    return _.vr.valid(v, 'function');
  }


  /* variable.valid :: a -> String -> Boolean
   *
   * # Absolutely, no.
   * valid('123', 'integer')
   * // Is '123' an integer ?
   * > false
   *
   * # Detailed type check
   * valid([1,2,3], 'array')
   * // Is [1,2,3] an array ?
   * > true
   *
   * # Default typeof behavior
   * valid([1,2,3], 'object')
   * // Is [1,2,3] an object?
   * > true
   *
   * # OR
   * valid(1.5, ['float','integer'])
   * // Is 1.5 in float or integer ?
   * > true
   *
   * # Instance
   * var n = new Number(2);
   * valid(n, Number);
   * // Is `n` an instanceof Number ?
   * > true
   *
   */
  _.vr.valid = function(val, type){
    var t = _.vr.type(val);
    var s = _.vr.type(type);
    var rf = { // Reverse references.
      'integer': 'number', 'float'  : 'number',
      'array'  : 'object'
    };
    switch(s){
      case 'function':
        return (val instanceof type);
      case 'array':
        return type.filter(function(v){
          return (_.vr.valid(val, v));
        }).length > 0;
      case 'string':
        return (rf.hasOwnProperty(t))
             ? (t === type || rf[t] === type)
             : (t === type) ;
      default:
        return false;
    }
  }


  /* variable.validall :: Array -> Array -> Boolean
   *
   * Apply valid() to all passed values.
   *
   * _.vr.validall([1, 2, 3], 'integer');
   * > true
   *
   * _.vr.validall([1, 'hoge', 3], 'integer');
   * > false
   *
   * _.vr.validall(['hoge', {foo:3}, 4], ['string', 'object', 'integer'])
   * > true
   *
   */
  _.vr.validall = function(vals, types){
    var v = (_.vr.type(vals) != 'array' ? [vals] : vals);
    var t = (_.vr.type(types) != 'array' ? [types] : types);
    return v.filter(function(v, i){
      return (t.length === 1)
        ? _.vr.valid(v, t[0])
        : (t[i] && _.vr.valid(v, t[i]));
    }).length === v.length;
  }


  /* variable.monitor :: a -> Integer -> Function -> Function
   *
   * Monitor a variable and validate after N seconds.
   * Maybe convenience to observe events fired too many times in "1" action.
   * (like GUI events: window(resize|loaded), mouse(move|drag|select)... etc.)
   *
   * @example
   *
   * var o = {
   *   foo: 1
   * }
   *
   * _.vr.monitor(o, 1000, function(o){
   *   return o.foo === 1;
   * })(
   *   function(o){
   *     // Valid callback
   *   },
   *   function(o){
   *     // Invalid callback
   *   }
   * )
   *
   * // This will cause "Invalid callback".
   * o.foo = 2;
   *
   */
  _.vr.monitor = function(tgt, tm, vld){
    return function(clb, err){
      setTimeout(function(){
        (vld(tgt))
          ? (typeof clb === 'function' && clb(tgt))
          : (typeof err === 'function' && err(tgt));
      }, tm);
    }
  }





  //-----------------------------------------------------------------
  // Object
  //-----------------------------------------------------------------


  /* object.merge_recursive :: Object, ....
   *
   * Merge objects recursively.
   */
  _.ob.merge = function(/* Object, Object, Object, ... */){
    var a  = _.ar.clone(arguments), or = a.shift();
    return a.reduce(function(m, o){
      (_.vr.type(o) === 'object')
        && _.ob.each(o, function(v, i){
          _.ob.prop(m, i, v);
        });
      return m;
    }, or);
  }


  _.ob.associated = function(o, ref){
    return (ref)
      ? (function(){
          var s = _.vr.valid(ref, 'array')
                ? ref : ref.split(".")
            , k = s.shift();
          return (o.hasOwnProperty(k))
            ? _.ob.associated(o[k], s.join("."))
            : false;
        })
      : false ;
  }


  /* object.keys :: Object -> Array
   *
   * Return Object keys as Array.
   */
  _.ob.keys = function(o){
    return (_.vr.valid(o, 'object'))
         ? Object.keys.call(o,o)
         : [] ;
  }


  /* ob.prop ::
   *
   * Made of origin.
   */
  _.ob.prop = function(o, k, v, conf){
    var c = _.vr.valid(conf, 'object') ? conf : {};
    Object.defineProperty(o, k, {
      value: v,
      enumerable: _.ob.has(c, 'enumerable') ? c.enumerable : true,
      configurable: _.ob.has(c, 'configurable') ? c.configurable : true,
      writable: _.ob.has(c, 'writable') ? c.writable : true });
    return o;
  }


  _.ob.define = function(def){
    return function(o){
      return _.ob.merge(def, o);
    }
  }



  /* object_pick :: Object -> Array -> Object
   *
   * Pick object properties with keys.
   */
  _.ob.pick = function(o, ks){
    var ret = {};
    ks.map(function(k){
      (_.ob.has(o,k)) && (ret[k] = o[k]);
    });
    return ret;
  }

  _.ob.has = function(o, k){
    return o.hasOwnProperty(k);
  }


  /* object_each :: Object -> Function -> Object
   */
  _.ob.each = function(o, c){
    // Simple is better.
    for(var k in o){
      c(o[k], k)
    }
    return o;
  }


  /* object_filter :: Object -> Function -> Object
   *
   * Filtering Object with keys.
   */
  _.ob.filter = function(o, c){
    var ret = {};
    _.ob.each(o, function(v, k){ c(v, k) && (ret[k] = v); });
    return ret;
  }


  /* ob.each :: Object -> Object -> Object
   */
  _.ob.diff = function(a, b){
    var a_k = _.ob.keys(a);
    var b_k = _.ob.keys(b);
    var diff = {};
    var ks = a_k.concat(b_k);
    ks.map(function(k){
      if(a.hasOwnProperty(k) && b.hasOwnProperty(k)){
        if(a[k] !== b[k])
          diff[k] = b[k];
      }else if(a.hasOwnProperty(k)){
        diff[k] = a[k];
      }else if(b.hasOwnProperty(k)){
        diff[k] = b[k];
      }
    });
    return diff;
  }




  //-----------------------------------------------------------------
  // Array
  //-----------------------------------------------------------------


  /* repeat :: a -> Integer -> [a]
   */
  _.ar.repeat = function(v, len){
    return Array.apply(null, new Array(len)).map(function(){return v})
  }


  /* array.range :: Integer -> Integer -> Array
   *
   * Make ranged array.
   */
  _.ar.range = function(i, ii){
    var ret = [];
    for(var i; i <= ii; i++){ ret.push(i); }
    return ret;
  }


  /* array.clone :: Array -> Array
   *
   * Convert arguments object to array.
   */
  _.ar.clone = function(a){
    return Array.prototype.slice.call(a);
  }


  /* array.intersect :: Array -> Array -> Array
   */
  _.ar.intersect = function(a, b){
    var ret = [];
    for(var i = 0; i < a.length; i++){
      for(var ii = 0; ii < b.length; ii++){
        if (a[i] == b[ii]) {
          ret.push(a[i]);
          break;
        }
      }
    }
    return ret;
  }


  _.ar.has = function(a, n){
    return a.indexOf(n) > -1;
  }


  /* ar.sort :: Array -> Function -> Integer -> Array
   *
   * sort(array, callback, order)
   *
   * array: sorting array.
   * callback: condition callback.
   * array: sorting array.
   *
   * ! This method is NOT fastest to sort a simple list like...
   * [5,2,3,4,9]
   *
   * Sorting collection.
   *
   * _.ar.sort([{l:1}, {l:4}, {k:3}, {l:2}, {l:5}], function(n, m){
   *   if(n.l >= m.l)
   *   { return 1;
   *   }else if(n.l < m.l)
   *   { return - 1;
   *   }else
   *   { return null;
   *   }
   * });
   *
   * {l:1} <- compare {l:4} -> 1
   * In this case, {l:4} will return 1 in sorting callback,
   * so {l:4} will be put after {l:1}.
   *
   * This sample will generate...
   * [{l:1}, {l:2}, {l:4}, {l:5}, {k:3}]
   *
   * ???. What happend to {k:3}?
   *
   * In the callback, I decided to return `null`. This means {k:3} has no properly order.
   * So ar.sort() ignored {k:3} and put it at tail.
   *
   * If you returned false(or something that cant be passed if() statement.) in callback,
   * ar.sort() will completely ignore {k:3}.
   *
   */
  _.ar.sort = function(a, fnc, ord){
    var f = _.vr.valid(fnc, 'function') ? fnc : function(n,m){ return (n>m) ? 1 : (n<m ? -1 : 0); }
    var o = (arguments.length === 3) ? ord : (_.vr.valid(fnc, 'number') ? fnc : 1);
    return (!a.length || !_.vr.valid(a, 'array'))
      ? [] // edge
      : ( (a.length === 1)
          ? a // edge
          : (function(){ // recur
              var ret = [], s = _.ar.clone(a), fst = s.shift();
              var sml = [], bgr = [], oth = [];
              s.map(function(v){
                var fr = f(v,fst);
                  ((fr === 0)    && sml.push(v))
                ||((fr === null) && oth.push(v))
                ||((fr < 0)      && sml.push(v))
                ||((fr > 0)      && bgr.push(v)) ;
              });
              // sort remaining
              sml = _.ar.sort(sml, f, o);
              bgr = _.ar.sort(bgr, f, o);
              // make order
              if(o || typeof o === 'undefined')
              { ret=ret.concat(sml); ret.push(fst); ret=ret.concat(bgr); ret=ret.concat(oth);
              }else
              { ret=ret.concat(bgr); ret.push(fst); ret=ret.concat(sml); ret=ret.concat(oth);
              }
              return ret;
            })()
        )
      ;
  }


  _.ar.sort_collection = function(a, k, o){
    return _.ar.sort(a, function(n,m){
      if(n.l >= m.l){
        return 1;
      }else if(n.l < m.l){
        return - 1;
      }else{
        return null;
      }
    }, o);
  }




  /* string.repeat :: String -> Integer -> String
   *
   * Repeat string.
   */
  _.st.repeat = function(str, len){
    return _.ar.repeat(str, len).join("");
  }


  /* string.fill :: String -> Integer -> String
   *
   * Return repeated-string filled with length.
   */
  _.st.fill = function(str, len){
    return _.ar.repeat(str, parseInt(len / str.length) + 1).join("").slice(0, len);
  }


  /* st_padding :: String -> Integer -> String -> Integer -> String
   *
   * Padding string.
   */
  _.st.pad = function(str, len, pad, lr){
    var pd = _.st.repeat(pad || " ", len);
    return String((!lr ? pd : '') + str + (lr ? pd : '')).slice(0, len)
  }
  // Alias: string.pad(str, len, pad, 0)
  _.st.padl = function(str, len, pad){
    return _.st.pad(str, len, pad, 0);
  }
  // Alias: string.pad(str, len, pad, 1)
  _.st.padr = function(str, len, pad){
    return _.st.pad(str, len, pad, 1);
  }


  _.st.sort = function(str, fnc, ord){
    return _.ar.sort(str.split(''), fnc, ord);
  }




   /* pack :: [Function] -> Object
   *
   * Package list of Functions to Object.
   *
   * function hello(){
   *   alert("hello");
   * }
   *
   * pack([hello]) => { hello: function hello }
   */
  _.fn.pack = function(fns) {
    return fns.reduce(function(m, fn){
      return (m[_.fn.nameof(fn)] = fn) && m;
    }, {});
  }


  /* func.nameof :: Function -> String
   *
   * !! DONT trust this
   *
   * Retrieve function name.
   */
  _.fn.nameof = function(fn) {
    var s = fn.toString().substr('function '.length);
    return s.substr(0, s.indexOf('(')).replace(/ /g, '');
  }


  /* func.argsof :: Function -> Array
   *
   * !! DONT trust this
   *
   * Retrieve argument names of Function.
   */
  _.fn.argsof = function(fn) {
    var z = fn.toString().substr('function '.length)
      , y = z.substr(z.indexOf('(') + 1, z.indexOf(')') - z.indexOf('(') - 1).split(',')
      , x = function(mm, v){ var r = v.replace(/ /g, ''); r.length && mm.push(r); return mm;} ;
    return y.reduce(x, []);
  }


  /* closure_bind_context :: Function -> Object -> Function
   *
   * Bind some callable to specific context.
   * Almost same as jQuery.proxy() method. Maybe.
   */
  _.fn.proxy = function(c, cn, p) {
    return (function(){
      return c.apply(cn, p ? _.ar.clone(arguments).concat(p) : _.ar.clone(arguments));
    });
  }


  /* func.partial :: Function -> ... -> Function()
   *
   * Make a Function to (pseudo) partial.
   *
   * partial(fn, 2)
   *   means: 'fn' takes 2 parameters. (NON type specified)
   *   Parameter will NOT be validated.
   *
   * partial(fn, 'number', 'object')
   *   means: almost same as above. 'fn' will be treated as
   *   `Function(Number var1, Object var2)`.
   *
   *   All parameters will be validated by `variable.type()` function.
   *   (If validation failed, last calculated value always return `undefined`.)
   *
   *-- example --*
   * var fn = function(a,b){ return a + b; };
   * var a = partial(fn, 'number', 'number');
   * var b = a(4);     // Make ( 4 + n ) function.
   * var c = b(10);    // 14
   * var d = b('Foo'); // undefined <- because 2nd argument type is defined as 'number'.
   * var e = a(5, 20)  // Yes, 25. As you know.
   *
   * # If you want to skip arguments validation,
   * # use like below.
   *
   * var partialized = _.partial(function(a, b){
   *   return a * b;
   * });
   *
   */
  _.fn.partial = function(/* Function, Type, Type, Typo, Type, ... */) {
    var arg = _.ar.clone(arguments)
      , fnc = arg.shift()
      , nch = (arg.length === 1 && typeof arg[0] === 'number')
      , len = ( nch ) ? arg[0] : arg.length
    ; // definition end.

    // Merge applied arguments.
    var mrg = function(fn, a){
      return function(){
        var b = a.concat(_.ar.clone(arguments));
        return len > 0 && !(nch || _.vr.validall(b, arg))
          ? undefined // validation failed.
          : ((b.length >= (len === 0 ? fnc.length : len))
              ? fn.apply(fn, b)
              : mrg(fn, b));
      }
    }

    return function(){
      return mrg(fnc, _.ar.clone(arguments))( );
    };
  }


  /* func.bind_partial :: Context -> Function -> Function
   *
   * return Context bound partial.
   */
  _.fn.bind_partial = function(context, fn){
    return _.fn.partial.apply(
      context, [_.fn.proxy(fn, context)].concat(_.ar.clone(arguments).slice(2))
    );
  }


  /* info :: Function -> Object
   *
   * !! DONT trust this
   *
   * return function information.
   */
  _.fn.info = function(fn){
    return (_.vr.type(fn) !== 'function')
      ? undefined
      : { name: _.fn.nameof(fn) || '(anonymous)',
          args: _.fn.argsof(fn),
          body: fn };
  }


  /* file.open :: FileList -> Object -> FileList
   *
   * Read all FileList's elements.
   *
   * == Image preview sample.
   *
   * <img type="file" id="f">
   *
   * $('#f').on('change', function(e){
   *   _.file.open(e.target.files, {
   *     onloadend: function(e){
   *       $(window).append('<img src="'+ e.target.result +'" alt="'+ e.target.file.name +'">');
   *     }
   *   });
   * });
   *
   */
  _.file.open = function(files, c){
    var fs = _.vr.valid(files, FileList) ? files : [files];
    for(var i = 0, f; f = fs[i]; i++){
      _.file.read(f, c);
    }
    return fs;
  }


  /* file.read :: File -> Object -> FileReader
   *
   * Simple wrapper for FileReader
   *
   * read(f, { method: 'dataURL', oncomplete: function(e){} });
   * > read as dataURL.
   */
  _.file.read = function(file, conf){
    var c = _.vr.valid(conf, 'object')
          ? _.ob.merge({type: 'dataURL'}, conf)
          : {type: 'dataURL'};
    var r = _.ob.merge(new FileReader, c);
    // Make accessable as e.target.file from callbacks.
    r.file = file;
    switch(c.method){
      case 'binary':
        r.readAsBinaryString(file); break;
      case 'dataURL':
        r.readAsDataURL(file); break;
      case 'text':
        r.readAsText(file); break;
      case 'array':
        r.readAsArrayBuffer(file); break;
      default:
        r.readAsDataURL(file); break;
    }
    return r;
  }


  _.event.create = function(ev, p){
    var evo = new CustomEvent(ev, (_.vr.valid(p, 'function') ? p(ev) : p));
    return evo;
  }


  _.event.bind = function(el, ev, c, p){

    var ei = new Object({
      type: ev
    , delegated: el
    , parameter: p
    });

    var fn = function(e){
      ei.origin = e;
      ei.target = el;
      c.call(c, ei);
    };

    ei.listener = fn;
    el.addEventListener(ev, fn);

    return ei;
  };


  /* unbind :: DOMElement -> Object
   *
   */
  _.event.unbind = function(el, evo){
    return (el.removeEventListener) && el.removeEventListener(evo.type, evo.listener);
  }


  /* event.trigger :: DOMElement -> String -> Object -> CustomEvent
   *
   */
  _.event.trigger = function(el, ev, p){
    var cl = _.event.create.apply(null, [ev, p]);
    el.dispatchEvent(cl);
    return cl;
  };




  _.dom.find = function(selector, el){
    var rt = (!_.vr.empty(el)?el:document).querySelector(_.html.escape_selector(selector));
    //_.dom.extend_node(rt);
    return rt;
  }


  /* html.query :: String -> Array
   *
   * return Array which converted from querySelectorAll result(s).
   *
   * ":", " " characters will be escaped.
   */
  _.dom.query = function(selector, el){
    var nl = (el||document).querySelectorAll(_.html.escape_selector(selector));
    //_.dom.extend_node_list(rt);
    var rt = [];
    for(var i =0, l=rt.length=nl.length; i<l; i++) rt[i]=nl[i];
    return rt;
  }


  _.dom.extend_node = function(node){
    if(node){
      var n = node[_._.namespace] = {};
      n.find = function(s){return _.dom.find(s, node)}
      n.query = function(s){return _.dom.query(s, node)}
    }
  }


  _.dom.extend_node_list = function(node_list){
    if(node_list){
      for(var i = 0; i < node_list.length; i++){
        _.html.extend_node(node_list[i]);
      }
      node_list.each = function(c){
        for(var i = 0; i < node_list.length; i++){
          c(node_list[i]);
        }
      }
    }
  }




  /* html.singletons :: Array
   *
   * !! DONT trust this.
   *
   * Return singleton HTML tag names
   *
   */
  _.html.singletons = function(){
    return [
      'meta', 'base', 'meta', 'param', 'isindex', 'link', 'basefont',
      'area', 'br', 'col', 'frame', 'hr', 'img', 'input'
    ];
  }


  _.html.escape_selector = function(selector){
    var es = new RegExp('([:| ])', 'g');
    return selector.replace(es, '\\$1');
  }


  /* html.regex :: String -> RegExp
   *
   * !! DONT trust this.
   *
   * This is not a HTML parser.
   * Only for html that has no same-elem-nests.
   *
   *** Available - Sorry, able to match simple 1 hier structure only.
   *
   * <div><p></p><img /></div>
   *
   *** Unavailable - CANT match propery below.
   *
   * <div><div><div></div><span></span><div><p></p></div>
   */
  _.html.regex = function(tag){
    var n,c,l;
    n = _.ar.has(_.html.singletons(), tag);
    c = l = (n ? '(.*?)>' : '<\\/'+tag+'>');
    (n) && (l = '');
    return new RegExp('<'+tag+'\\b[^<]*(?:(?!'+c+')<[^<]*)*'+l, 'gi');
  }


  /* html.trim :: String -> String -> String
   *
   * !! DONT trust this
   *
   * This uses html.regex method.
   */
  _.html.trim = function(html, tag){
    return html.replace(_.html.regex(tag), "");
  }

  // -- sandbox --------------------------------------------------------------



  // ----------------------------------------------------------------

  return _;

});