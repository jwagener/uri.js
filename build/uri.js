var __hasProp = Object.prototype.hasOwnProperty;
window.URI = function(uri, options) {
  var AUTHORITY_REGEXP, URI_REGEXP;
  if (uri == null) {
    uri = "";
  }
  if (options == null) {
    options = {};
  }
  URI_REGEXP = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
  AUTHORITY_REGEXP = /^(?:([^@]*)@)?([^:]*)(?::(\d*))?/;
  this.scheme = this.user = this.password = this.host = this.port = this.path = this.query = this.fragment = null;
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
    if (this.path === "" && ((this.query != null) || (this.fragment != null))) {
      str += "/";
    }
    if (this.query != null) {
      str += this.encodeParamsWithPrepend(this.query, "?");
    }
    if (this.fragment != null) {
      str += this.encodeParamsWithPrepend(this.fragment, "#");
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
      if (part !== "") {
        splitted = part.split("=");
        key = decodeURIComponent(splitted[0]);
        value = decodeURIComponent(splitted[1] || '').replace(/\+/g, " ");
        this.normalizeParams(params, key, value);
      }
    }
    return params;
  };
  this.normalizeParams = function(params, name, v) {
    var after, child_key, k, lastP, result, result_i;
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
  this.encodeParamsWithPrepend = function(params, prepend) {
    var encoded;
    encoded = this.encodeParams(params);
    if (encoded !== "") {
      return prepend + encoded;
    } else {
      return "";
    }
  };
  this.encodeParams = function(params) {
    var flattened, key, keyValueStrings, kv, paramString, value, _i, _len;
    paramString = "";
    if (params.constructor === String) {
      return paramString = params;
    } else {
      flattened = this.flattenParams(params);
      keyValueStrings = [];
      for (_i = 0, _len = flattened.length; _i < _len; _i++) {
        kv = flattened[_i];
        key = kv[0];
        value = kv[1];
        if (value === null) {
          keyValueStrings.push(key);
        } else {
          keyValueStrings.push(key + "=" + encodeURIComponent(value));
        }
      }
      return paramString = keyValueStrings.join("&");
    }
  };
  this.flattenParams = function(params, prefix, paramsArray) {
    var key, prefixedKey, value, _i, _len;
    if (prefix == null) {
      prefix = '';
    }
    if (paramsArray == null) {
      paramsArray = [];
    }
    if (!(params != null)) {
      if (prefix != null) {
        paramsArray.push([prefix, null]);
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
        this.flattenParams(value, prefixedKey, paramsArray);
      }
    } else if (params.constructor === Array) {
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        value = params[_i];
        this.flattenParams(value, prefix + "[]", paramsArray);
      }
    } else if (prefix !== '') {
      paramsArray.push([prefix, params]);
    }
    return paramsArray;
  };
  this.parse = function(uri, options) {
    var authority, authority_result, nullIfBlank, result, userinfo;
    if (uri == null) {
      uri = "";
    }
    if (options == null) {
      options = {};
    }
    nullIfBlank = function(str) {
      if (str === "") {
        return null;
      } else {
        return str;
      }
    };
    result = uri.match(URI_REGEXP);
    this.scheme = nullIfBlank(result[1]);
    authority = result[2];
    if (authority != null) {
      authority_result = authority.match(AUTHORITY_REGEXP);
      userinfo = nullIfBlank(authority_result[1]);
      if (userinfo != null) {
        this.user = userinfo.split(":")[0];
        this.password = userinfo.split(":")[1];
      }
      this.host = nullIfBlank(authority_result[2]);
      this.port = parseInt(authority_result[3], 10) || null;
    }
    this.path = result[3];
    this.query = nullIfBlank(result[4]);
    if (options.decodeQuery) {
      this.query = this.decodeParams(this.query);
    }
    this.fragment = nullIfBlank(result[5]);
    if (options.decodeFragment) {
      return this.fragment = this.decodeParams(this.fragment);
    }
  };
  this.parse(uri.toString(), options);
  return this;
};