result = [
  FM.vr.validall([1, 2, 3], 'integer'),
  FM.vr.validall([2, 3, '4'], 'integer'),
  FM.vr.validall(['Foo', {bar: 1}, ['baz']], ['string', 'object', 'array'])
];
