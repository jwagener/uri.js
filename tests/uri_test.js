$(document).ready(function(){
  module("URI");
  
  test("from 'http://example.com/bla?abc=def#foo=bar'", function() {
    var originalUrl = 'http://example.com/bla?abc=def#foo=bar'
    var url = new URI(originalUrl);
    equal(url.scheme,   'http');
    equal(url.user,     null);
    equal(url.password, null);
    equal(url.host,     'example.com');
    equal(url.port,     null);
    equal(url.path,     '/bla');
    equal(url.query,    'abc=def');
    equal(url.fragment, 'foo=bar');
    equal(url.isRelative(), false);
    equal(url.isAbsolute(), true);
    equal(url.toString(), originalUrl);
  });
  
  test("from 'https://user:pass@127.0.0.1:342'", function() {
    var originalUrl = 'https://user:pass@127.0.0.1:342'
    var url = new URI(originalUrl);
    equal(url.scheme,   'https');
    equal(url.user,     'user');
    equal(url.password, 'pass');
    equal(url.host,     '127.0.0.1');
    equal(url.port,     342);
    equal(url.isRelative(), false);
    equal(url.isAbsolute(), true);    
    equal(url.toString(), originalUrl);
  });

  test("from '/someweird/path.js?q=1#f=2'", function() {
    var originalUrl = '/someweird/path.js?q=1#f=2'
    var url = new URI(originalUrl);
    equal(url.scheme,   null);
    equal(url.host,     null);
    equal(url.port,     null);
    equal(url.path,     '/someweird/path.js');
    equal(url.query,    'q=1');
    equal(url.fragment, 'f=2');
    equal(url.isRelative(), true);
    equal(url.isAbsolute(), false);
    equal(url.toString(), originalUrl);
  });
  
  test("from '/someweird/path.js?#f=2'", function() {
    var originalUrl = '/someweird/path.js?#f=2'
    var url = new URI(originalUrl);
    equal(url.scheme,   null);
    equal(url.host,     null);
    equal(url.port,     null);
    equal(url.path,     '/someweird/path.js');
    equal(url.query,    null);
    equal(url.fragment, 'f=2');
  });
  
  test("from window.location", function() {
    var url = new URI(window.location);
    equal(url.toString(),   window.location.toString());
  });
  
  test("decodeQuery option", function(){
    var originalUrl = '/someweird/path.js?q=1#f=2'    
    var url = new URI(originalUrl, {decodeQuery: true});
    deepEqual(url.query, {'q': '1'});
  });

  test("decodeQuery without query", function(){
    var originalUrl = '/someweird/path.js'    
    var url = new URI(originalUrl, {decodeQuery: true, decodeFragment: true});
    deepEqual(url.query, {});
    deepEqual(url.fragment, {});
  });

  test("decodeFragment option", function(){
    var originalUrl = '/someweird/path.js?q=1#f=2'    
    var url = new URI(originalUrl, {decodeFragment: true});
    deepEqual(url.fragment, {'f': '2'});
  });

  test("toString() should encode query", function(){
    var uri = new URI("http://example.com")
    uri.query = {a: 1, b: [1,2,3], c: undefined}
    equal(uri.toString(), "http://example.com/?a=1&b[]=1&b[]=2&b[]=3&c");
  });

  module("decodeParams");
  test("decodeParams", function(){
    var uri = new URI();
    deepEqual(
      uri.decodeParams("a[]=This+is%20encoded+val&a[]=2"),
      {
        "a": ["This is encoded val", "2"]
      }
    );
    
    deepEqual(
      uri.decodeParams("foo=12%203&a[b][][id]=1&a[b][][id]=2&nope"),
      {
        "foo": "12 3",
        "a": {
          "b": [
            {"id": "1"},
            {"id": "2"}
          ]
        },
        "nope": ""
      }
    );
  });

  
  module("encodeParams");
  test("encodeParams", function(){
    var uri = new URI();
    equal(uri.encodeParams("already=Encoded"), "already=Encoded");
    equal(uri.encodeParams({a: 1, b: 2}), "a=1&b=2")
    equal(
      uri.encodeParams({
        "foo": "12 3",
        "a": {
          "b": [
            {"id": 1},
            {"id": 2}
          ]
        },
        "nope": null // is this what we want?
      }),
      "foo=12%203&a[b][][id]=1&a[b][][id]=2&nope"
    );
  });
  
  
  module("flattenParams");
  test("flattenParams", function(){
    var uri = new URI();
    deepEqual(
      uri.flattenParams({
        "foo": "12 3",
        "a": {
          "b": [
            {"id": 1},
            {"id": 2}
          ]
        },
        "nope": null // is this what we want?
      }),
      [
        ["foo",        "12 3"],
        ["a[b][][id]", 1],
        ["a[b][][id]", 2],
        ["nope",       null]
      ]
    );
  });
  
});
