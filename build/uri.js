var URI;
var __hasProp = Object.prototype.hasOwnProperty;
URI = function(uri, options) {
  var AUTHORITY_REGEXP, URI_REGEXP, authority, authority_result, result, userinfo;
  if (uri == null) {
    uri = "";
  }
  if (options == null) {
    options = {};
  }
  URI_REGEXP = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
  AUTHORITY_REGEXP = /^(?:([^@]*)@)?([^:]*)(?::(\d*))?/;
  this.scheme = this.user = this.password = this.host = this.port = this.path = this.query = this.fragment = null;
  result = uri.match(URI_REGEXP);
  this.scheme = result[1];
  authority = result[2];
  if (authority != null) {
    authority_result = authority.match(AUTHORITY_REGEXP);
    userinfo = authority_result[1];
    if (userinfo != null) {
      this.user = userinfo.split(":")[0];
      this.password = userinfo.split(":")[1];
    }
    this.host = authority_result[2];
    this.port = parseInt(authority_result[3], 10) || null;
  }
  this.path = result[3];
  this.query = result[4];
  this.fragment = result[5];
  this.toString = function() {
    var str;
    str = "";
    if (this.isAbsolute()) {
      str += this.scheme;
      str += "://";
      if (this.user != null) {
        str += this.user + ":" + this.password + "@";
      }
      str += this.host;
      if (this.port != null) {
        str += ":" + this.port;
      }
    }
    str += this.path;
    if (this.query != null) {
      str += "?" + this.query;
    }
    if (this.fragment != null) {
      str += "#" + this.fragment;
    }
    return str;
  };
  this.isRelative = function() {
    return !this.isAbsolute();
  };
  this.isAbsolute = function() {
    return this.host != null;
  };
  this.decodeParams = function(string) {
    var key, params, part, splitted, value, _i, _len, _ref;
    if (string == null) {
      string = "";
    }
    params = {};
    _ref = string.split("&");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      splitted = part.split("=");
      key = decodeURIComponent(splitted[0]);
      value = decodeURIComponent(splitted[1] || '');
      this.normalizeParams(params, key, value);
    }
    return params;
  };
  this.normalizeParams = function(params, name, v) {
    var after, child_key, k, lastP, result_i;
    if (v == null) {
      v = NULL;
    }
    result = name.match(/^[\[\]]*([^\[\]]+)\]*(.*)/);
    k = result[1] || '';
    after = result[2] || '';
    if (after === "") {
      params[k] = v;
    } else if (after === "[]") {
      params[k] || (params[k] = []);
      params[k].push(v);
    } else if (result_i = after.match(/^\[\]\[([^\[\]]+)\]$/) || (result_i = after.match(/^\[\](.+)$/))) {
      child_key = result_i[1];
      params[k] || (params[k] = []);
      lastP = params[k][params[k].length - 1];
      if (((lastP != null) && lastP.constructor === Object) && !(lastP[child_key] != null)) {
        this.normalizeParams(lastP, child_key, v);
      } else {
        params[k].push(this.normalizeParams({}, child_key, v));
      }
    } else {
      params[k] || (params[k] = {});
      params[k] = this.normalizeParams(params[k], after, v);
    }
    return params;
  };
  this.encodeParams = function(params, prefix) {
    var key, paramString, prefixedKey, value, _i, _len;
    if (prefix == null) {
      prefix = '';
    }
    paramString = "";
    if (params === null) {
      if (prefix != null) {
        paramString += prefix;
      }
    } else if (params.constructor === Object) {
      for (key in params) {
        if (!__hasProp.call(params, key)) continue;
        value = params[key];
        if (prefix !== "") {
          prefixedKey = prefix + "[" + key + "]";
        } else {
          prefixedKey = key;
        }
        paramString += this.encodeParams(value, prefixedKey);
      }
    } else if (params.constructor === Array) {
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        value = params[_i];
        paramString += this.encodeParams(value, prefix + "[]");
      }
    } else {
      if (prefix !== '') {
        paramString = prefix + "=" + encodeURIComponent(params) + "&";
      } else {
        paramString = params;
      }
    }
    return paramString;
  };
  return this;
};