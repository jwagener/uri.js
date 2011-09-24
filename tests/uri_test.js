$(document).ready(function(){
  module("URI");
  
  test("from 'http://example.com/bla?abc=def#foo=bar'", function() {
    var originalUrl = 'http://example.com/bla?abc=def#foo=bar'
    var url = new URI(originalUrl);
    equals(url.scheme,   'http');
    equals(url.user,     null);
    equals(url.password, null);
    equals(url.host,     'example.com');
    equals(url.port,     null);
    equals(url.path,     '/bla');
    equals(url.query,    'abc=def');
    equals(url.fragment, 'foo=bar');
    equals(url.isRelative(), false);
    equals(url.isAbsolute(), true);
    equals(url.toString(), originalUrl);
  });
  
  test("from 'https://user:pass@127.0.0.1:342'", function() {
    var originalUrl = 'https://user:pass@127.0.0.1:342'
    var url = new URI(originalUrl);
    equals(url.scheme,   'https');
    equals(url.user,     'user');
    equals(url.password, 'pass');
    equals(url.host,     '127.0.0.1');
    equals(url.port,     342);
    equals(url.isRelative(), false);
    equals(url.isAbsolute(), true);    
    equals(url.toString(), originalUrl);
  });

  test("from '/someweird/path.js?q=1#f=2'", function() {
    var originalUrl = '/someweird/path.js?q=1#f=2'
    var url = new URI(originalUrl);
    equals(url.scheme,   null);
    equals(url.host,     null);
    equals(url.port,     null);
    equals(url.path,     '/someweird/path.js');
    equals(url.query,    'q=1');
    equals(url.fragment, 'f=2');
    equals(url.isRelative(), true);
    equals(url.isAbsolute(), false);
    equals(url.toString(), originalUrl);
  });
  
  test("from '/someweird/path.js?#f=2'", function() {
    var originalUrl = '/someweird/path.js?#f=2'
    var url = new URI(originalUrl);
    equals(url.scheme,   null);
    equals(url.host,     null);
    equals(url.port,     null);
    equals(url.path,     '/someweird/path.js');
    equals(url.query,    "");
    equals(url.fragment, 'f=2');
  });
  
  module("decodeParams");
  test("decodeParams", function(){
    var uri = new URI();
    deepEqual(
      uri.decodeParams("a[]=1&a[]=2"),
      {
        "a": ["1", "2"]
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
    equals(uri.encodeParams("already=Encoded"), "already=Encoded")
    deepEqual(
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
});