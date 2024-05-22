var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __toCommonJS = (from) => {
  const moduleCache = __toCommonJS.moduleCache ??= new WeakMap;
  var cached = moduleCache.get(from);
  if (cached)
    return cached;
  var to = __defProp({}, "__esModule", { value: true });
  var desc = { enumerable: false };
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  moduleCache.set(from, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// node_modules/universal-user-agent/dist-web/index.js
var getUserAgent;
var init_dist_web = __esm(() => {
  getUserAgent = function() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
      return navigator.userAgent;
    }
    if (typeof process === "object" && process.version !== undefined) {
      return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
  };
});

// node_modules/before-after-hook/lib/register.js
var require_register = __commonJS((exports, module) => {
  var register = function(state, name, method, options) {
    if (typeof method !== "function") {
      throw new Error("method for before hook must be a function");
    }
    if (!options) {
      options = {};
    }
    if (Array.isArray(name)) {
      return name.reverse().reduce(function(callback, name2) {
        return register.bind(null, state, name2, callback, options);
      }, method)();
    }
    return Promise.resolve().then(function() {
      if (!state.registry[name]) {
        return method(options);
      }
      return state.registry[name].reduce(function(method2, registered) {
        return registered.hook.bind(null, method2, options);
      }, method)();
    });
  };
  module.exports = register;
});

// node_modules/before-after-hook/lib/add.js
var require_add = __commonJS((exports, module) => {
  var addHook = function(state, kind, name, hook) {
    var orig = hook;
    if (!state.registry[name]) {
      state.registry[name] = [];
    }
    if (kind === "before") {
      hook = function(method, options) {
        return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
      };
    }
    if (kind === "after") {
      hook = function(method, options) {
        var result;
        return Promise.resolve().then(method.bind(null, options)).then(function(result_) {
          result = result_;
          return orig(result, options);
        }).then(function() {
          return result;
        });
      };
    }
    if (kind === "error") {
      hook = function(method, options) {
        return Promise.resolve().then(method.bind(null, options)).catch(function(error) {
          return orig(error, options);
        });
      };
    }
    state.registry[name].push({
      hook,
      orig
    });
  };
  module.exports = addHook;
});

// node_modules/before-after-hook/lib/remove.js
var require_remove = __commonJS((exports, module) => {
  var removeHook = function(state, name, method) {
    if (!state.registry[name]) {
      return;
    }
    var index = state.registry[name].map(function(registered) {
      return registered.orig;
    }).indexOf(method);
    if (index === -1) {
      return;
    }
    state.registry[name].splice(index, 1);
  };
  module.exports = removeHook;
});

// node_modules/before-after-hook/index.js
var require_before_after_hook = __commonJS((exports, module) => {
  var bindApi = function(hook, state, name) {
    var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state]);
    hook.api = { remove: removeHookRef };
    hook.remove = removeHookRef;
    ["before", "error", "after", "wrap"].forEach(function(kind) {
      var args = name ? [state, kind, name] : [state, kind];
      hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
    });
  };
  var HookSingular = function() {
    var singularHookName = "h";
    var singularHookState = {
      registry: {}
    };
    var singularHook = register.bind(null, singularHookState, singularHookName);
    bindApi(singularHook, singularHookState, singularHookName);
    return singularHook;
  };
  var HookCollection = function() {
    var state = {
      registry: {}
    };
    var hook = register.bind(null, state);
    bindApi(hook, state);
    return hook;
  };
  var Hook = function() {
    if (!collectionHookDeprecationMessageDisplayed) {
      console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
      collectionHookDeprecationMessageDisplayed = true;
    }
    return HookCollection();
  };
  var register = require_register();
  var addHook = require_add();
  var removeHook = require_remove();
  var bind = Function.bind;
  var bindable = bind.bind(bind);
  var collectionHookDeprecationMessageDisplayed = false;
  Hook.Singular = HookSingular.bind();
  Hook.Collection = HookCollection.bind();
  module.exports = Hook;
  module.exports.Hook = Hook;
  module.exports.Singular = Hook.Singular;
  module.exports.Collection = Hook.Collection;
});

// node_modules/is-plain-object/dist/is-plain-object.mjs
var isObject, isPlainObject;
var init_is_plain_object = __esm(() => {
  isObject = function(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  };
  isPlainObject = function(o) {
    var ctor, prot;
    if (isObject(o) === false)
      return false;
    ctor = o.constructor;
    if (ctor === undefined)
      return true;
    prot = ctor.prototype;
    if (isObject(prot) === false)
      return false;
    if (prot.hasOwnProperty("isPrototypeOf") === false) {
      return false;
    }
    return true;
  };
  /*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
});

// node_modules/@octokit/endpoint/dist-web/index.js
var lowercaseKeys, mergeDeep, removeUndefinedProperties, merge, addQueryParameters, removeNonChars, extractUrlVariableNames, omit, encodeReserved, encodeUnreserved, encodeValue, isDefined, isKeyOperator, getValues, parseUrl, expand, parse, endpointWithDefaults, withDefaults, urlVariableRegex, VERSION, userAgent, DEFAULTS, endpoint;
var init_dist_web2 = __esm(() => {
  init_is_plain_object();
  init_dist_web();
  lowercaseKeys = function(object) {
    if (!object) {
      return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = object[key];
      return newObj;
    }, {});
  };
  mergeDeep = function(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key) => {
      if (isPlainObject(options[key])) {
        if (!(key in defaults))
          Object.assign(result, { [key]: options[key] });
        else
          result[key] = mergeDeep(defaults[key], options[key]);
      } else {
        Object.assign(result, { [key]: options[key] });
      }
    });
    return result;
  };
  removeUndefinedProperties = function(obj) {
    for (const key in obj) {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    }
    return obj;
  };
  merge = function(defaults, route, options) {
    if (typeof route === "string") {
      let [method, url] = route.split(" ");
      options = Object.assign(url ? { method, url } : { url: method }, options);
    } else {
      options = Object.assign({}, route);
    }
    options.headers = lowercaseKeys(options.headers);
    removeUndefinedProperties(options);
    removeUndefinedProperties(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    if (defaults && defaults.mediaType.previews.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter((preview) => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
    return mergedOptions;
  };
  addQueryParameters = function(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
      return url;
    }
    return url + separator + names.map((name) => {
      if (name === "q") {
        return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
      }
      return `${name}=${encodeURIComponent(parameters[name])}`;
    }).join("&");
  };
  removeNonChars = function(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
  };
  extractUrlVariableNames = function(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
      return [];
    }
    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
  };
  omit = function(object, keysToOmit) {
    return Object.keys(object).filter((option) => !keysToOmit.includes(option)).reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  };
  encodeReserved = function(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
      }
      return part;
    }).join("");
  };
  encodeUnreserved = function(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  };
  encodeValue = function(operator, value, key) {
    value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
    if (key) {
      return encodeUnreserved(key) + "=" + value;
    } else {
      return value;
    }
  };
  isDefined = function(value) {
    return value !== undefined && value !== null;
  };
  isKeyOperator = function(operator) {
    return operator === ";" || operator === "&" || operator === "?";
  };
  getValues = function(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        value = value.toString();
        if (modifier && modifier !== "*") {
          value = value.substring(0, parseInt(modifier, 10));
        }
        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
      } else {
        if (modifier === "*") {
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function(value2) {
              result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
            });
          } else {
            Object.keys(value).forEach(function(k) {
              if (isDefined(value[k])) {
                result.push(encodeValue(operator, value[k], k));
              }
            });
          }
        } else {
          const tmp = [];
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function(value2) {
              tmp.push(encodeValue(operator, value2));
            });
          } else {
            Object.keys(value).forEach(function(k) {
              if (isDefined(value[k])) {
                tmp.push(encodeUnreserved(k));
                tmp.push(encodeValue(operator, value[k].toString()));
              }
            });
          }
          if (isKeyOperator(operator)) {
            result.push(encodeUnreserved(key) + "=" + tmp.join(","));
          } else if (tmp.length !== 0) {
            result.push(tmp.join(","));
          }
        }
      }
    } else {
      if (operator === ";") {
        if (isDefined(value)) {
          result.push(encodeUnreserved(key));
        }
      } else if (value === "" && (operator === "&" || operator === "?")) {
        result.push(encodeUnreserved(key) + "=");
      } else if (value === "") {
        result.push("");
      }
    }
    return result;
  };
  parseUrl = function(template) {
    return {
      expand: expand.bind(null, template)
    };
  };
  expand = function(template, context) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    });
  };
  parse = function(options) {
    let method = options.method.toUpperCase();
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, [
      "method",
      "baseUrl",
      "url",
      "headers",
      "request",
      "mediaType"
    ]);
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
      url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
      if (options.mediaType.format) {
        headers.accept = headers.accept.split(/,/).map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd\$1\$2.${options.mediaType.format}`)).join(",");
      }
      if (options.mediaType.previews.length) {
        const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
    if (["GET", "HEAD"].includes(method)) {
      url = addQueryParameters(url, remainingParameters);
    } else {
      if ("data" in remainingParameters) {
        body = remainingParameters.data;
      } else {
        if (Object.keys(remainingParameters).length) {
          body = remainingParameters;
        }
      }
    }
    if (!headers["content-type"] && typeof body !== "undefined") {
      headers["content-type"] = "application/json; charset=utf-8";
    }
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
      body = "";
    }
    return Object.assign({ method, url, headers }, typeof body !== "undefined" ? { body } : null, options.request ? { request: options.request } : null);
  };
  endpointWithDefaults = function(defaults, route, options) {
    return parse(merge(defaults, route, options));
  };
  withDefaults = function(oldDefaults, newDefaults) {
    const DEFAULTS2 = merge(oldDefaults, newDefaults);
    const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
    return Object.assign(endpoint2, {
      DEFAULTS: DEFAULTS2,
      defaults: withDefaults.bind(null, DEFAULTS2),
      merge: merge.bind(null, DEFAULTS2),
      parse
    });
  };
  urlVariableRegex = /\{[^}]+\}/g;
  VERSION = "7.0.6";
  userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
  DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent
    },
    mediaType: {
      format: "",
      previews: []
    }
  };
  endpoint = withDefaults(null, DEFAULTS);
});

// node_modules/node-fetch/browser.js
var require_browser = __commonJS((exports, module) => {
  var getGlobal = function() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("unable to locate global object");
  };
  var globalObject = getGlobal();
  module.exports = exports = globalObject.fetch;
  if (globalObject.fetch) {
    exports.default = globalObject.fetch.bind(globalObject);
  }
  exports.Headers = globalObject.Headers;
  exports.Request = globalObject.Request;
  exports.Response = globalObject.Response;
});

// node_modules/deprecation/dist-web/index.js
class Deprecation extends Error {
  constructor(message) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "Deprecation";
  }
}
var init_dist_web3 = __esm(() => {
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS((exports, module) => {
  var wrappy = function(fn, cb) {
    if (fn && cb)
      return wrappy(fn)(cb);
    if (typeof fn !== "function")
      throw new TypeError("need wrapper function");
    Object.keys(fn).forEach(function(k) {
      wrapper[k] = fn[k];
    });
    return wrapper;
    function wrapper() {
      var args = new Array(arguments.length);
      for (var i = 0;i < args.length; i++) {
        args[i] = arguments[i];
      }
      var ret = fn.apply(this, args);
      var cb2 = args[args.length - 1];
      if (typeof ret === "function" && ret !== cb2) {
        Object.keys(cb2).forEach(function(k) {
          ret[k] = cb2[k];
        });
      }
      return ret;
    }
  };
  module.exports = wrappy;
});

// node_modules/once/once.js
var require_once = __commonJS((exports, module) => {
  var once = function(fn) {
    var f = function() {
      if (f.called)
        return f.value;
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    f.called = false;
    return f;
  };
  var onceStrict = function(fn) {
    var f = function() {
      if (f.called)
        throw new Error(f.onceError);
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    var name = fn.name || "Function wrapped with `once`";
    f.onceError = name + " shouldn't be called more than once";
    f.called = false;
    return f;
  };
  var wrappy = require_wrappy();
  module.exports = wrappy(once);
  module.exports.strict = wrappy(onceStrict);
  once.proto = once(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: function() {
        return once(this);
      },
      configurable: true
    });
    Object.defineProperty(Function.prototype, "onceStrict", {
      value: function() {
        return onceStrict(this);
      },
      configurable: true
    });
  });
});

// node_modules/@octokit/request-error/dist-web/index.js
class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "HttpError";
    this.status = statusCode;
    let headers;
    if ("headers" in options && typeof options.headers !== "undefined") {
      headers = options.headers;
    }
    if ("response" in options) {
      this.response = options.response;
      headers = options.response.headers;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
    Object.defineProperty(this, "code", {
      get() {
        logOnceCode(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }
    });
    Object.defineProperty(this, "headers", {
      get() {
        logOnceHeaders(new Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."));
        return headers || {};
      }
    });
  }
}
var import_once, logOnceCode, logOnceHeaders;
var init_dist_web4 = __esm(() => {
  init_dist_web3();
  import_once = __toESM(require_once(), 1);
  logOnceCode = import_once.default((deprecation) => console.warn(deprecation));
  logOnceHeaders = import_once.default((deprecation) => console.warn(deprecation));
});

// node_modules/@octokit/request/dist-web/index.js
var exports_dist_web = {};
__export(exports_dist_web, {
  request: () => {
    {
      return request;
    }
  }
});
async function getResponseData(response) {
  const contentType = response.headers.get("content-type");
  if (/application\/json/.test(contentType)) {
    return response.json();
  }
  if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
    return response.text();
  }
  return getBufferResponse(response);
}
var import_node_fetch, getBufferResponse, fetchWrapper, toErrorMessage, withDefaults2, VERSION2, request;
var init_dist_web5 = __esm(() => {
  init_dist_web2();
  init_dist_web();
  init_is_plain_object();
  import_node_fetch = __toESM(require_browser(), 1);
  init_dist_web4();
  getBufferResponse = function(response) {
    return response.arrayBuffer();
  };
  fetchWrapper = function(requestOptions) {
    const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;
    if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch = requestOptions.request && requestOptions.request.fetch || globalThis.fetch || import_node_fetch.default;
    return fetch(requestOptions.url, Object.assign({
      method: requestOptions.method,
      body: requestOptions.body,
      headers: requestOptions.headers,
      redirect: requestOptions.redirect,
      ...requestOptions.body && { duplex: "half" }
    }, requestOptions.request)).then(async (response) => {
      url = response.url;
      status = response.status;
      for (const keyAndValue of response.headers) {
        headers[keyAndValue[0]] = keyAndValue[1];
      }
      if ("deprecation" in headers) {
        const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
        const deprecationLink = matches && matches.pop();
        log.warn(`[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`);
      }
      if (status === 204 || status === 205) {
        return;
      }
      if (requestOptions.method === "HEAD") {
        if (status < 400) {
          return;
        }
        throw new RequestError(response.statusText, status, {
          response: {
            url,
            status,
            headers,
            data: undefined
          },
          request: requestOptions
        });
      }
      if (status === 304) {
        throw new RequestError("Not modified", status, {
          response: {
            url,
            status,
            headers,
            data: await getResponseData(response)
          },
          request: requestOptions
        });
      }
      if (status >= 400) {
        const data = await getResponseData(response);
        const error = new RequestError(toErrorMessage(data), status, {
          response: {
            url,
            status,
            headers,
            data
          },
          request: requestOptions
        });
        throw error;
      }
      return getResponseData(response);
    }).then((data) => {
      return {
        status,
        url,
        headers,
        data
      };
    }).catch((error) => {
      if (error instanceof RequestError)
        throw error;
      else if (error.name === "AbortError")
        throw error;
      throw new RequestError(error.message, 500, {
        request: requestOptions
      });
    });
  };
  toErrorMessage = function(data) {
    if (typeof data === "string")
      return data;
    if ("message" in data) {
      if (Array.isArray(data.errors)) {
        return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}`;
      }
      return data.message;
    }
    return `Unknown error: ${JSON.stringify(data)}`;
  };
  withDefaults2 = function(oldEndpoint, newDefaults) {
    const endpoint22 = oldEndpoint.defaults(newDefaults);
    const newApi = function(route, parameters) {
      const endpointOptions = endpoint22.merge(route, parameters);
      if (!endpointOptions.request || !endpointOptions.request.hook) {
        return fetchWrapper(endpoint22.parse(endpointOptions));
      }
      const request2 = (route2, parameters2) => {
        return fetchWrapper(endpoint22.parse(endpoint22.merge(route2, parameters2)));
      };
      Object.assign(request2, {
        endpoint: endpoint22,
        defaults: withDefaults2.bind(null, endpoint22)
      });
      return endpointOptions.request.hook(request2, endpointOptions);
    };
    return Object.assign(newApi, {
      endpoint: endpoint22,
      defaults: withDefaults2.bind(null, endpoint22)
    });
  };
  VERSION2 = "6.2.8";
  request = withDefaults2(endpoint, {
    headers: {
      "user-agent": `octokit-request.js/${VERSION2} ${getUserAgent()}`
    }
  });
});

// node_modules/@octokit/auth-token/dist-web/index.js
var exports_dist_web2 = {};
__export(exports_dist_web2, {
  createTokenAuth: () => {
    {
      return createTokenAuth;
    }
  }
});
async function auth(token) {
  const isApp = token.split(/\./).length === 3;
  const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) || REGEX_IS_INSTALLATION.test(token);
  const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
  const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
  return {
    type: "token",
    token,
    tokenType
  };
}
async function hook(token, request3, route, parameters) {
  const endpoint3 = request3.endpoint.merge(route, parameters);
  endpoint3.headers.authorization = withAuthorizationPrefix(token);
  return request3(endpoint3);
}
var withAuthorizationPrefix, REGEX_IS_INSTALLATION_LEGACY, REGEX_IS_INSTALLATION, REGEX_IS_USER_TO_SERVER, createTokenAuth;
var init_dist_web6 = __esm(() => {
  withAuthorizationPrefix = function(token) {
    if (token.split(/\./).length === 3) {
      return `bearer ${token}`;
    }
    return `token ${token}`;
  };
  REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
  REGEX_IS_INSTALLATION = /^ghs_/;
  REGEX_IS_USER_TO_SERVER = /^ghu_/;
  createTokenAuth = function createTokenAuth2(token) {
    if (!token) {
      throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
      throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
      hook: hook.bind(null, token)
    });
  };
});

// node_modules/bottleneck/light.js
var require_light = __commonJS((exports, module) => {
  (function(global2, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.Bottleneck = factory();
  })(exports, function() {
    var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    function getCjsExportFromNamespace(n) {
      return n && n["default"] || n;
    }
    var load = function(received, defaults, onto = {}) {
      var k, ref, v;
      for (k in defaults) {
        v = defaults[k];
        onto[k] = (ref = received[k]) != null ? ref : v;
      }
      return onto;
    };
    var overwrite = function(received, defaults, onto = {}) {
      var k, v;
      for (k in received) {
        v = received[k];
        if (defaults[k] !== undefined) {
          onto[k] = v;
        }
      }
      return onto;
    };
    var parser = {
      load,
      overwrite
    };
    var DLList;
    DLList = class DLList2 {
      constructor(incr, decr) {
        this.incr = incr;
        this.decr = decr;
        this._first = null;
        this._last = null;
        this.length = 0;
      }
      push(value) {
        var node;
        this.length++;
        if (typeof this.incr === "function") {
          this.incr();
        }
        node = {
          value,
          prev: this._last,
          next: null
        };
        if (this._last != null) {
          this._last.next = node;
          this._last = node;
        } else {
          this._first = this._last = node;
        }
        return;
      }
      shift() {
        var value;
        if (this._first == null) {
          return;
        } else {
          this.length--;
          if (typeof this.decr === "function") {
            this.decr();
          }
        }
        value = this._first.value;
        if ((this._first = this._first.next) != null) {
          this._first.prev = null;
        } else {
          this._last = null;
        }
        return value;
      }
      first() {
        if (this._first != null) {
          return this._first.value;
        }
      }
      getArray() {
        var node, ref, results;
        node = this._first;
        results = [];
        while (node != null) {
          results.push((ref = node, node = node.next, ref.value));
        }
        return results;
      }
      forEachShift(cb) {
        var node;
        node = this.shift();
        while (node != null) {
          cb(node), node = this.shift();
        }
        return;
      }
      debug() {
        var node, ref, ref1, ref2, results;
        node = this._first;
        results = [];
        while (node != null) {
          results.push((ref = node, node = node.next, {
            value: ref.value,
            prev: (ref1 = ref.prev) != null ? ref1.value : undefined,
            next: (ref2 = ref.next) != null ? ref2.value : undefined
          }));
        }
        return results;
      }
    };
    var DLList_1 = DLList;
    var Events;
    Events = class Events2 {
      constructor(instance) {
        this.instance = instance;
        this._events = {};
        if (this.instance.on != null || this.instance.once != null || this.instance.removeAllListeners != null) {
          throw new Error("An Emitter already exists for this object");
        }
        this.instance.on = (name, cb) => {
          return this._addListener(name, "many", cb);
        };
        this.instance.once = (name, cb) => {
          return this._addListener(name, "once", cb);
        };
        this.instance.removeAllListeners = (name = null) => {
          if (name != null) {
            return delete this._events[name];
          } else {
            return this._events = {};
          }
        };
      }
      _addListener(name, status, cb) {
        var base;
        if ((base = this._events)[name] == null) {
          base[name] = [];
        }
        this._events[name].push({ cb, status });
        return this.instance;
      }
      listenerCount(name) {
        if (this._events[name] != null) {
          return this._events[name].length;
        } else {
          return 0;
        }
      }
      async trigger(name, ...args) {
        var e, promises;
        try {
          if (name !== "debug") {
            this.trigger("debug", `Event triggered: ${name}`, args);
          }
          if (this._events[name] == null) {
            return;
          }
          this._events[name] = this._events[name].filter(function(listener) {
            return listener.status !== "none";
          });
          promises = this._events[name].map(async (listener) => {
            var e2, returned;
            if (listener.status === "none") {
              return;
            }
            if (listener.status === "once") {
              listener.status = "none";
            }
            try {
              returned = typeof listener.cb === "function" ? listener.cb(...args) : undefined;
              if (typeof (returned != null ? returned.then : undefined) === "function") {
                return await returned;
              } else {
                return returned;
              }
            } catch (error) {
              e2 = error;
              {
                this.trigger("error", e2);
              }
              return null;
            }
          });
          return (await Promise.all(promises)).find(function(x) {
            return x != null;
          });
        } catch (error) {
          e = error;
          {
            this.trigger("error", e);
          }
          return null;
        }
      }
    };
    var Events_1 = Events;
    var DLList$1, Events$1, Queues;
    DLList$1 = DLList_1;
    Events$1 = Events_1;
    Queues = class Queues2 {
      constructor(num_priorities) {
        var i;
        this.Events = new Events$1(this);
        this._length = 0;
        this._lists = function() {
          var j, ref, results;
          results = [];
          for (i = j = 1, ref = num_priorities;1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
            results.push(new DLList$1(() => {
              return this.incr();
            }, () => {
              return this.decr();
            }));
          }
          return results;
        }.call(this);
      }
      incr() {
        if (this._length++ === 0) {
          return this.Events.trigger("leftzero");
        }
      }
      decr() {
        if (--this._length === 0) {
          return this.Events.trigger("zero");
        }
      }
      push(job) {
        return this._lists[job.options.priority].push(job);
      }
      queued(priority) {
        if (priority != null) {
          return this._lists[priority].length;
        } else {
          return this._length;
        }
      }
      shiftAll(fn) {
        return this._lists.forEach(function(list) {
          return list.forEachShift(fn);
        });
      }
      getFirst(arr = this._lists) {
        var j, len, list;
        for (j = 0, len = arr.length;j < len; j++) {
          list = arr[j];
          if (list.length > 0) {
            return list;
          }
        }
        return [];
      }
      shiftLastFrom(priority) {
        return this.getFirst(this._lists.slice(priority).reverse()).shift();
      }
    };
    var Queues_1 = Queues;
    var BottleneckError;
    BottleneckError = class BottleneckError2 extends Error {
    };
    var BottleneckError_1 = BottleneckError;
    var BottleneckError$1, DEFAULT_PRIORITY, Job, NUM_PRIORITIES, parser$1;
    NUM_PRIORITIES = 10;
    DEFAULT_PRIORITY = 5;
    parser$1 = parser;
    BottleneckError$1 = BottleneckError_1;
    Job = class Job2 {
      constructor(task, args, options, jobDefaults, rejectOnDrop, Events2, _states, Promise2) {
        this.task = task;
        this.args = args;
        this.rejectOnDrop = rejectOnDrop;
        this.Events = Events2;
        this._states = _states;
        this.Promise = Promise2;
        this.options = parser$1.load(options, jobDefaults);
        this.options.priority = this._sanitizePriority(this.options.priority);
        if (this.options.id === jobDefaults.id) {
          this.options.id = `${this.options.id}-${this._randomIndex()}`;
        }
        this.promise = new this.Promise((_resolve, _reject) => {
          this._resolve = _resolve;
          this._reject = _reject;
        });
        this.retryCount = 0;
      }
      _sanitizePriority(priority) {
        var sProperty;
        sProperty = ~~priority !== priority ? DEFAULT_PRIORITY : priority;
        if (sProperty < 0) {
          return 0;
        } else if (sProperty > NUM_PRIORITIES - 1) {
          return NUM_PRIORITIES - 1;
        } else {
          return sProperty;
        }
      }
      _randomIndex() {
        return Math.random().toString(36).slice(2);
      }
      doDrop({ error, message = "This job has been dropped by Bottleneck" } = {}) {
        if (this._states.remove(this.options.id)) {
          if (this.rejectOnDrop) {
            this._reject(error != null ? error : new BottleneckError$1(message));
          }
          this.Events.trigger("dropped", { args: this.args, options: this.options, task: this.task, promise: this.promise });
          return true;
        } else {
          return false;
        }
      }
      _assertStatus(expected) {
        var status;
        status = this._states.jobStatus(this.options.id);
        if (!(status === expected || expected === "DONE" && status === null)) {
          throw new BottleneckError$1(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
        }
      }
      doReceive() {
        this._states.start(this.options.id);
        return this.Events.trigger("received", { args: this.args, options: this.options });
      }
      doQueue(reachedHWM, blocked) {
        this._assertStatus("RECEIVED");
        this._states.next(this.options.id);
        return this.Events.trigger("queued", { args: this.args, options: this.options, reachedHWM, blocked });
      }
      doRun() {
        if (this.retryCount === 0) {
          this._assertStatus("QUEUED");
          this._states.next(this.options.id);
        } else {
          this._assertStatus("EXECUTING");
        }
        return this.Events.trigger("scheduled", { args: this.args, options: this.options });
      }
      async doExecute(chained, clearGlobalState, run, free) {
        var error, eventInfo, passed;
        if (this.retryCount === 0) {
          this._assertStatus("RUNNING");
          this._states.next(this.options.id);
        } else {
          this._assertStatus("EXECUTING");
        }
        eventInfo = { args: this.args, options: this.options, retryCount: this.retryCount };
        this.Events.trigger("executing", eventInfo);
        try {
          passed = await (chained != null ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args));
          if (clearGlobalState()) {
            this.doDone(eventInfo);
            await free(this.options, eventInfo);
            this._assertStatus("DONE");
            return this._resolve(passed);
          }
        } catch (error1) {
          error = error1;
          return this._onFailure(error, eventInfo, clearGlobalState, run, free);
        }
      }
      doExpire(clearGlobalState, run, free) {
        var error, eventInfo;
        if (this._states.jobStatus(this.options.id === "RUNNING")) {
          this._states.next(this.options.id);
        }
        this._assertStatus("EXECUTING");
        eventInfo = { args: this.args, options: this.options, retryCount: this.retryCount };
        error = new BottleneckError$1(`This job timed out after ${this.options.expiration} ms.`);
        return this._onFailure(error, eventInfo, clearGlobalState, run, free);
      }
      async _onFailure(error, eventInfo, clearGlobalState, run, free) {
        var retry, retryAfter;
        if (clearGlobalState()) {
          retry = await this.Events.trigger("failed", error, eventInfo);
          if (retry != null) {
            retryAfter = ~~retry;
            this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo);
            this.retryCount++;
            return run(retryAfter);
          } else {
            this.doDone(eventInfo);
            await free(this.options, eventInfo);
            this._assertStatus("DONE");
            return this._reject(error);
          }
        }
      }
      doDone(eventInfo) {
        this._assertStatus("EXECUTING");
        this._states.next(this.options.id);
        return this.Events.trigger("done", eventInfo);
      }
    };
    var Job_1 = Job;
    var BottleneckError$2, LocalDatastore, parser$2;
    parser$2 = parser;
    BottleneckError$2 = BottleneckError_1;
    LocalDatastore = class LocalDatastore2 {
      constructor(instance, storeOptions, storeInstanceOptions) {
        this.instance = instance;
        this.storeOptions = storeOptions;
        this.clientId = this.instance._randomIndex();
        parser$2.load(storeInstanceOptions, storeInstanceOptions, this);
        this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now();
        this._running = 0;
        this._done = 0;
        this._unblockTime = 0;
        this.ready = this.Promise.resolve();
        this.clients = {};
        this._startHeartbeat();
      }
      _startHeartbeat() {
        var base;
        if (this.heartbeat == null && (this.storeOptions.reservoirRefreshInterval != null && this.storeOptions.reservoirRefreshAmount != null || this.storeOptions.reservoirIncreaseInterval != null && this.storeOptions.reservoirIncreaseAmount != null)) {
          return typeof (base = this.heartbeat = setInterval(() => {
            var amount, incr, maximum, now, reservoir;
            now = Date.now();
            if (this.storeOptions.reservoirRefreshInterval != null && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval) {
              this._lastReservoirRefresh = now;
              this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount;
              this.instance._drainAll(this.computeCapacity());
            }
            if (this.storeOptions.reservoirIncreaseInterval != null && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
              ({
                reservoirIncreaseAmount: amount,
                reservoirIncreaseMaximum: maximum,
                reservoir
              } = this.storeOptions);
              this._lastReservoirIncrease = now;
              incr = maximum != null ? Math.min(amount, maximum - reservoir) : amount;
              if (incr > 0) {
                this.storeOptions.reservoir += incr;
                return this.instance._drainAll(this.computeCapacity());
              }
            }
          }, this.heartbeatInterval)).unref === "function" ? base.unref() : undefined;
        } else {
          return clearInterval(this.heartbeat);
        }
      }
      async __publish__(message) {
        await this.yieldLoop();
        return this.instance.Events.trigger("message", message.toString());
      }
      async __disconnect__(flush) {
        await this.yieldLoop();
        clearInterval(this.heartbeat);
        return this.Promise.resolve();
      }
      yieldLoop(t = 0) {
        return new this.Promise(function(resolve, reject) {
          return setTimeout(resolve, t);
        });
      }
      computePenalty() {
        var ref;
        return (ref = this.storeOptions.penalty) != null ? ref : 15 * this.storeOptions.minTime || 5000;
      }
      async __updateSettings__(options) {
        await this.yieldLoop();
        parser$2.overwrite(options, options, this.storeOptions);
        this._startHeartbeat();
        this.instance._drainAll(this.computeCapacity());
        return true;
      }
      async __running__() {
        await this.yieldLoop();
        return this._running;
      }
      async __queued__() {
        await this.yieldLoop();
        return this.instance.queued();
      }
      async __done__() {
        await this.yieldLoop();
        return this._done;
      }
      async __groupCheck__(time) {
        await this.yieldLoop();
        return this._nextRequest + this.timeout < time;
      }
      computeCapacity() {
        var maxConcurrent, reservoir;
        ({ maxConcurrent, reservoir } = this.storeOptions);
        if (maxConcurrent != null && reservoir != null) {
          return Math.min(maxConcurrent - this._running, reservoir);
        } else if (maxConcurrent != null) {
          return maxConcurrent - this._running;
        } else if (reservoir != null) {
          return reservoir;
        } else {
          return null;
        }
      }
      conditionsCheck(weight) {
        var capacity;
        capacity = this.computeCapacity();
        return capacity == null || weight <= capacity;
      }
      async __incrementReservoir__(incr) {
        var reservoir;
        await this.yieldLoop();
        reservoir = this.storeOptions.reservoir += incr;
        this.instance._drainAll(this.computeCapacity());
        return reservoir;
      }
      async __currentReservoir__() {
        await this.yieldLoop();
        return this.storeOptions.reservoir;
      }
      isBlocked(now) {
        return this._unblockTime >= now;
      }
      check(weight, now) {
        return this.conditionsCheck(weight) && this._nextRequest - now <= 0;
      }
      async __check__(weight) {
        var now;
        await this.yieldLoop();
        now = Date.now();
        return this.check(weight, now);
      }
      async __register__(index, weight, expiration) {
        var now, wait;
        await this.yieldLoop();
        now = Date.now();
        if (this.conditionsCheck(weight)) {
          this._running += weight;
          if (this.storeOptions.reservoir != null) {
            this.storeOptions.reservoir -= weight;
          }
          wait = Math.max(this._nextRequest - now, 0);
          this._nextRequest = now + wait + this.storeOptions.minTime;
          return {
            success: true,
            wait,
            reservoir: this.storeOptions.reservoir
          };
        } else {
          return {
            success: false
          };
        }
      }
      strategyIsBlock() {
        return this.storeOptions.strategy === 3;
      }
      async __submit__(queueLength, weight) {
        var blocked, now, reachedHWM;
        await this.yieldLoop();
        if (this.storeOptions.maxConcurrent != null && weight > this.storeOptions.maxConcurrent) {
          throw new BottleneckError$2(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
        }
        now = Date.now();
        reachedHWM = this.storeOptions.highWater != null && queueLength === this.storeOptions.highWater && !this.check(weight, now);
        blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now));
        if (blocked) {
          this._unblockTime = now + this.computePenalty();
          this._nextRequest = this._unblockTime + this.storeOptions.minTime;
          this.instance._dropAllQueued();
        }
        return {
          reachedHWM,
          blocked,
          strategy: this.storeOptions.strategy
        };
      }
      async __free__(index, weight) {
        await this.yieldLoop();
        this._running -= weight;
        this._done += weight;
        this.instance._drainAll(this.computeCapacity());
        return {
          running: this._running
        };
      }
    };
    var LocalDatastore_1 = LocalDatastore;
    var BottleneckError$3, States;
    BottleneckError$3 = BottleneckError_1;
    States = class States2 {
      constructor(status1) {
        this.status = status1;
        this._jobs = {};
        this.counts = this.status.map(function() {
          return 0;
        });
      }
      next(id) {
        var current, next;
        current = this._jobs[id];
        next = current + 1;
        if (current != null && next < this.status.length) {
          this.counts[current]--;
          this.counts[next]++;
          return this._jobs[id]++;
        } else if (current != null) {
          this.counts[current]--;
          return delete this._jobs[id];
        }
      }
      start(id) {
        var initial;
        initial = 0;
        this._jobs[id] = initial;
        return this.counts[initial]++;
      }
      remove(id) {
        var current;
        current = this._jobs[id];
        if (current != null) {
          this.counts[current]--;
          delete this._jobs[id];
        }
        return current != null;
      }
      jobStatus(id) {
        var ref;
        return (ref = this.status[this._jobs[id]]) != null ? ref : null;
      }
      statusJobs(status) {
        var k, pos, ref, results, v;
        if (status != null) {
          pos = this.status.indexOf(status);
          if (pos < 0) {
            throw new BottleneckError$3(`status must be one of ${this.status.join(", ")}`);
          }
          ref = this._jobs;
          results = [];
          for (k in ref) {
            v = ref[k];
            if (v === pos) {
              results.push(k);
            }
          }
          return results;
        } else {
          return Object.keys(this._jobs);
        }
      }
      statusCounts() {
        return this.counts.reduce((acc, v, i) => {
          acc[this.status[i]] = v;
          return acc;
        }, {});
      }
    };
    var States_1 = States;
    var DLList$2, Sync;
    DLList$2 = DLList_1;
    Sync = class Sync2 {
      constructor(name, Promise2) {
        this.schedule = this.schedule.bind(this);
        this.name = name;
        this.Promise = Promise2;
        this._running = 0;
        this._queue = new DLList$2;
      }
      isEmpty() {
        return this._queue.length === 0;
      }
      async _tryToRun() {
        var args, cb, error, reject, resolve, returned, task;
        if (this._running < 1 && this._queue.length > 0) {
          this._running++;
          ({ task, args, resolve, reject } = this._queue.shift());
          cb = await async function() {
            try {
              returned = await task(...args);
              return function() {
                return resolve(returned);
              };
            } catch (error1) {
              error = error1;
              return function() {
                return reject(error);
              };
            }
          }();
          this._running--;
          this._tryToRun();
          return cb();
        }
      }
      schedule(task, ...args) {
        var promise, reject, resolve;
        resolve = reject = null;
        promise = new this.Promise(function(_resolve, _reject) {
          resolve = _resolve;
          return reject = _reject;
        });
        this._queue.push({ task, args, resolve, reject });
        this._tryToRun();
        return promise;
      }
    };
    var Sync_1 = Sync;
    var version = "2.19.5";
    var version$1 = {
      version
    };
    var version$2 = Object.freeze({
      version,
      default: version$1
    });
    var require$$2 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
    var require$$3 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
    var require$$4 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
    var Events$2, Group, IORedisConnection$1, RedisConnection$1, Scripts$1, parser$3;
    parser$3 = parser;
    Events$2 = Events_1;
    RedisConnection$1 = require$$2;
    IORedisConnection$1 = require$$3;
    Scripts$1 = require$$4;
    Group = function() {

      class Group2 {
        constructor(limiterOptions = {}) {
          this.deleteKey = this.deleteKey.bind(this);
          this.limiterOptions = limiterOptions;
          parser$3.load(this.limiterOptions, this.defaults, this);
          this.Events = new Events$2(this);
          this.instances = {};
          this.Bottleneck = Bottleneck_1;
          this._startAutoCleanup();
          this.sharedConnection = this.connection != null;
          if (this.connection == null) {
            if (this.limiterOptions.datastore === "redis") {
              this.connection = new RedisConnection$1(Object.assign({}, this.limiterOptions, { Events: this.Events }));
            } else if (this.limiterOptions.datastore === "ioredis") {
              this.connection = new IORedisConnection$1(Object.assign({}, this.limiterOptions, { Events: this.Events }));
            }
          }
        }
        key(key = "") {
          var ref;
          return (ref = this.instances[key]) != null ? ref : (() => {
            var limiter;
            limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
              id: `${this.id}-${key}`,
              timeout: this.timeout,
              connection: this.connection
            }));
            this.Events.trigger("created", limiter, key);
            return limiter;
          })();
        }
        async deleteKey(key = "") {
          var deleted, instance;
          instance = this.instances[key];
          if (this.connection) {
            deleted = await this.connection.__runCommand__(["del", ...Scripts$1.allKeys(`${this.id}-${key}`)]);
          }
          if (instance != null) {
            delete this.instances[key];
            await instance.disconnect();
          }
          return instance != null || deleted > 0;
        }
        limiters() {
          var k, ref, results, v;
          ref = this.instances;
          results = [];
          for (k in ref) {
            v = ref[k];
            results.push({
              key: k,
              limiter: v
            });
          }
          return results;
        }
        keys() {
          return Object.keys(this.instances);
        }
        async clusterKeys() {
          var cursor, end, found, i, k, keys, len, next, start;
          if (this.connection == null) {
            return this.Promise.resolve(this.keys());
          }
          keys = [];
          cursor = null;
          start = `b_${this.id}-`.length;
          end = "_settings".length;
          while (cursor !== 0) {
            [next, found] = await this.connection.__runCommand__(["scan", cursor != null ? cursor : 0, "match", `b_${this.id}-*_settings`, "count", 1e4]);
            cursor = ~~next;
            for (i = 0, len = found.length;i < len; i++) {
              k = found[i];
              keys.push(k.slice(start, -end));
            }
          }
          return keys;
        }
        _startAutoCleanup() {
          var base;
          clearInterval(this.interval);
          return typeof (base = this.interval = setInterval(async () => {
            var e, k, ref, results, time, v;
            time = Date.now();
            ref = this.instances;
            results = [];
            for (k in ref) {
              v = ref[k];
              try {
                if (await v._store.__groupCheck__(time)) {
                  results.push(this.deleteKey(k));
                } else {
                  results.push(undefined);
                }
              } catch (error) {
                e = error;
                results.push(v.Events.trigger("error", e));
              }
            }
            return results;
          }, this.timeout / 2)).unref === "function" ? base.unref() : undefined;
        }
        updateSettings(options = {}) {
          parser$3.overwrite(options, this.defaults, this);
          parser$3.overwrite(options, options, this.limiterOptions);
          if (options.timeout != null) {
            return this._startAutoCleanup();
          }
        }
        disconnect(flush = true) {
          var ref;
          if (!this.sharedConnection) {
            return (ref = this.connection) != null ? ref.disconnect(flush) : undefined;
          }
        }
      }
      Group2.prototype.defaults = {
        timeout: 1000 * 60 * 5,
        connection: null,
        Promise,
        id: "group-key"
      };
      return Group2;
    }.call(commonjsGlobal);
    var Group_1 = Group;
    var Batcher, Events$3, parser$4;
    parser$4 = parser;
    Events$3 = Events_1;
    Batcher = function() {

      class Batcher2 {
        constructor(options = {}) {
          this.options = options;
          parser$4.load(this.options, this.defaults, this);
          this.Events = new Events$3(this);
          this._arr = [];
          this._resetPromise();
          this._lastFlush = Date.now();
        }
        _resetPromise() {
          return this._promise = new this.Promise((res, rej) => {
            return this._resolve = res;
          });
        }
        _flush() {
          clearTimeout(this._timeout);
          this._lastFlush = Date.now();
          this._resolve();
          this.Events.trigger("batch", this._arr);
          this._arr = [];
          return this._resetPromise();
        }
        add(data) {
          var ret;
          this._arr.push(data);
          ret = this._promise;
          if (this._arr.length === this.maxSize) {
            this._flush();
          } else if (this.maxTime != null && this._arr.length === 1) {
            this._timeout = setTimeout(() => {
              return this._flush();
            }, this.maxTime);
          }
          return ret;
        }
      }
      Batcher2.prototype.defaults = {
        maxTime: null,
        maxSize: null,
        Promise
      };
      return Batcher2;
    }.call(commonjsGlobal);
    var Batcher_1 = Batcher;
    var require$$4$1 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
    var require$$8 = getCjsExportFromNamespace(version$2);
    var Bottleneck, DEFAULT_PRIORITY$1, Events$4, Job$1, LocalDatastore$1, NUM_PRIORITIES$1, Queues$1, RedisDatastore$1, States$1, Sync$1, parser$5, splice = [].splice;
    NUM_PRIORITIES$1 = 10;
    DEFAULT_PRIORITY$1 = 5;
    parser$5 = parser;
    Queues$1 = Queues_1;
    Job$1 = Job_1;
    LocalDatastore$1 = LocalDatastore_1;
    RedisDatastore$1 = require$$4$1;
    Events$4 = Events_1;
    States$1 = States_1;
    Sync$1 = Sync_1;
    Bottleneck = function() {

      class Bottleneck2 {
        constructor(options = {}, ...invalid) {
          var storeInstanceOptions, storeOptions;
          this._addToQueue = this._addToQueue.bind(this);
          this._validateOptions(options, invalid);
          parser$5.load(options, this.instanceDefaults, this);
          this._queues = new Queues$1(NUM_PRIORITIES$1);
          this._scheduled = {};
          this._states = new States$1(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : []));
          this._limiter = null;
          this.Events = new Events$4(this);
          this._submitLock = new Sync$1("submit", this.Promise);
          this._registerLock = new Sync$1("register", this.Promise);
          storeOptions = parser$5.load(options, this.storeDefaults, {});
          this._store = function() {
            if (this.datastore === "redis" || this.datastore === "ioredis" || this.connection != null) {
              storeInstanceOptions = parser$5.load(options, this.redisStoreDefaults, {});
              return new RedisDatastore$1(this, storeOptions, storeInstanceOptions);
            } else if (this.datastore === "local") {
              storeInstanceOptions = parser$5.load(options, this.localStoreDefaults, {});
              return new LocalDatastore$1(this, storeOptions, storeInstanceOptions);
            } else {
              throw new Bottleneck2.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
            }
          }.call(this);
          this._queues.on("leftzero", () => {
            var ref;
            return (ref = this._store.heartbeat) != null ? typeof ref.ref === "function" ? ref.ref() : undefined : undefined;
          });
          this._queues.on("zero", () => {
            var ref;
            return (ref = this._store.heartbeat) != null ? typeof ref.unref === "function" ? ref.unref() : undefined : undefined;
          });
        }
        _validateOptions(options, invalid) {
          if (!(options != null && typeof options === "object" && invalid.length === 0)) {
            throw new Bottleneck2.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
          }
        }
        ready() {
          return this._store.ready;
        }
        clients() {
          return this._store.clients;
        }
        channel() {
          return `b_${this.id}`;
        }
        channel_client() {
          return `b_${this.id}_${this._store.clientId}`;
        }
        publish(message) {
          return this._store.__publish__(message);
        }
        disconnect(flush = true) {
          return this._store.__disconnect__(flush);
        }
        chain(_limiter) {
          this._limiter = _limiter;
          return this;
        }
        queued(priority) {
          return this._queues.queued(priority);
        }
        clusterQueued() {
          return this._store.__queued__();
        }
        empty() {
          return this.queued() === 0 && this._submitLock.isEmpty();
        }
        running() {
          return this._store.__running__();
        }
        done() {
          return this._store.__done__();
        }
        jobStatus(id) {
          return this._states.jobStatus(id);
        }
        jobs(status) {
          return this._states.statusJobs(status);
        }
        counts() {
          return this._states.statusCounts();
        }
        _randomIndex() {
          return Math.random().toString(36).slice(2);
        }
        check(weight = 1) {
          return this._store.__check__(weight);
        }
        _clearGlobalState(index) {
          if (this._scheduled[index] != null) {
            clearTimeout(this._scheduled[index].expiration);
            delete this._scheduled[index];
            return true;
          } else {
            return false;
          }
        }
        async _free(index, job, options, eventInfo) {
          var e, running;
          try {
            ({ running } = await this._store.__free__(index, options.weight));
            this.Events.trigger("debug", `Freed ${options.id}`, eventInfo);
            if (running === 0 && this.empty()) {
              return this.Events.trigger("idle");
            }
          } catch (error1) {
            e = error1;
            return this.Events.trigger("error", e);
          }
        }
        _run(index, job, wait) {
          var clearGlobalState, free, run;
          job.doRun();
          clearGlobalState = this._clearGlobalState.bind(this, index);
          run = this._run.bind(this, index, job);
          free = this._free.bind(this, index, job);
          return this._scheduled[index] = {
            timeout: setTimeout(() => {
              return job.doExecute(this._limiter, clearGlobalState, run, free);
            }, wait),
            expiration: job.options.expiration != null ? setTimeout(function() {
              return job.doExpire(clearGlobalState, run, free);
            }, wait + job.options.expiration) : undefined,
            job
          };
        }
        _drainOne(capacity) {
          return this._registerLock.schedule(() => {
            var args, index, next, options, queue;
            if (this.queued() === 0) {
              return this.Promise.resolve(null);
            }
            queue = this._queues.getFirst();
            ({ options, args } = next = queue.first());
            if (capacity != null && options.weight > capacity) {
              return this.Promise.resolve(null);
            }
            this.Events.trigger("debug", `Draining ${options.id}`, { args, options });
            index = this._randomIndex();
            return this._store.__register__(index, options.weight, options.expiration).then(({ success, wait, reservoir }) => {
              var empty;
              this.Events.trigger("debug", `Drained ${options.id}`, { success, args, options });
              if (success) {
                queue.shift();
                empty = this.empty();
                if (empty) {
                  this.Events.trigger("empty");
                }
                if (reservoir === 0) {
                  this.Events.trigger("depleted", empty);
                }
                this._run(index, next, wait);
                return this.Promise.resolve(options.weight);
              } else {
                return this.Promise.resolve(null);
              }
            });
          });
        }
        _drainAll(capacity, total = 0) {
          return this._drainOne(capacity).then((drained) => {
            var newCapacity;
            if (drained != null) {
              newCapacity = capacity != null ? capacity - drained : capacity;
              return this._drainAll(newCapacity, total + drained);
            } else {
              return this.Promise.resolve(total);
            }
          }).catch((e) => {
            return this.Events.trigger("error", e);
          });
        }
        _dropAllQueued(message) {
          return this._queues.shiftAll(function(job) {
            return job.doDrop({ message });
          });
        }
        stop(options = {}) {
          var done, waitForExecuting;
          options = parser$5.load(options, this.stopDefaults);
          waitForExecuting = (at) => {
            var finished;
            finished = () => {
              var counts;
              counts = this._states.counts;
              return counts[0] + counts[1] + counts[2] + counts[3] === at;
            };
            return new this.Promise((resolve, reject) => {
              if (finished()) {
                return resolve();
              } else {
                return this.on("done", () => {
                  if (finished()) {
                    this.removeAllListeners("done");
                    return resolve();
                  }
                });
              }
            });
          };
          done = options.dropWaitingJobs ? (this._run = function(index, next) {
            return next.doDrop({
              message: options.dropErrorMessage
            });
          }, this._drainOne = () => {
            return this.Promise.resolve(null);
          }, this._registerLock.schedule(() => {
            return this._submitLock.schedule(() => {
              var k, ref, v;
              ref = this._scheduled;
              for (k in ref) {
                v = ref[k];
                if (this.jobStatus(v.job.options.id) === "RUNNING") {
                  clearTimeout(v.timeout);
                  clearTimeout(v.expiration);
                  v.job.doDrop({
                    message: options.dropErrorMessage
                  });
                }
              }
              this._dropAllQueued(options.dropErrorMessage);
              return waitForExecuting(0);
            });
          })) : this.schedule({
            priority: NUM_PRIORITIES$1 - 1,
            weight: 0
          }, () => {
            return waitForExecuting(1);
          });
          this._receive = function(job) {
            return job._reject(new Bottleneck2.prototype.BottleneckError(options.enqueueErrorMessage));
          };
          this.stop = () => {
            return this.Promise.reject(new Bottleneck2.prototype.BottleneckError("stop() has already been called"));
          };
          return done;
        }
        async _addToQueue(job) {
          var args, blocked, error, options, reachedHWM, shifted, strategy;
          ({ args, options } = job);
          try {
            ({ reachedHWM, blocked, strategy } = await this._store.__submit__(this.queued(), options.weight));
          } catch (error1) {
            error = error1;
            this.Events.trigger("debug", `Could not queue ${options.id}`, { args, options, error });
            job.doDrop({ error });
            return false;
          }
          if (blocked) {
            job.doDrop();
            return true;
          } else if (reachedHWM) {
            shifted = strategy === Bottleneck2.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck2.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck2.prototype.strategy.OVERFLOW ? job : undefined;
            if (shifted != null) {
              shifted.doDrop();
            }
            if (shifted == null || strategy === Bottleneck2.prototype.strategy.OVERFLOW) {
              if (shifted == null) {
                job.doDrop();
              }
              return reachedHWM;
            }
          }
          job.doQueue(reachedHWM, blocked);
          this._queues.push(job);
          await this._drainAll();
          return reachedHWM;
        }
        _receive(job) {
          if (this._states.jobStatus(job.options.id) != null) {
            job._reject(new Bottleneck2.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`));
            return false;
          } else {
            job.doReceive();
            return this._submitLock.schedule(this._addToQueue, job);
          }
        }
        submit(...args) {
          var cb, fn, job, options, ref, ref1, task;
          if (typeof args[0] === "function") {
            ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1);
            options = parser$5.load({}, this.jobDefaults);
          } else {
            ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1);
            options = parser$5.load(options, this.jobDefaults);
          }
          task = (...args2) => {
            return new this.Promise(function(resolve, reject) {
              return fn(...args2, function(...args3) {
                return (args3[0] != null ? reject : resolve)(args3);
              });
            });
          };
          job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
          job.promise.then(function(args2) {
            return typeof cb === "function" ? cb(...args2) : undefined;
          }).catch(function(args2) {
            if (Array.isArray(args2)) {
              return typeof cb === "function" ? cb(...args2) : undefined;
            } else {
              return typeof cb === "function" ? cb(args2) : undefined;
            }
          });
          return this._receive(job);
        }
        schedule(...args) {
          var job, options, task;
          if (typeof args[0] === "function") {
            [task, ...args] = args;
            options = {};
          } else {
            [options, task, ...args] = args;
          }
          job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
          this._receive(job);
          return job.promise;
        }
        wrap(fn) {
          var schedule, wrapped;
          schedule = this.schedule.bind(this);
          wrapped = function(...args) {
            return schedule(fn.bind(this), ...args);
          };
          wrapped.withOptions = function(options, ...args) {
            return schedule(options, fn, ...args);
          };
          return wrapped;
        }
        async updateSettings(options = {}) {
          await this._store.__updateSettings__(parser$5.overwrite(options, this.storeDefaults));
          parser$5.overwrite(options, this.instanceDefaults, this);
          return this;
        }
        currentReservoir() {
          return this._store.__currentReservoir__();
        }
        incrementReservoir(incr = 0) {
          return this._store.__incrementReservoir__(incr);
        }
      }
      Bottleneck2.default = Bottleneck2;
      Bottleneck2.Events = Events$4;
      Bottleneck2.version = Bottleneck2.prototype.version = require$$8.version;
      Bottleneck2.strategy = Bottleneck2.prototype.strategy = {
        LEAK: 1,
        OVERFLOW: 2,
        OVERFLOW_PRIORITY: 4,
        BLOCK: 3
      };
      Bottleneck2.BottleneckError = Bottleneck2.prototype.BottleneckError = BottleneckError_1;
      Bottleneck2.Group = Bottleneck2.prototype.Group = Group_1;
      Bottleneck2.RedisConnection = Bottleneck2.prototype.RedisConnection = require$$2;
      Bottleneck2.IORedisConnection = Bottleneck2.prototype.IORedisConnection = require$$3;
      Bottleneck2.Batcher = Bottleneck2.prototype.Batcher = Batcher_1;
      Bottleneck2.prototype.jobDefaults = {
        priority: DEFAULT_PRIORITY$1,
        weight: 1,
        expiration: null,
        id: "<no-id>"
      };
      Bottleneck2.prototype.storeDefaults = {
        maxConcurrent: null,
        minTime: 0,
        highWater: null,
        strategy: Bottleneck2.prototype.strategy.LEAK,
        penalty: null,
        reservoir: null,
        reservoirRefreshInterval: null,
        reservoirRefreshAmount: null,
        reservoirIncreaseInterval: null,
        reservoirIncreaseAmount: null,
        reservoirIncreaseMaximum: null
      };
      Bottleneck2.prototype.localStoreDefaults = {
        Promise,
        timeout: null,
        heartbeatInterval: 250
      };
      Bottleneck2.prototype.redisStoreDefaults = {
        Promise,
        timeout: null,
        heartbeatInterval: 5000,
        clientTimeout: 1e4,
        Redis: null,
        clientOptions: {},
        clusterNodes: null,
        clearDatastore: false,
        connection: null
      };
      Bottleneck2.prototype.instanceDefaults = {
        datastore: "local",
        connection: null,
        id: "<no-id>",
        rejectOnDrop: true,
        trackDoneStatus: false,
        Promise
      };
      Bottleneck2.prototype.stopDefaults = {
        enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
        dropWaitingJobs: true,
        dropErrorMessage: "This limiter has been stopped."
      };
      return Bottleneck2;
    }.call(commonjsGlobal);
    var Bottleneck_1 = Bottleneck;
    var lib = Bottleneck_1;
    return lib;
  });
});

// node_modules/btoa-lite/btoa-browser.js
var require_btoa_browser = __commonJS((exports, module) => {
  module.exports = function _btoa(str) {
    return btoa(str);
  };
});

// node_modules/@octokit/oauth-authorization-url/dist-web/index.js
var oauthAuthorizationUrl, urlBuilderAuthorize;
var init_dist_web7 = __esm(() => {
  oauthAuthorizationUrl = function(options) {
    const clientType = options.clientType || "oauth-app";
    const baseUrl = options.baseUrl || "https://github.com";
    const result = {
      clientType,
      allowSignup: options.allowSignup === false ? false : true,
      clientId: options.clientId,
      login: options.login || null,
      redirectUrl: options.redirectUrl || null,
      state: options.state || Math.random().toString(36).substr(2),
      url: ""
    };
    if (clientType === "oauth-app") {
      const scopes = "scopes" in options ? options.scopes : [];
      result.scopes = typeof scopes === "string" ? scopes.split(/[,\s]+/).filter(Boolean) : scopes;
    }
    result.url = urlBuilderAuthorize(`${baseUrl}/login/oauth/authorize`, result);
    return result;
  };
  urlBuilderAuthorize = function(base, options) {
    const map = {
      allowSignup: "allow_signup",
      clientId: "client_id",
      login: "login",
      redirectUrl: "redirect_uri",
      scopes: "scope",
      state: "state"
    };
    let url = base;
    Object.keys(map).filter((k) => options[k] !== null).filter((k) => {
      if (k !== "scopes")
        return true;
      if (options.clientType === "github-app")
        return false;
      return !Array.isArray(options[k]) || options[k].length > 0;
    }).map((key) => [map[key], `${options[key]}`]).forEach(([key, value], index) => {
      url += index === 0 ? `?` : "&";
      url += `${key}=${encodeURIComponent(value)}`;
    });
    return url;
  };
});

// node_modules/@octokit/oauth-methods/dist-web/index.js
var exports_dist_web3 = {};
__export(exports_dist_web3, {
  scopeToken: () => {
    {
      return scopeToken;
    }
  },
  resetToken: () => {
    {
      return resetToken;
    }
  },
  refreshToken: () => {
    {
      return refreshToken;
    }
  },
  getWebFlowAuthorizationUrl: () => {
    {
      return getWebFlowAuthorizationUrl;
    }
  },
  exchangeWebFlowCode: () => {
    {
      return exchangeWebFlowCode;
    }
  },
  exchangeDeviceCode: () => {
    {
      return exchangeDeviceCode;
    }
  },
  deleteToken: () => {
    {
      return deleteToken;
    }
  },
  deleteAuthorization: () => {
    {
      return deleteAuthorization;
    }
  },
  createDeviceCode: () => {
    {
      return createDeviceCode;
    }
  },
  checkToken: () => {
    {
      return checkToken;
    }
  },
  VERSION: () => {
    {
      return VERSION9;
    }
  }
});
async function oauthRequest(request5, route, parameters) {
  const withOAuthParameters = {
    baseUrl: requestToOAuthBaseUrl(request5),
    headers: {
      accept: "application/json"
    },
    ...parameters
  };
  const response = await request5(route, withOAuthParameters);
  if ("error" in response.data) {
    const error = new RequestError(`${response.data.error_description} (${response.data.error}, ${response.data.error_uri})`, 400, {
      request: request5.endpoint.merge(route, withOAuthParameters),
      headers: response.headers
    });
    error.response = response;
    throw error;
  }
  return response;
}
async function exchangeWebFlowCode(options) {
  const request6 = options.request || request;
  const response = await oauthRequest(request6, "POST /login/oauth/access_token", {
    client_id: options.clientId,
    client_secret: options.clientSecret,
    code: options.code,
    redirect_uri: options.redirectUrl
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean)
  };
  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();
      authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp(apiTimeInMs, response.data.expires_in), authentication.refreshTokenExpiresAt = toTimestamp(apiTimeInMs, response.data.refresh_token_expires_in);
    }
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
async function createDeviceCode(options) {
  const request7 = options.request || request;
  const parameters = {
    client_id: options.clientId
  };
  if ("scopes" in options && Array.isArray(options.scopes)) {
    parameters.scope = options.scopes.join(" ");
  }
  return oauthRequest(request7, "POST /login/device/code", parameters);
}
async function exchangeDeviceCode(options) {
  const request8 = options.request || request;
  const response = await oauthRequest(request8, "POST /login/oauth/access_token", {
    client_id: options.clientId,
    device_code: options.code,
    grant_type: "urn:ietf:params:oauth:grant-type:device_code"
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean)
  };
  if ("clientSecret" in options) {
    authentication.clientSecret = options.clientSecret;
  }
  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();
      authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp2(apiTimeInMs, response.data.expires_in), authentication.refreshTokenExpiresAt = toTimestamp2(apiTimeInMs, response.data.refresh_token_expires_in);
    }
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
async function checkToken(options) {
  const request9 = options.request || request;
  const response = await request9("POST /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${import_btoa_lite.default(`${options.clientId}:${options.clientSecret}`)}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: options.token,
    scopes: response.data.scopes
  };
  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;
  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
async function refreshToken(options) {
  const request10 = options.request || request;
  const response = await oauthRequest(request10, "POST /login/oauth/access_token", {
    client_id: options.clientId,
    client_secret: options.clientSecret,
    grant_type: "refresh_token",
    refresh_token: options.refreshToken
  });
  const apiTimeInMs = new Date(response.headers.date).getTime();
  const authentication = {
    clientType: "github-app",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresAt: toTimestamp3(apiTimeInMs, response.data.expires_in),
    refreshTokenExpiresAt: toTimestamp3(apiTimeInMs, response.data.refresh_token_expires_in)
  };
  return { ...response, authentication };
}
async function scopeToken(options) {
  const {
    request: optionsRequest,
    clientType,
    clientId,
    clientSecret,
    token,
    ...requestOptions
  } = options;
  const request11 = optionsRequest || request;
  const response = await request11("POST /applications/{client_id}/token/scoped", {
    headers: {
      authorization: `basic ${import_btoa_lite2.default(`${clientId}:${clientSecret}`)}`
    },
    client_id: clientId,
    access_token: token,
    ...requestOptions
  });
  const authentication = Object.assign({
    clientType,
    clientId,
    clientSecret,
    token: response.data.token
  }, response.data.expires_at ? { expiresAt: response.data.expires_at } : {});
  return { ...response, authentication };
}
async function resetToken(options) {
  const request12 = options.request || request;
  const auth2 = import_btoa_lite3.default(`${options.clientId}:${options.clientSecret}`);
  const response = await request12("PATCH /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${auth2}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.token,
    scopes: response.data.scopes
  };
  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;
  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
async function deleteToken(options) {
  const request13 = options.request || request;
  const auth2 = import_btoa_lite4.default(`${options.clientId}:${options.clientSecret}`);
  return request13("DELETE /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${auth2}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
}
async function deleteAuthorization(options) {
  const request14 = options.request || request;
  const auth2 = import_btoa_lite5.default(`${options.clientId}:${options.clientSecret}`);
  return request14("DELETE /applications/{client_id}/grant", {
    headers: {
      authorization: `basic ${auth2}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
}
var import_btoa_lite, import_btoa_lite2, import_btoa_lite3, import_btoa_lite4, import_btoa_lite5, requestToOAuthBaseUrl, getWebFlowAuthorizationUrl, toTimestamp, toTimestamp2, toTimestamp3, VERSION9;
var init_dist_web8 = __esm(() => {
  init_dist_web7();
  init_dist_web5();
  init_dist_web4();
  init_dist_web5();
  init_dist_web5();
  init_dist_web5();
  init_dist_web5();
  import_btoa_lite = __toESM(require_btoa_browser(), 1);
  init_dist_web5();
  init_dist_web5();
  import_btoa_lite2 = __toESM(require_btoa_browser(), 1);
  init_dist_web5();
  import_btoa_lite3 = __toESM(require_btoa_browser(), 1);
  init_dist_web5();
  import_btoa_lite4 = __toESM(require_btoa_browser(), 1);
  init_dist_web5();
  import_btoa_lite5 = __toESM(require_btoa_browser(), 1);
  requestToOAuthBaseUrl = function(request5) {
    const endpointDefaults = request5.endpoint.DEFAULTS;
    return /^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl) ? "https://github.com" : endpointDefaults.baseUrl.replace("/api/v3", "");
  };
  getWebFlowAuthorizationUrl = function({
    request: request5 = request,
    ...options
  }) {
    const baseUrl = requestToOAuthBaseUrl(request5);
    return oauthAuthorizationUrl({
      ...options,
      baseUrl
    });
  };
  toTimestamp = function(apiTimeInMs, expirationInSeconds) {
    return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
  };
  toTimestamp2 = function(apiTimeInMs, expirationInSeconds) {
    return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
  };
  toTimestamp3 = function(apiTimeInMs, expirationInSeconds) {
    return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
  };
  VERSION9 = "2.0.6";
});

// node_modules/@octokit/auth-oauth-device/dist-web/index.js
async function getOAuthAccessToken(state, options) {
  const cachedAuthentication = getCachedAuthentication(state, options.auth);
  if (cachedAuthentication)
    return cachedAuthentication;
  const { data: verification } = await createDeviceCode({
    clientType: state.clientType,
    clientId: state.clientId,
    request: options.request || state.request,
    scopes: options.auth.scopes || state.scopes
  });
  await state.onVerification(verification);
  const authentication = await waitForAccessToken(options.request || state.request, state.clientId, state.clientType, verification);
  state.authentication = authentication;
  return authentication;
}
async function wait(seconds) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
async function waitForAccessToken(request15, clientId, clientType, verification) {
  try {
    const options = {
      clientId,
      request: request15,
      code: verification.device_code
    };
    const { authentication } = clientType === "oauth-app" ? await exchangeDeviceCode({
      ...options,
      clientType: "oauth-app"
    }) : await exchangeDeviceCode({
      ...options,
      clientType: "github-app"
    });
    return {
      type: "token",
      tokenType: "oauth",
      ...authentication
    };
  } catch (error) {
    if (!error.response)
      throw error;
    const errorType = error.response.data.error;
    if (errorType === "authorization_pending") {
      await wait(verification.interval);
      return waitForAccessToken(request15, clientId, clientType, verification);
    }
    if (errorType === "slow_down") {
      await wait(verification.interval + 5);
      return waitForAccessToken(request15, clientId, clientType, verification);
    }
    throw error;
  }
}
async function auth2(state, authOptions) {
  return getOAuthAccessToken(state, {
    auth: authOptions
  });
}
async function hook2(state, request15, route, parameters) {
  let endpoint3 = request15.endpoint.merge(route, parameters);
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint3.url)) {
    return request15(endpoint3);
  }
  const { token } = await getOAuthAccessToken(state, {
    request: request15,
    auth: { type: "oauth" }
  });
  endpoint3.headers.authorization = `token ${token}`;
  return request15(endpoint3);
}
var getCachedAuthentication, createOAuthDeviceAuth, VERSION10;
var init_dist_web9 = __esm(() => {
  init_dist_web();
  init_dist_web5();
  init_dist_web8();
  getCachedAuthentication = function(state, auth2) {
    if (auth2.refresh === true)
      return false;
    if (!state.authentication)
      return false;
    if (state.clientType === "github-app") {
      return state.authentication;
    }
    const authentication = state.authentication;
    const newScope = (("scopes" in auth2) && auth2.scopes || state.scopes).join(" ");
    const currentScope = authentication.scopes.join(" ");
    return newScope === currentScope ? authentication : false;
  };
  createOAuthDeviceAuth = function(options) {
    const requestWithDefaults = options.request || request.defaults({
      headers: {
        "user-agent": `octokit-auth-oauth-device.js/${VERSION10} ${getUserAgent()}`
      }
    });
    const { request: request15 = requestWithDefaults, ...otherOptions } = options;
    const state = options.clientType === "github-app" ? {
      ...otherOptions,
      clientType: "github-app",
      request: request15
    } : {
      ...otherOptions,
      clientType: "oauth-app",
      request: request15,
      scopes: options.scopes || []
    };
    if (!options.clientId) {
      throw new Error('[@octokit/auth-oauth-device] "clientId" option must be set (https://github.com/octokit/auth-oauth-device.js#usage)');
    }
    if (!options.onVerification) {
      throw new Error('[@octokit/auth-oauth-device] "onVerification" option must be a function (https://github.com/octokit/auth-oauth-device.js#usage)');
    }
    return Object.assign(auth2.bind(null, state), {
      hook: hook2.bind(null, state)
    });
  };
  VERSION10 = "4.0.5";
});

// node_modules/@octokit/auth-oauth-user/dist-web/index.js
var exports_dist_web4 = {};
__export(exports_dist_web4, {
  requiresBasicAuth: () => {
    {
      return requiresBasicAuth;
    }
  },
  createOAuthUserAuth: () => {
    {
      return createOAuthUserAuth;
    }
  }
});
async function getAuthentication(state) {
  if ("code" in state.strategyOptions) {
    const { authentication } = await exchangeWebFlowCode({
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions,
      request: state.request
    });
    return {
      type: "token",
      tokenType: "oauth",
      ...authentication
    };
  }
  if ("onVerification" in state.strategyOptions) {
    const deviceAuth = createOAuthDeviceAuth({
      clientType: state.clientType,
      clientId: state.clientId,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions,
      request: state.request
    });
    const authentication = await deviceAuth({
      type: "oauth"
    });
    return {
      clientSecret: state.clientSecret,
      ...authentication
    };
  }
  if ("token" in state.strategyOptions) {
    return {
      type: "token",
      tokenType: "oauth",
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions
    };
  }
  throw new Error("[@octokit/auth-oauth-user] Invalid strategy options");
}
async function auth3(state, options = {}) {
  if (!state.authentication) {
    state.authentication = state.clientType === "oauth-app" ? await getAuthentication(state) : await getAuthentication(state);
  }
  if (state.authentication.invalid) {
    throw new Error("[@octokit/auth-oauth-user] Token is invalid");
  }
  const currentAuthentication = state.authentication;
  if ("expiresAt" in currentAuthentication) {
    if (options.type === "refresh" || new Date(currentAuthentication.expiresAt) < new Date) {
      const { authentication } = await refreshToken({
        clientType: "github-app",
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        refreshToken: currentAuthentication.refreshToken,
        request: state.request
      });
      state.authentication = {
        tokenType: "oauth",
        type: "token",
        ...authentication
      };
    }
  }
  if (options.type === "refresh") {
    if (state.clientType === "oauth-app") {
      throw new Error("[@octokit/auth-oauth-user] OAuth Apps do not support expiring tokens");
    }
    if (!currentAuthentication.hasOwnProperty("expiresAt")) {
      throw new Error("[@octokit/auth-oauth-user] Refresh token missing");
    }
    await state.onTokenCreated?.(state.authentication, {
      type: options.type
    });
  }
  if (options.type === "check" || options.type === "reset") {
    const method = options.type === "check" ? checkToken : resetToken;
    try {
      const { authentication } = await method({
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: state.authentication.token,
        request: state.request
      });
      state.authentication = {
        tokenType: "oauth",
        type: "token",
        ...authentication
      };
      if (options.type === "reset") {
        await state.onTokenCreated?.(state.authentication, {
          type: options.type
        });
      }
      return state.authentication;
    } catch (error) {
      if (error.status === 404) {
        error.message = "[@octokit/auth-oauth-user] Token is invalid";
        state.authentication.invalid = true;
      }
      throw error;
    }
  }
  if (options.type === "delete" || options.type === "deleteAuthorization") {
    const method = options.type === "delete" ? deleteToken : deleteAuthorization;
    try {
      await method({
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: state.authentication.token,
        request: state.request
      });
    } catch (error) {
      if (error.status !== 404)
        throw error;
    }
    state.authentication.invalid = true;
    return state.authentication;
  }
  return state.authentication;
}
async function hook3(state, request16, route, parameters = {}) {
  const endpoint3 = request16.endpoint.merge(route, parameters);
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint3.url)) {
    return request16(endpoint3);
  }
  if (requiresBasicAuth(endpoint3.url)) {
    const credentials = import_btoa_lite6.default(`${state.clientId}:${state.clientSecret}`);
    endpoint3.headers.authorization = `basic ${credentials}`;
    return request16(endpoint3);
  }
  const { token } = state.clientType === "oauth-app" ? await auth3({ ...state, request: request16 }) : await auth3({ ...state, request: request16 });
  endpoint3.headers.authorization = "token " + token;
  return request16(endpoint3);
}
var import_btoa_lite6, requiresBasicAuth, createOAuthUserAuth, VERSION11, ROUTES_REQUIRING_BASIC_AUTH;
var init_dist_web10 = __esm(() => {
  init_dist_web();
  init_dist_web5();
  init_dist_web9();
  init_dist_web8();
  init_dist_web8();
  import_btoa_lite6 = __toESM(require_btoa_browser(), 1);
  requiresBasicAuth = function(url) {
    return url && ROUTES_REQUIRING_BASIC_AUTH.test(url);
  };
  createOAuthUserAuth = function({
    clientId,
    clientSecret,
    clientType = "oauth-app",
    request: request16 = request.defaults({
      headers: {
        "user-agent": `octokit-auth-oauth-app.js/${VERSION11} ${getUserAgent()}`
      }
    }),
    onTokenCreated,
    ...strategyOptions
  }) {
    const state = Object.assign({
      clientType,
      clientId,
      clientSecret,
      onTokenCreated,
      strategyOptions,
      request: request16
    });
    return Object.assign(auth3.bind(null, state), {
      hook: hook3.bind(null, state)
    });
  };
  VERSION11 = "2.1.2";
  ROUTES_REQUIRING_BASIC_AUTH = /\/applications\/[^/]+\/(token|grant)s?/;
  createOAuthUserAuth.VERSION = VERSION11;
});

// node_modules/@octokit/auth-oauth-app/dist-web/index.js
var exports_dist_web5 = {};
__export(exports_dist_web5, {
  createOAuthUserAuth: () => {
    {
      return createOAuthUserAuth;
    }
  },
  createOAuthAppAuth: () => {
    {
      return createOAuthAppAuth;
    }
  }
});
async function auth4(state, authOptions) {
  if (authOptions.type === "oauth-app") {
    return {
      type: "oauth-app",
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      headers: {
        authorization: `basic ${import_btoa_lite7.default(`${state.clientId}:${state.clientSecret}`)}`
      }
    };
  }
  if ("factory" in authOptions) {
    const { type, ...options } = {
      ...authOptions,
      ...state
    };
    return authOptions.factory(options);
  }
  const common = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.request,
    ...authOptions
  };
  const userAuth = state.clientType === "oauth-app" ? await createOAuthUserAuth({
    ...common,
    clientType: state.clientType
  }) : await createOAuthUserAuth({
    ...common,
    clientType: state.clientType
  });
  return userAuth();
}
async function hook4(state, request22, route, parameters) {
  let endpoint3 = request22.endpoint.merge(route, parameters);
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint3.url)) {
    return request22(endpoint3);
  }
  if (state.clientType === "github-app" && !requiresBasicAuth(endpoint3.url)) {
    throw new Error(`[@octokit/auth-oauth-app] GitHub Apps cannot use their client ID/secret for basic authentication for endpoints other than "/applications/{client_id}/**". "${endpoint3.method} ${endpoint3.url}" is not supported.`);
  }
  const credentials = import_btoa_lite8.default(`${state.clientId}:${state.clientSecret}`);
  endpoint3.headers.authorization = `basic ${credentials}`;
  try {
    return await request22(endpoint3);
  } catch (error) {
    if (error.status !== 401)
      throw error;
    error.message = `[@octokit/auth-oauth-app] "${endpoint3.method} ${endpoint3.url}" does not support clientId/clientSecret basic authentication.`;
    throw error;
  }
}
var import_btoa_lite7, import_btoa_lite8, createOAuthAppAuth, VERSION12;
var init_dist_web11 = __esm(() => {
  init_dist_web();
  init_dist_web5();
  import_btoa_lite7 = __toESM(require_btoa_browser(), 1);
  init_dist_web10();
  import_btoa_lite8 = __toESM(require_btoa_browser(), 1);
  init_dist_web10();
  createOAuthAppAuth = function(options) {
    const state = Object.assign({
      request: request.defaults({
        headers: {
          "user-agent": `octokit-auth-oauth-app.js/${VERSION12} ${getUserAgent()}`
        }
      }),
      clientType: "oauth-app"
    }, options);
    return Object.assign(auth4.bind(null, state), {
      hook: hook4.bind(null, state)
    });
  };
  VERSION12 = "5.0.6";
});

// node_modules/universal-user-agent/dist-node/index.js
var require_dist_node = __commonJS((exports) => {
  var getUserAgent2 = function() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
      return navigator.userAgent;
    }
    if (typeof process === "object" && process.version !== undefined) {
      return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getUserAgent = getUserAgent2;
});

// node_modules/@octokit/graphql/dist-node/index.js
var require_dist_node2 = __commonJS((exports, module) => {
  var _buildMessageForResponseErrors2 = function(data) {
    return `Request failed due to following response errors:
` + data.errors.map((e2) => ` - ${e2.message}`).join("\n");
  };
  var graphql4 = function(request22, query, options) {
    if (options) {
      if (typeof query === "string" && "query" in options) {
        return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
      }
      for (const key in options) {
        if (!FORBIDDEN_VARIABLE_OPTIONS2.includes(key))
          continue;
        return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
      }
    }
    const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
    const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
      if (NON_VARIABLE_OPTIONS2.includes(key)) {
        result[key] = parsedOptions[key];
        return result;
      }
      if (!result.variables) {
        result.variables = {};
      }
      result.variables[key] = parsedOptions[key];
      return result;
    }, {});
    const baseUrl = parsedOptions.baseUrl || request22.endpoint.DEFAULTS.baseUrl;
    if (GHES_V3_SUFFIX_REGEX2.test(baseUrl)) {
      requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX2, "/api/graphql");
    }
    return request22(requestOptions).then((response) => {
      if (response.data.errors) {
        const headers = {};
        for (const key of Object.keys(response.headers)) {
          headers[key] = response.headers[key];
        }
        throw new GraphqlResponseError2(requestOptions, headers, response.data);
      }
      return response.data.data;
    });
  };
  var withDefaults4 = function(request22, newDefaults) {
    const newRequest = request22.defaults(newDefaults);
    const newApi = (query, options) => {
      return graphql4(newRequest, query, options);
    };
    return Object.assign(newApi, {
      defaults: withDefaults4.bind(null, newRequest),
      endpoint: newRequest.endpoint
    });
  };
  var withCustomRequest2 = function(customRequest) {
    return withDefaults4(customRequest, {
      method: "POST",
      url: "/graphql"
    });
  };
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var dist_src_exports = {};
  __export2(dist_src_exports, {
    GraphqlResponseError: () => GraphqlResponseError2,
    graphql: () => graphql22,
    withCustomRequest: () => withCustomRequest2
  });
  module.exports = __toCommonJS2(dist_src_exports);
  var import_request = (init_dist_web5(), __toCommonJS(exports_dist_web));
  var import_universal_user_agent9 = require_dist_node();
  var VERSION14 = "5.0.6";
  var GraphqlResponseError2 = class extends Error {
    constructor(request22, headers, response) {
      super(_buildMessageForResponseErrors2(response));
      this.request = request22;
      this.headers = headers;
      this.response = response;
      this.name = "GraphqlResponseError";
      this.errors = response.errors;
      this.data = response.data;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  };
  var NON_VARIABLE_OPTIONS2 = [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "query",
    "mediaType"
  ];
  var FORBIDDEN_VARIABLE_OPTIONS2 = ["query", "method", "url"];
  var GHES_V3_SUFFIX_REGEX2 = /\/api\/v3\/?$/;
  var graphql22 = withDefaults4(import_request.request, {
    headers: {
      "user-agent": `octokit-graphql.js/${VERSION14} ${(0, import_universal_user_agent9.getUserAgent)()}`
    },
    method: "POST",
    url: "/graphql"
  });
});

// node_modules/@octokit/core/dist-node/index.js
var require_dist_node3 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var dist_src_exports = {};
  __export2(dist_src_exports, {
    Octokit: () => Octokit2
  });
  module.exports = __toCommonJS2(dist_src_exports);
  var import_universal_user_agent9 = require_dist_node();
  var import_before_after_hook2 = require_before_after_hook();
  var import_request = (init_dist_web5(), __toCommonJS(exports_dist_web));
  var import_graphql = require_dist_node2();
  var import_auth_token = (init_dist_web6(), __toCommonJS(exports_dist_web2));
  var VERSION14 = "4.2.4";
  var Octokit2 = class {
    static defaults(defaults) {
      const OctokitWithDefaults = class extends this {
        constructor(...args) {
          const options = args[0] || {};
          if (typeof defaults === "function") {
            super(defaults(options));
            return;
          }
          super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
            userAgent: `${options.userAgent} ${defaults.userAgent}`
          } : null));
        }
      };
      return OctokitWithDefaults;
    }
    static plugin(...newPlugins) {
      var _a;
      const currentPlugins = this.plugins;
      const NewOctokit = (_a = class extends this {
      }, _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))), _a);
      return NewOctokit;
    }
    constructor(options = {}) {
      const hook6 = new import_before_after_hook2.Collection;
      const requestDefaults = {
        baseUrl: import_request.request.endpoint.DEFAULTS.baseUrl,
        headers: {},
        request: Object.assign({}, options.request, {
          hook: hook6.bind(null, "request")
        }),
        mediaType: {
          previews: [],
          format: ""
        }
      };
      requestDefaults.headers["user-agent"] = [
        options.userAgent,
        `octokit-core.js/${VERSION14} ${(0, import_universal_user_agent9.getUserAgent)()}`
      ].filter(Boolean).join(" ");
      if (options.baseUrl) {
        requestDefaults.baseUrl = options.baseUrl;
      }
      if (options.previews) {
        requestDefaults.mediaType.previews = options.previews;
      }
      if (options.timeZone) {
        requestDefaults.headers["time-zone"] = options.timeZone;
      }
      this.request = import_request.request.defaults(requestDefaults);
      this.graphql = (0, import_graphql.withCustomRequest)(this.request).defaults(requestDefaults);
      this.log = Object.assign({
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      }, options.log);
      this.hook = hook6;
      if (!options.authStrategy) {
        if (!options.auth) {
          this.auth = async () => ({
            type: "unauthenticated"
          });
        } else {
          const auth6 = (0, import_auth_token.createTokenAuth)(options.auth);
          hook6.wrap("request", auth6.hook);
          this.auth = auth6;
        }
      } else {
        const { authStrategy, ...otherOptions } = options;
        const auth6 = authStrategy(Object.assign({
          request: this.request,
          log: this.log,
          octokit: this,
          octokitOptions: otherOptions
        }, options.auth));
        hook6.wrap("request", auth6.hook);
        this.auth = auth6;
      }
      const classConstructor = this.constructor;
      classConstructor.plugins.forEach((plugin) => {
        Object.assign(this, plugin(this, options));
      });
    }
  };
  Octokit2.VERSION = VERSION14;
  Octokit2.plugins = [];
});

// node_modules/@octokit/auth-unauthenticated/dist-node/index.js
var require_dist_node4 = __commonJS((exports, module) => {
  async function auth6(reason) {
    return {
      type: "unauthenticated",
      reason
    };
  }
  var isRateLimitError = function(error) {
    if (error.status !== 403) {
      return false;
    }
    if (!error.response) {
      return false;
    }
    return error.response.headers["x-ratelimit-remaining"] === "0";
  };
  var isAbuseLimitError = function(error) {
    if (error.status !== 403) {
      return false;
    }
    return REGEX_ABUSE_LIMIT_MESSAGE.test(error.message);
  };
  async function hook6(reason, request18, route, parameters) {
    const endpoint3 = request18.endpoint.merge(route, parameters);
    return request18(endpoint3).catch((error) => {
      if (error.status === 404) {
        error.message = `Not found. May be due to lack of authentication. Reason: ${reason}`;
        throw error;
      }
      if (isRateLimitError(error)) {
        error.message = `API rate limit exceeded. This maybe caused by the lack of authentication. Reason: ${reason}`;
        throw error;
      }
      if (isAbuseLimitError(error)) {
        error.message = `You have triggered an abuse detection mechanism. This maybe caused by the lack of authentication. Reason: ${reason}`;
        throw error;
      }
      if (error.status === 401) {
        error.message = `Unauthorized. "${endpoint3.method} ${endpoint3.url}" failed most likely due to lack of authentication. Reason: ${reason}`;
        throw error;
      }
      if (error.status >= 400 && error.status < 500) {
        error.message = error.message.replace(/\.?$/, `. May be caused by lack of authentication (${reason}).`);
      }
      throw error;
    });
  }
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var dist_src_exports = {};
  __export2(dist_src_exports, {
    createUnauthenticatedAuth: () => createUnauthenticatedAuth
  });
  module.exports = __toCommonJS2(dist_src_exports);
  var REGEX_ABUSE_LIMIT_MESSAGE = /\babuse\b/i;
  var createUnauthenticatedAuth = function createUnauthenticatedAuth2(options) {
    if (!options || !options.reason) {
      throw new Error("[@octokit/auth-unauthenticated] No reason passed to createUnauthenticatedAuth");
    }
    return Object.assign(auth6.bind(null, options.reason), {
      hook: hook6.bind(null, options.reason)
    });
  };
});

// node_modules/fromentries/index.js
var require_fromentries = __commonJS((exports, module) => {
  /*! fromentries. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  module.exports = function fromEntries(iterable) {
    return [...iterable].reduce((obj, [key, val]) => {
      obj[key] = val;
      return obj;
    }, {});
  };
});

// node_modules/@octokit/oauth-app/dist-node/index.js
var require_dist_node5 = __commonJS((exports, module) => {
  var addEventHandler = function(state, eventName, eventHandler) {
    if (Array.isArray(eventName)) {
      for (const singleEventName of eventName) {
        addEventHandler(state, singleEventName, eventHandler);
      }
      return;
    }
    if (!state.eventHandlers[eventName]) {
      state.eventHandlers[eventName] = [];
    }
    state.eventHandlers[eventName].push(eventHandler);
  };
  async function emitEvent(state, context) {
    const { name, action } = context;
    if (state.eventHandlers[`${name}.${action}`]) {
      for (const eventHandler of state.eventHandlers[`${name}.${action}`]) {
        await eventHandler(context);
      }
    }
    if (state.eventHandlers[name]) {
      for (const eventHandler of state.eventHandlers[name]) {
        await eventHandler(context);
      }
    }
  }
  async function getUserOctokitWithState(state, options) {
    return state.octokit.auth({
      type: "oauth-user",
      ...options,
      async factory(options2) {
        const octokit = new state.Octokit({
          authStrategy: import_auth_oauth_user.createOAuthUserAuth,
          auth: options2
        });
        const authentication = await octokit.auth({
          type: "get"
        });
        await emitEvent(state, {
          name: "token",
          action: "created",
          token: authentication.token,
          scopes: authentication.scopes,
          authentication,
          octokit
        });
        return octokit;
      }
    });
  }
  var getWebFlowAuthorizationUrlWithState = function(state, options) {
    const optionsWithDefaults = {
      clientId: state.clientId,
      request: state.octokit.request,
      ...options,
      allowSignup: state.allowSignup ?? options.allowSignup,
      redirectUrl: options.redirectUrl ?? state.redirectUrl,
      scopes: options.scopes ?? state.defaultScopes
    };
    return OAuthMethods.getWebFlowAuthorizationUrl({
      clientType: state.clientType,
      ...optionsWithDefaults
    });
  };
  async function createTokenWithState(state, options) {
    const authentication = await state.octokit.auth({
      type: "oauth-user",
      ...options
    });
    await emitEvent(state, {
      name: "token",
      action: "created",
      token: authentication.token,
      scopes: authentication.scopes,
      authentication,
      octokit: new state.Octokit({
        authStrategy: OAuthAppAuth.createOAuthUserAuth,
        auth: {
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: authentication.token,
          scopes: authentication.scopes,
          refreshToken: authentication.refreshToken,
          expiresAt: authentication.expiresAt,
          refreshTokenExpiresAt: authentication.refreshTokenExpiresAt
        }
      })
    });
    return { authentication };
  }
  async function checkTokenWithState(state, options) {
    const result = await OAuthMethods2.checkToken({
      clientType: state.clientType,
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      request: state.octokit.request,
      ...options
    });
    Object.assign(result.authentication, { type: "token", tokenType: "oauth" });
    return result;
  }
  async function resetTokenWithState(state, options) {
    const optionsWithDefaults = {
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      request: state.octokit.request,
      ...options
    };
    if (state.clientType === "oauth-app") {
      const response2 = await OAuthMethods3.resetToken({
        clientType: "oauth-app",
        ...optionsWithDefaults
      });
      const authentication2 = Object.assign(response2.authentication, {
        type: "token",
        tokenType: "oauth"
      });
      await emitEvent(state, {
        name: "token",
        action: "reset",
        token: response2.authentication.token,
        scopes: response2.authentication.scopes || undefined,
        authentication: authentication2,
        octokit: new state.Octokit({
          authStrategy: import_auth_oauth_user2.createOAuthUserAuth,
          auth: {
            clientType: state.clientType,
            clientId: state.clientId,
            clientSecret: state.clientSecret,
            token: response2.authentication.token,
            scopes: response2.authentication.scopes
          }
        })
      });
      return { ...response2, authentication: authentication2 };
    }
    const response = await OAuthMethods3.resetToken({
      clientType: "github-app",
      ...optionsWithDefaults
    });
    const authentication = Object.assign(response.authentication, {
      type: "token",
      tokenType: "oauth"
    });
    await emitEvent(state, {
      name: "token",
      action: "reset",
      token: response.authentication.token,
      authentication,
      octokit: new state.Octokit({
        authStrategy: import_auth_oauth_user2.createOAuthUserAuth,
        auth: {
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: response.authentication.token
        }
      })
    });
    return { ...response, authentication };
  }
  async function refreshTokenWithState(state, options) {
    if (state.clientType === "oauth-app") {
      throw new Error("[@octokit/oauth-app] app.refreshToken() is not supported for OAuth Apps");
    }
    const response = await OAuthMethods4.refreshToken({
      clientType: "github-app",
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      request: state.octokit.request,
      refreshToken: options.refreshToken
    });
    const authentication = Object.assign(response.authentication, {
      type: "token",
      tokenType: "oauth"
    });
    await emitEvent(state, {
      name: "token",
      action: "refreshed",
      token: response.authentication.token,
      authentication,
      octokit: new state.Octokit({
        authStrategy: import_auth_oauth_user3.createOAuthUserAuth,
        auth: {
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: response.authentication.token
        }
      })
    });
    return { ...response, authentication };
  }
  async function scopeTokenWithState(state, options) {
    if (state.clientType === "oauth-app") {
      throw new Error("[@octokit/oauth-app] app.scopeToken() is not supported for OAuth Apps");
    }
    const response = await OAuthMethods5.scopeToken({
      clientType: "github-app",
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      request: state.octokit.request,
      ...options
    });
    const authentication = Object.assign(response.authentication, {
      type: "token",
      tokenType: "oauth"
    });
    await emitEvent(state, {
      name: "token",
      action: "scoped",
      token: response.authentication.token,
      authentication,
      octokit: new state.Octokit({
        authStrategy: import_auth_oauth_user4.createOAuthUserAuth,
        auth: {
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: response.authentication.token
        }
      })
    });
    return { ...response, authentication };
  }
  async function deleteTokenWithState(state, options) {
    const optionsWithDefaults = {
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      request: state.octokit.request,
      ...options
    };
    const response = state.clientType === "oauth-app" ? await OAuthMethods6.deleteToken({
      clientType: "oauth-app",
      ...optionsWithDefaults
    }) : await OAuthMethods6.deleteToken({
      clientType: "github-app",
      ...optionsWithDefaults
    });
    await emitEvent(state, {
      name: "token",
      action: "deleted",
      token: options.token,
      octokit: new state.Octokit({
        authStrategy: import_auth_unauthenticated.createUnauthenticatedAuth,
        auth: {
          reason: `Handling "token.deleted" event. The access for the token has been revoked.`
        }
      })
    });
    return response;
  }
  async function deleteAuthorizationWithState(state, options) {
    const optionsWithDefaults = {
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      request: state.octokit.request,
      ...options
    };
    const response = state.clientType === "oauth-app" ? await OAuthMethods7.deleteAuthorization({
      clientType: "oauth-app",
      ...optionsWithDefaults
    }) : await OAuthMethods7.deleteAuthorization({
      clientType: "github-app",
      ...optionsWithDefaults
    });
    await emitEvent(state, {
      name: "token",
      action: "deleted",
      token: options.token,
      octokit: new state.Octokit({
        authStrategy: import_auth_unauthenticated2.createUnauthenticatedAuth,
        auth: {
          reason: `Handling "token.deleted" event. The access for the token has been revoked.`
        }
      })
    });
    await emitEvent(state, {
      name: "authorization",
      action: "deleted",
      token: options.token,
      octokit: new state.Octokit({
        authStrategy: import_auth_unauthenticated2.createUnauthenticatedAuth,
        auth: {
          reason: `Handling "authorization.deleted" event. The access for the app has been revoked.`
        }
      })
    });
    return response;
  }
  async function handleRequest(app, { pathPrefix = "/api/github/oauth" }, request18) {
    var _a, _b, _c, _d, _e, _f;
    if (request18.method === "OPTIONS") {
      return {
        status: 200,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "*",
          "access-control-allow-headers": "Content-Type, User-Agent, Authorization"
        }
      };
    }
    const { pathname } = new URL(request18.url, "http://localhost");
    const route = [request18.method, pathname].join(" ");
    const routes = {
      getLogin: `GET ${pathPrefix}/login`,
      getCallback: `GET ${pathPrefix}/callback`,
      createToken: `POST ${pathPrefix}/token`,
      getToken: `GET ${pathPrefix}/token`,
      patchToken: `PATCH ${pathPrefix}/token`,
      patchRefreshToken: `PATCH ${pathPrefix}/refresh-token`,
      scopeToken: `POST ${pathPrefix}/token/scoped`,
      deleteToken: `DELETE ${pathPrefix}/token`,
      deleteGrant: `DELETE ${pathPrefix}/grant`
    };
    if (!Object.values(routes).includes(route)) {
      return null;
    }
    let json;
    try {
      const text = await request18.text();
      json = text ? JSON.parse(text) : {};
    } catch (error) {
      return {
        status: 400,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify({
          error: "[@octokit/oauth-app] request error"
        })
      };
    }
    const { searchParams } = new URL(request18.url, "http://localhost");
    const query = (0, import_fromentries.default)(searchParams);
    const headers = request18.headers;
    try {
      if (route === routes.getLogin) {
        const { url } = app.getWebFlowAuthorizationUrl({
          state: query.state,
          scopes: query.scopes ? query.scopes.split(",") : undefined,
          allowSignup: query.allowSignup ? query.allowSignup === "true" : undefined,
          redirectUrl: query.redirectUrl
        });
        return { status: 302, headers: { location: url } };
      }
      if (route === routes.getCallback) {
        if (query.error) {
          throw new Error(`[@octokit/oauth-app] ${query.error} ${query.error_description}`);
        }
        if (!query.code) {
          throw new Error('[@octokit/oauth-app] "code" parameter is required');
        }
        const {
          authentication: { token: token2 }
        } = await app.createToken({
          code: query.code
        });
        return {
          status: 200,
          headers: {
            "content-type": "text/html"
          },
          text: `<h1>Token created successfully</h1>

<p>Your token is: <strong>${token2}</strong>. Copy it now as it cannot be shown again.</p>`
        };
      }
      if (route === routes.createToken) {
        const { code, redirectUrl } = json;
        if (!code) {
          throw new Error('[@octokit/oauth-app] "code" parameter is required');
        }
        const result = await app.createToken({
          code,
          redirectUrl
        });
        delete result.authentication.clientSecret;
        return {
          status: 201,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          text: JSON.stringify(result)
        };
      }
      if (route === routes.getToken) {
        const token2 = (_a = headers.authorization) == null ? undefined : _a.substr("token ".length);
        if (!token2) {
          throw new Error('[@octokit/oauth-app] "Authorization" header is required');
        }
        const result = await app.checkToken({
          token: token2
        });
        delete result.authentication.clientSecret;
        return {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          text: JSON.stringify(result)
        };
      }
      if (route === routes.patchToken) {
        const token2 = (_b = headers.authorization) == null ? undefined : _b.substr("token ".length);
        if (!token2) {
          throw new Error('[@octokit/oauth-app] "Authorization" header is required');
        }
        const result = await app.resetToken({ token: token2 });
        delete result.authentication.clientSecret;
        return {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          text: JSON.stringify(result)
        };
      }
      if (route === routes.patchRefreshToken) {
        const token2 = (_c = headers.authorization) == null ? undefined : _c.substr("token ".length);
        if (!token2) {
          throw new Error('[@octokit/oauth-app] "Authorization" header is required');
        }
        const { refreshToken: refreshToken2 } = json;
        if (!refreshToken2) {
          throw new Error("[@octokit/oauth-app] refreshToken must be sent in request body");
        }
        const result = await app.refreshToken({ refreshToken: refreshToken2 });
        delete result.authentication.clientSecret;
        return {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          text: JSON.stringify(result)
        };
      }
      if (route === routes.scopeToken) {
        const token2 = (_d = headers.authorization) == null ? undefined : _d.substr("token ".length);
        if (!token2) {
          throw new Error('[@octokit/oauth-app] "Authorization" header is required');
        }
        const result = await app.scopeToken({
          token: token2,
          ...json
        });
        delete result.authentication.clientSecret;
        return {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*"
          },
          text: JSON.stringify(result)
        };
      }
      if (route === routes.deleteToken) {
        const token2 = (_e = headers.authorization) == null ? undefined : _e.substr("token ".length);
        if (!token2) {
          throw new Error('[@octokit/oauth-app] "Authorization" header is required');
        }
        await app.deleteToken({
          token: token2
        });
        return {
          status: 204,
          headers: { "access-control-allow-origin": "*" }
        };
      }
      const token = (_f = headers.authorization) == null ? undefined : _f.substr("token ".length);
      if (!token) {
        throw new Error('[@octokit/oauth-app] "Authorization" header is required');
      }
      await app.deleteAuthorization({
        token
      });
      return {
        status: 204,
        headers: { "access-control-allow-origin": "*" }
      };
    } catch (error) {
      return {
        status: 400,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify({ error: error.message })
      };
    }
  }
  var parseRequest = function(request18) {
    const { method, url, headers } = request18;
    async function text() {
      const text2 = await new Promise((resolve, reject) => {
        let bodyChunks = [];
        request18.on("error", reject).on("data", (chunk) => bodyChunks.push(chunk)).on("end", () => resolve(Buffer.concat(bodyChunks).toString()));
      });
      return text2;
    }
    return { method, url, headers, text };
  };
  var sendResponse = function(octokitResponse, response) {
    response.writeHead(octokitResponse.status, octokitResponse.headers);
    response.end(octokitResponse.text);
  };
  var onUnhandledRequestDefault = function(request18) {
    return {
      status: 404,
      headers: { "content-type": "application/json" },
      text: JSON.stringify({
        error: `Unknown route: ${request18.method} ${request18.url}`
      })
    };
  };
  var onUnhandledRequestDefaultNode = function(request18, response) {
    const octokitRequest = parseRequest(request18);
    const octokitResponse = onUnhandledRequestDefault(octokitRequest);
    sendResponse(octokitResponse, response);
  };
  var createNodeMiddleware = function(app, {
    pathPrefix,
    onUnhandledRequest
  } = {}) {
    if (onUnhandledRequest) {
      app.octokit.log.warn("[@octokit/oauth-app] `onUnhandledRequest` is deprecated and will be removed from the next major version.");
    }
    onUnhandledRequest ?? (onUnhandledRequest = onUnhandledRequestDefaultNode);
    return async function(request18, response, next) {
      const octokitRequest = parseRequest(request18);
      const octokitResponse = await handleRequest(app, { pathPrefix }, octokitRequest);
      if (octokitResponse) {
        sendResponse(octokitResponse, response);
      } else if (typeof next === "function") {
        next();
      } else {
        onUnhandledRequest(request18, response);
      }
    };
  };
  var parseRequest2 = function(request18) {
    const headers = Object.fromEntries(request18.headers.entries());
    return {
      method: request18.method,
      url: request18.url,
      headers,
      text: () => request18.text()
    };
  };
  var sendResponse2 = function(octokitResponse) {
    return new Response(octokitResponse.text, {
      status: octokitResponse.status,
      headers: octokitResponse.headers
    });
  };
  async function onUnhandledRequestDefaultWebWorker(request18) {
    const octokitRequest = parseRequest2(request18);
    const octokitResponse = onUnhandledRequestDefault(octokitRequest);
    return sendResponse2(octokitResponse);
  }
  var createWebWorkerHandler = function(app, {
    pathPrefix,
    onUnhandledRequest
  } = {}) {
    if (onUnhandledRequest) {
      app.octokit.log.warn("[@octokit/oauth-app] `onUnhandledRequest` is deprecated and will be removed from the next major version.");
    }
    onUnhandledRequest ?? (onUnhandledRequest = onUnhandledRequestDefaultWebWorker);
    return async function(request18) {
      const octokitRequest = parseRequest2(request18);
      const octokitResponse = await handleRequest(app, { pathPrefix }, octokitRequest);
      return octokitResponse ? sendResponse2(octokitResponse) : await onUnhandledRequest(request18);
    };
  };
  var createCloudflareHandler = function(...args) {
    args[0].octokit.log.warn("[@octokit/oauth-app] `createCloudflareHandler` is deprecated, use `createWebWorkerHandler` instead");
    return createWebWorkerHandler(...args);
  };
  var parseRequest3 = function(request18) {
    const { method } = request18.requestContext.http;
    let url = request18.rawPath;
    const { stage } = request18.requestContext;
    if (url.startsWith("/" + stage))
      url = url.substring(stage.length + 1);
    if (request18.rawQueryString)
      url += "?" + request18.rawQueryString;
    const headers = request18.headers;
    const text = async () => request18.body || "";
    return { method, url, headers, text };
  };
  var sendResponse3 = function(octokitResponse) {
    return {
      statusCode: octokitResponse.status,
      headers: octokitResponse.headers,
      body: octokitResponse.text
    };
  };
  async function onUnhandledRequestDefaultAWSAPIGatewayV2(event) {
    const request18 = parseRequest3(event);
    const response = onUnhandledRequestDefault(request18);
    return sendResponse3(response);
  }
  var createAWSLambdaAPIGatewayV2Handler = function(app, {
    pathPrefix,
    onUnhandledRequest
  } = {}) {
    if (onUnhandledRequest) {
      app.octokit.log.warn("[@octokit/oauth-app] `onUnhandledRequest` is deprecated and will be removed from the next major version.");
    }
    onUnhandledRequest ?? (onUnhandledRequest = onUnhandledRequestDefaultAWSAPIGatewayV2);
    return async function(event) {
      const request18 = parseRequest3(event);
      const response = await handleRequest(app, { pathPrefix }, request18);
      return response ? sendResponse3(response) : onUnhandledRequest(event);
    };
  };
  var __create2 = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __getProtoOf2 = Object.getPrototypeOf;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var dist_src_exports = {};
  __export2(dist_src_exports, {
    OAuthApp: () => OAuthApp,
    createAWSLambdaAPIGatewayV2Handler: () => createAWSLambdaAPIGatewayV2Handler,
    createCloudflareHandler: () => createCloudflareHandler,
    createNodeMiddleware: () => createNodeMiddleware,
    createWebWorkerHandler: () => createWebWorkerHandler,
    handleRequest: () => handleRequest
  });
  module.exports = __toCommonJS2(dist_src_exports);
  var import_auth_oauth_app = (init_dist_web11(), __toCommonJS(exports_dist_web5));
  var VERSION14 = "4.2.4";
  var import_core = require_dist_node3();
  var import_universal_user_agent9 = require_dist_node();
  var OAuthAppOctokit = import_core.Octokit.defaults({
    userAgent: `octokit-oauth-app.js/${VERSION14} ${(0, import_universal_user_agent9.getUserAgent)()}`
  });
  var import_auth_oauth_user = (init_dist_web10(), __toCommonJS(exports_dist_web4));
  var OAuthMethods = __toESM2((init_dist_web8(), __toCommonJS(exports_dist_web3)));
  var OAuthAppAuth = __toESM2((init_dist_web11(), __toCommonJS(exports_dist_web5)));
  var OAuthMethods2 = __toESM2((init_dist_web8(), __toCommonJS(exports_dist_web3)));
  var OAuthMethods3 = __toESM2((init_dist_web8(), __toCommonJS(exports_dist_web3)));
  var import_auth_oauth_user2 = (init_dist_web10(), __toCommonJS(exports_dist_web4));
  var OAuthMethods4 = __toESM2((init_dist_web8(), __toCommonJS(exports_dist_web3)));
  var import_auth_oauth_user3 = (init_dist_web10(), __toCommonJS(exports_dist_web4));
  var OAuthMethods5 = __toESM2((init_dist_web8(), __toCommonJS(exports_dist_web3)));
  var import_auth_oauth_user4 = (init_dist_web10(), __toCommonJS(exports_dist_web4));
  var OAuthMethods6 = __toESM2((init_dist_web8(), __toCommonJS(exports_dist_web3)));
  var import_auth_unauthenticated = require_dist_node4();
  var OAuthMethods7 = __toESM2((init_dist_web8(), __toCommonJS(exports_dist_web3)));
  var import_auth_unauthenticated2 = require_dist_node4();
  var import_fromentries = __toESM2(require_fromentries());
  var OAuthApp = class {
    static defaults(defaults) {
      const OAuthAppWithDefaults = class extends this {
        constructor(...args) {
          super({
            ...defaults,
            ...args[0]
          });
        }
      };
      return OAuthAppWithDefaults;
    }
    constructor(options) {
      const Octokit2 = options.Octokit || OAuthAppOctokit;
      this.type = options.clientType || "oauth-app";
      const octokit = new Octokit2({
        authStrategy: import_auth_oauth_app.createOAuthAppAuth,
        auth: {
          clientType: this.type,
          clientId: options.clientId,
          clientSecret: options.clientSecret
        }
      });
      const state = {
        clientType: this.type,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        defaultScopes: options.defaultScopes || [],
        allowSignup: options.allowSignup,
        baseUrl: options.baseUrl,
        redirectUrl: options.redirectUrl,
        log: options.log,
        Octokit: Octokit2,
        octokit,
        eventHandlers: {}
      };
      this.on = addEventHandler.bind(null, state);
      this.octokit = octokit;
      this.getUserOctokit = getUserOctokitWithState.bind(null, state);
      this.getWebFlowAuthorizationUrl = getWebFlowAuthorizationUrlWithState.bind(null, state);
      this.createToken = createTokenWithState.bind(null, state);
      this.checkToken = checkTokenWithState.bind(null, state);
      this.resetToken = resetTokenWithState.bind(null, state);
      this.refreshToken = refreshTokenWithState.bind(null, state);
      this.scopeToken = scopeTokenWithState.bind(null, state);
      this.deleteToken = deleteTokenWithState.bind(null, state);
      this.deleteAuthorization = deleteAuthorizationWithState.bind(null, state);
    }
  };
  OAuthApp.VERSION = VERSION14;
});

// node_modules/indent-string/index.js
var require_indent_string = __commonJS((exports, module) => {
  module.exports = (string, count = 1, options) => {
    options = {
      indent: " ",
      includeEmptyLines: false,
      ...options
    };
    if (typeof string !== "string") {
      throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof string}\``);
    }
    if (typeof count !== "number") {
      throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof count}\``);
    }
    if (typeof options.indent !== "string") {
      throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``);
    }
    if (count === 0) {
      return string;
    }
    const regex2 = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
    return string.replace(regex2, options.indent.repeat(count));
  };
});

// node:os
var exports_os = {};
__export(exports_os, {
  uptime: () => {
    {
      return A;
    }
  },
  type: () => {
    {
      return V;
    }
  },
  totalmem: () => {
    {
      return N;
    }
  },
  tmpdir: () => {
    {
      return U;
    }
  },
  release: () => {
    {
      return x;
    }
  },
  platform: () => {
    {
      return O;
    }
  },
  networkInterfaces: () => {
    {
      return j;
    }
  },
  loadavg: () => {
    {
      return y;
    }
  },
  hostname: () => {
    {
      return k;
    }
  },
  homedir: () => {
    {
      return _;
    }
  },
  getNetworkInterfaces: () => {
    {
      return B;
    }
  },
  freemem: () => {
    {
      return I;
    }
  },
  endianness: () => {
    {
      return L;
    }
  },
  default: () => {
    {
      return E;
    }
  },
  cpus: () => {
    {
      return b;
    }
  },
  arch: () => {
    {
      return M;
    }
  },
  EOL: () => {
    {
      return X;
    }
  }
});
var c, a2, m, s, p, d, l, h, g, f, u2, E, L, k, y, A, I, N, b, V, x, M, O, U, X, _, j, B;
var init_os = __esm(() => {
  c = Object.create;
  a2 = Object.defineProperty;
  m = Object.getOwnPropertyDescriptor;
  s = Object.getOwnPropertyNames;
  p = Object.getPrototypeOf;
  d = Object.prototype.hasOwnProperty;
  l = (r2, n2) => () => (n2 || r2((n2 = { exports: {} }).exports, n2), n2.exports);
  h = (r2, n2, t2, i2) => {
    if (n2 && typeof n2 == "object" || typeof n2 == "function")
      for (let o2 of s(n2))
        !d.call(r2, o2) && o2 !== t2 && a2(r2, o2, { get: () => n2[o2], enumerable: !(i2 = m(n2, o2)) || i2.enumerable });
    return r2;
  };
  g = (r2, n2, t2) => (t2 = r2 != null ? c(p(r2)) : {}, h(n2 || !r2 || !r2.__esModule ? a2(t2, "default", { value: r2, enumerable: true }) : t2, r2));
  f = l((e2) => {
    e2.endianness = function() {
      return "LE";
    };
    e2.hostname = function() {
      return typeof location < "u" ? location.hostname : "";
    };
    e2.loadavg = function() {
      return [];
    };
    e2.uptime = function() {
      return 0;
    };
    e2.freemem = function() {
      return Number.MAX_VALUE;
    };
    e2.totalmem = function() {
      return Number.MAX_VALUE;
    };
    e2.cpus = function() {
      return [];
    };
    e2.type = function() {
      return "Browser";
    };
    e2.release = function() {
      return typeof navigator < "u" ? navigator.appVersion : "";
    };
    e2.networkInterfaces = e2.getNetworkInterfaces = function() {
      return {};
    };
    e2.arch = function() {
      return "javascript";
    };
    e2.platform = function() {
      return "browser";
    };
    e2.tmpdir = e2.tmpDir = function() {
      return "/tmp";
    };
    e2.EOL = `
`;
    e2.homedir = function() {
      return "/";
    };
  });
  u2 = g(f());
  E = u2.default;
  ({ endianness: L, hostname: k, loadavg: y, uptime: A, freemem: I, totalmem: N, cpus: b, type: V, release: x, arch: M, platform: O, tmpdir: U, EOL: X, homedir: _, networkInterfaces: j, getNetworkInterfaces: B } = u2.default);
});

// node_modules/clean-stack/index.js
var require_clean_stack = __commonJS((exports, module) => {
  var os = (init_os(), __toCommonJS(exports_os));
  var extractPathRegex = /\s+at.*(?:\(|\s)(.*)\)?/;
  var pathRegex = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)\.js:\d+:\d+)|native)/;
  var homeDir = typeof os.homedir === "undefined" ? "" : os.homedir();
  module.exports = (stack, options) => {
    options = Object.assign({ pretty: false }, options);
    return stack.replace(/\\/g, "/").split("\n").filter((line) => {
      const pathMatches = line.match(extractPathRegex);
      if (pathMatches === null || !pathMatches[1]) {
        return true;
      }
      const match = pathMatches[1];
      if (match.includes(".app/Contents/Resources/electron.asar") || match.includes(".app/Contents/Resources/default_app.asar")) {
        return false;
      }
      return !pathRegex.test(match);
    }).filter((line) => line.trim() !== "").map((line) => {
      if (options.pretty) {
        return line.replace(extractPathRegex, (m2, p1) => m2.replace(p1, p1.replace(homeDir, "~")));
      }
      return line;
    }).join("\n");
  };
});

// node_modules/aggregate-error/index.js
var require_aggregate_error = __commonJS((exports, module) => {
  var indentString = require_indent_string();
  var cleanStack = require_clean_stack();
  var cleanInternalStack = (stack) => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, "");

  class AggregateError extends Error {
    constructor(errors) {
      if (!Array.isArray(errors)) {
        throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
      }
      errors = [...errors].map((error) => {
        if (error instanceof Error) {
          return error;
        }
        if (error !== null && typeof error === "object") {
          return Object.assign(new Error(error.message), error);
        }
        return new Error(error);
      });
      let message = errors.map((error) => {
        return typeof error.stack === "string" ? cleanInternalStack(cleanStack(error.stack)) : String(error);
      }).join("\n");
      message = "\n" + indentString(message, 4);
      super(message);
      this.name = "AggregateError";
      Object.defineProperty(this, "_errors", { value: errors });
    }
    *[Symbol.iterator]() {
      for (const error of this._errors) {
        yield error;
      }
    }
  }
  module.exports = AggregateError;
});

// node_modules/@octokit/core/dist-web/index.js
init_dist_web();
var import_before_after_hook = __toESM(require_before_after_hook(), 1);
init_dist_web5();

// node_modules/@octokit/graphql/dist-web/index.js
init_dist_web5();
init_dist_web();
var _buildMessageForResponseErrors = function(data) {
  return `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n");
};
var graphql = function(request22, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
    }
    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key))
        continue;
      return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
    }
  }
  const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }
    if (!result.variables) {
      result.variables = {};
    }
    result.variables[key] = parsedOptions[key];
    return result;
  }, {});
  const baseUrl = parsedOptions.baseUrl || request22.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }
  return request22(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }
      throw new GraphqlResponseError(requestOptions, headers, response.data);
    }
    return response.data.data;
  });
};
var withDefaults3 = function(request22, newDefaults) {
  const newRequest = request22.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };
  return Object.assign(newApi, {
    defaults: withDefaults3.bind(null, newRequest),
    endpoint: newRequest.endpoint
  });
};
var withCustomRequest = function(customRequest) {
  return withDefaults3(customRequest, {
    method: "POST",
    url: "/graphql"
  });
};
var VERSION3 = "5.0.6";
var GraphqlResponseError = class extends Error {
  constructor(request22, headers, response) {
    super(_buildMessageForResponseErrors(response));
    this.request = request22;
    this.headers = headers;
    this.response = response;
    this.name = "GraphqlResponseError";
    this.errors = response.errors;
    this.data = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType"
];
var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
var graphql2 = withDefaults3(request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION3} ${getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});

// node_modules/@octokit/core/dist-web/index.js
init_dist_web6();
var VERSION4 = "4.2.4";
var Octokit = class {
  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }
        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }
    };
    return OctokitWithDefaults;
  }
  static plugin(...newPlugins) {
    var _a;
    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {
    }, _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }
  constructor(options = {}) {
    const hook2 = new import_before_after_hook.Collection;
    const requestDefaults = {
      baseUrl: request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        hook: hook2.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    requestDefaults.headers["user-agent"] = [
      options.userAgent,
      `octokit-core.js/${VERSION4} ${getUserAgent()}`
    ].filter(Boolean).join(" ");
    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }
    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }
    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }
    this.request = request.defaults(requestDefaults);
    this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign({
      debug: () => {
      },
      info: () => {
      },
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook2;
    if (!options.authStrategy) {
      if (!options.auth) {
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        const auth2 = createTokenAuth(options.auth);
        hook2.wrap("request", auth2.hook);
        this.auth = auth2;
      }
    } else {
      const { authStrategy, ...otherOptions } = options;
      const auth2 = authStrategy(Object.assign({
        request: this.request,
        log: this.log,
        octokit: this,
        octokitOptions: otherOptions
      }, options.auth));
      hook2.wrap("request", auth2.hook);
      this.auth = auth2;
    }
    const classConstructor = this.constructor;
    classConstructor.plugins.forEach((plugin) => {
      Object.assign(this, plugin(this, options));
    });
  }
};
Octokit.VERSION = VERSION4;
Octokit.plugins = [];

// node_modules/@octokit/plugin-paginate-rest/dist-web/index.js
var normalizePaginatedListResponse = function(response) {
  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization)
    return response;
  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;
  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }
  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }
  response.data.total_count = totalCount;
  return response;
};
var iterator = function(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url)
          return { done: true };
        try {
          const response = await requestMethod({ method, url, headers });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return { value: normalizedResponse };
        } catch (error) {
          if (error.status !== 409)
            throw error;
          url = "";
          return {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
};
var paginate = function(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }
  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
};
var gather = function(octokit, results, iterator2, mapFn) {
  return iterator2.next().then((result) => {
    if (result.done) {
      return results;
    }
    let earlyExit = false;
    function done() {
      earlyExit = true;
    }
    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
    if (earlyExit) {
      return results;
    }
    return gather(octokit, results, iterator2, mapFn);
  });
};
var paginateRest = function(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
};
var VERSION5 = "6.1.2";
var composePaginateRest = Object.assign(paginate, {
  iterator
});
paginateRest.VERSION = VERSION5;

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-web/index.js
var endpointsToMethods = function(octokit) {
  const newMethods = {};
  for (const scope of endpointMethodsMap.keys()) {
    newMethods[scope] = new Proxy({ octokit, scope, cache: {} }, handler);
  }
  return newMethods;
};
var decorate = function(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  function withDecorations(...args) {
    let options = requestWithDefaults.endpoint.merge(...args);
    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    }
    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }
    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }
    if (decorations.renamedParameters) {
      const options2 = requestWithDefaults.endpoint.merge(...args);
      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options2) {
          octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
          if (!(alias in options2)) {
            options2[alias] = options2[name];
          }
          delete options2[name];
        }
      }
      return requestWithDefaults(options2);
    }
    return requestWithDefaults(...args);
  }
  return Object.assign(withDecorations, requestWithDefaults);
};
var restEndpointMethods = function(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    rest: api
  };
};
var legacyRestEndpointMethods = function(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    ...api,
    rest: api
  };
};
var VERSION6 = "7.2.3";
var Endpoints = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    addSelectedRepoToRequiredWorkflow: [
      "PUT /orgs/{org}/actions/required_workflows/{required_workflow_id}/repositories/{repository_id}"
    ],
    approveWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
    ],
    cancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
    ],
    createEnvironmentVariable: [
      "POST /repositories/{repository_id}/environments/{environment_name}/variables"
    ],
    createOrUpdateEnvironmentSecret: [
      "PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: [
      "POST /orgs/{org}/actions/runners/registration-token"
    ],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/remove-token"
    ],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createRequiredWorkflow: ["POST /orgs/{org}/actions/required_workflows"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: [
      "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
    ],
    deleteActionsCacheByKey: [
      "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
    ],
    deleteArtifact: [
      "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    deleteRepoVariable: [
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    deleteRequiredWorkflow: [
      "DELETE /orgs/{org}/actions/required_workflows/{required_workflow_id}"
    ],
    deleteSelfHostedRunnerFromOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}"
    ],
    deleteSelfHostedRunnerFromRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: [
      "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
    ],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
    ],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
    ],
    generateRunnerJitconfigForOrg: [
      "POST /orgs/{org}/actions/runners/generate-jitconfig"
    ],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: [
      "GET /orgs/{org}/actions/cache/usage-by-repository"
    ],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/selected-actions"
    ],
    getAllowedActionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getEnvironmentPublicKey: [
      "GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions"
    ],
    getGithubActionsPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions"
    ],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoRequiredWorkflow: [
      "GET /repos/{org}/{repo}/actions/required_workflows/{required_workflow_id_for_repo}"
    ],
    getRepoRequiredWorkflowUsage: [
      "GET /repos/{org}/{repo}/actions/required_workflows/{required_workflow_id_for_repo}/timing"
    ],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getRequiredWorkflow: [
      "GET /orgs/{org}/actions/required_workflows/{required_workflow_id}"
    ],
    getReviewsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
    ],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/access"
    ],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
    ],
    getWorkflowUsage: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
    ],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: [
      "GET /repositories/{repository_id}/environments/{environment_name}/secrets"
    ],
    listEnvironmentVariables: [
      "GET /repositories/{repository_id}/environments/{environment_name}/variables"
    ],
    listJobsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
    ],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: [
      "GET /repos/{owner}/{repo}/actions/organization-secrets"
    ],
    listRepoOrganizationVariables: [
      "GET /repos/{owner}/{repo}/actions/organization-variables"
    ],
    listRepoRequiredWorkflows: [
      "GET /repos/{org}/{repo}/actions/required_workflows"
    ],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRequiredWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/required_workflows/{required_workflow_id_for_repo}/runs"
    ],
    listRequiredWorkflows: ["GET /orgs/{org}/actions/required_workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/downloads"
    ],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    listSelectedReposForOrgVariable: [
      "GET /orgs/{org}/actions/variables/{name}/repositories"
    ],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelectedRepositoriesRequiredWorkflow: [
      "GET /orgs/{org}/actions/required_workflows/{required_workflow_id}/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    ],
    listWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    ],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
    ],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromRequiredWorkflow: [
      "DELETE /orgs/{org}/actions/required_workflows/{required_workflow_id}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/selected-actions"
    ],
    setAllowedActionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions"
    ],
    setGithubActionsPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories"
    ],
    setSelectedReposToRequiredWorkflow: [
      "PUT /orgs/{org}/actions/required_workflows/{required_workflow_id}/repositories"
    ],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/access"
    ],
    updateEnvironmentVariable: [
      "PATCH /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
    ],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: [
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    updateRequiredWorkflow: [
      "PATCH /orgs/{org}/actions/required_workflows/{required_workflow_id}"
    ]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: [
      "DELETE /notifications/threads/{thread_id}/subscription"
    ],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: [
      "GET /users/{username}/events/orgs/{org}"
    ],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: [
      "GET /users/{username}/received_events/public"
    ],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/notifications"
    ],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: [
      "PUT /notifications/threads/{thread_id}/subscription"
    ],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: [
      "POST /app/installations/{installation_id}/access_tokens"
    ],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: [
      "GET /marketplace_listing/accounts/{account_id}"
    ],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: [
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
    ],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: [
      "GET /app/installation-requests"
    ],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: [
      "GET /user/marketplace_purchases/stubbed"
    ],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: [
      "POST /app/hook/deliveries/{delivery_id}/attempts"
    ],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: [
      "DELETE /app/installations/{installation_id}/suspended"
    ],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: [
      "GET /users/{username}/settings/billing/actions"
    ],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: [
      "GET /users/{username}/settings/billing/packages"
    ],
    getSharedStorageBillingOrg: [
      "GET /orgs/{org}/settings/billing/shared-storage"
    ],
    getSharedStorageBillingUser: [
      "GET /users/{username}/settings/billing/shared-storage"
    ]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: [
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
    ],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: [
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
    ],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: [
      "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
    ],
    rerequestSuite: [
      "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
    ],
    setSuitesPreferences: [
      "PATCH /repos/{owner}/{repo}/check-suites/preferences"
    ],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
    ],
    getCodeqlDatabase: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    listAlertInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
    ],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
    ],
    updateDefaultSetup: [
      "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
    ],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    codespaceMachinesForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/machines"
    ],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}"
    ],
    createWithPrForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
    ],
    createWithRepoForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/codespaces"
    ],
    deleteCodespacesBillingUsers: [
      "DELETE /orgs/{org}/codespaces/billing/selected_users"
    ],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: [
      "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    deleteSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}"
    ],
    exportForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/exports"
    ],
    getCodespacesForUserInOrg: [
      "GET /orgs/{org}/members/{username}/codespaces"
    ],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: [
      "GET /user/codespaces/secrets/public-key"
    ],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    getSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}"
    ],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces"
    ],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/new"
    ],
    publishForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/publish"
    ],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/machines"
    ],
    setCodespacesBilling: ["PUT /orgs/{org}/codespaces/billing"],
    setCodespacesBillingUsers: [
      "POST /orgs/{org}/codespaces/billing/selected_users"
    ],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: [
      "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
    ],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/dependabot/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
    ]
  },
  dependencyGraph: {
    createRepositorySnapshot: [
      "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
    ],
    diffRange: [
      "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
    ],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: [
      "DELETE /repos/{owner}/{repo}/interaction-limits"
    ],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
    ],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
    ],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: [
      "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
    ],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
    ],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: [
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
    ],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    removeAssignees: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    removeLabel: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
    ],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: [
      "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
    ]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: [
      "POST /markdown/raw",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    ]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/archive"
    ],
    deleteArchiveForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/archive"
    ],
    downloadArchiveForOrg: [
      "GET /orgs/{org}/migrations/{migration_id}/archive"
    ],
    getArchiveForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/archive"
    ],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportStatus: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/repositories"
    ],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}"
    ],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: [
      "PUT /orgs/{org}/outside_collaborators/{username}"
    ],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    delete: ["DELETE /orgs/{org}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    enableOrDisableSecurityProductOnAllOrgRepos: [
      "POST /orgs/{org}/{security_product}/{enablement}"
    ],
    get: ["GET /orgs/{org}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: [
      "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: [
      "GET /organizations/{org}/personal-access-tokens/{pat_id}/repositories"
    ],
    listPatGrantRequestRepositories: [
      "GET /organizations/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: [
      "GET /organizations/{org}/personal-access-token-requests"
    ],
    listPatGrants: ["GET /organizations/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: ["GET /orgs/{org}/security-managers"],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: [
      "DELETE /orgs/{org}/outside_collaborators/{username}"
    ],
    removePublicMembershipForAuthenticatedUser: [
      "DELETE /orgs/{org}/public_members/{username}"
    ],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}"
    ],
    reviewPatGrantRequest: [
      "POST /organizations/{org}/personal-access-token-requests/{pat_request_id}"
    ],
    reviewPatGrantRequestsInBulk: [
      "POST /organizations/{org}/personal-access-token-requests"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: [
      "PUT /orgs/{org}/public_members/{username}"
    ],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: [
      "PATCH /user/memberships/orgs/{org}"
    ],
    updatePatAccess: [
      "POST /organizations/{org}/personal-access-tokens/{pat_id}"
    ],
    updatePatAccesses: ["POST /organizations/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}"
    ],
    deletePackageForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    deletePackageForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}"
    ],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: [
          "packages",
          "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
        ]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}"
    ],
    getPackageForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    getPackageForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}"
    ],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: [
      "GET /user/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForOrganization: [
      "GET /orgs/{org}/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForUser: [
      "GET /users/{username}/docker/conflicts"
    ],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}"],
    createCard: ["POST /projects/columns/{column_id}/cards"],
    createColumn: ["POST /projects/{project_id}/columns"],
    createForAuthenticatedUser: ["POST /user/projects"],
    createForOrg: ["POST /orgs/{org}/projects"],
    createForRepo: ["POST /repos/{owner}/{repo}/projects"],
    delete: ["DELETE /projects/{project_id}"],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}"],
    deleteColumn: ["DELETE /projects/columns/{column_id}"],
    get: ["GET /projects/{project_id}"],
    getCard: ["GET /projects/columns/cards/{card_id}"],
    getColumn: ["GET /projects/columns/{column_id}"],
    getPermissionForUser: [
      "GET /projects/{project_id}/collaborators/{username}/permission"
    ],
    listCards: ["GET /projects/columns/{column_id}/cards"],
    listCollaborators: ["GET /projects/{project_id}/collaborators"],
    listColumns: ["GET /projects/{project_id}/columns"],
    listForOrg: ["GET /orgs/{org}/projects"],
    listForRepo: ["GET /repos/{owner}/{repo}/projects"],
    listForUser: ["GET /users/{username}/projects"],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves"],
    moveColumn: ["POST /projects/columns/{column_id}/moves"],
    removeCollaborator: [
      "DELETE /projects/{project_id}/collaborators/{username}"
    ],
    update: ["PATCH /projects/{project_id}"],
    updateCard: ["PATCH /projects/columns/cards/{card_id}"],
    updateColumn: ["PATCH /projects/columns/{column_id}"]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    deletePendingReview: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    deleteReviewComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ],
    dismissReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
    ],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    listReviewComments: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    submitReview: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
    ],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
    ],
    updateReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    updateReviewComment: [
      "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: [
      "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    createForIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
    ],
    createForIssueComment: [
      "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
    ],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: [
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: [
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: [
      "PATCH /user/repository_invitations/{invitation_id}"
    ],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: [
      "GET /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: [
      "GET /repos/{owner}/{repo}/compare/{basehead}"
    ],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: [
      "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: [
      "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateEnvironment: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployment"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createTagProtection: ["POST /repos/{owner}/{repo}/tags/protection"],
    createUsingTemplate: [
      "POST /repos/{template_owner}/{template_repo}/generate"
    ],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: [
      "DELETE /user/repository_invitations/{invitation_id}"
    ],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: [
      "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
    ],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: [
      "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: [
      "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteTagProtection: [
      "DELETE /repos/{owner}/{repo}/tags/protection/{tag_protection_id}"
    ],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: [
      "DELETE /repos/{owner}/{repo}/automated-security-fixes"
    ],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disableLfsForRepo: ["DELETE /repos/{owner}/{repo}/lfs"],
    disableVulnerabilityAlerts: [
      "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: [
      "PUT /repos/{owner}/{repo}/automated-security-fixes"
    ],
    enableLfsForRepo: ["PUT /repos/{owner}/{repo}/lfs"],
    enableVulnerabilityAlerts: [
      "PUT /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    generateReleaseNotes: [
      "POST /repos/{owner}/{repo}/releases/generate-notes"
    ],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    getWebhookDelivery: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: [
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
    ],
    listReleaseAssets: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
    ],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTagProtection: ["GET /repos/{owner}/{repo}/tags/protection"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
    ],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: [
      "DELETE /repos/{owner}/{repo}/collaborators/{username}"
    ],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: [
      "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: [
      "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: [
      "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    getAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/secret-scanning/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ]
  },
  securityAdvisories: {
    createPrivateVulnerabilityReport: [
      "POST /repos/{owner}/{repo}/security-advisories/reports"
    ],
    createRepositoryAdvisory: [
      "POST /repos/{owner}/{repo}/security-advisories"
    ],
    getRepositoryAdvisory: [
      "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: [
      "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    addOrUpdateProjectPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    addOrUpdateRepoPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    checkPermissionsForProjectInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    checkPermissionsForRepoInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    getMembershipForUserInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/invitations"
    ],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects"],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    removeProjectInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    removeRepoInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: [
      "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: [
      "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    list: ["GET /users"],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: [
      "PATCH /user/email/visibility"
    ],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};
var endpoints_default = Endpoints;
var endpointMethodsMap = new Map;
for (const [scope, endpoints] of Object.entries(endpoints_default)) {
  for (const [methodName, endpoint3] of Object.entries(endpoints)) {
    const [route, defaults, decorations] = endpoint3;
    const [method, url] = route.split(/ /);
    const endpointDefaults = Object.assign({
      method,
      url
    }, defaults);
    if (!endpointMethodsMap.has(scope)) {
      endpointMethodsMap.set(scope, new Map);
    }
    endpointMethodsMap.get(scope).set(methodName, {
      scope,
      methodName,
      endpointDefaults,
      decorations
    });
  }
}
var handler = {
  get({ octokit, scope, cache }, methodName) {
    if (cache[methodName]) {
      return cache[methodName];
    }
    const { decorations, endpointDefaults } = endpointMethodsMap.get(scope).get(methodName);
    if (decorations) {
      cache[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
    } else {
      cache[methodName] = octokit.request.defaults(endpointDefaults);
    }
    return cache[methodName];
  }
};
restEndpointMethods.VERSION = VERSION6;
legacyRestEndpointMethods.VERSION = VERSION6;

// node_modules/@octokit/plugin-retry/dist-web/index.js
var light = __toESM(require_light(), 1);
init_dist_web4();
async function errorRequest(state, octokit, error, options) {
  if (!error.request || !error.request.request) {
    throw error;
  }
  if (error.status >= 400 && !state.doNotRetry.includes(error.status)) {
    const retries = options.request.retries != null ? options.request.retries : state.retries;
    const retryAfter = Math.pow((options.request.retryCount || 0) + 1, 2);
    throw octokit.retry.retryRequest(error, retries, retryAfter);
  }
  throw error;
}
async function wrapRequest(state, octokit, request4, options) {
  const limiter = new light.default;
  limiter.on("failed", function(error, info) {
    const maxRetries = ~~error.request.request.retries;
    const after = ~~error.request.request.retryAfter;
    options.request.retryCount = info.retryCount + 1;
    if (maxRetries > info.retryCount) {
      return after * state.retryAfterBaseValue;
    }
  });
  return limiter.schedule(requestWithGraphqlErrorHandling.bind(null, state, octokit, request4), options);
}
async function requestWithGraphqlErrorHandling(state, octokit, request4, options) {
  const response = await request4(request4, options);
  if (response.data && response.data.errors && /Something went wrong while executing your query/.test(response.data.errors[0].message)) {
    const error = new RequestError(response.data.errors[0].message, 500, {
      request: options,
      response
    });
    return errorRequest(state, octokit, error, options);
  }
  return response;
}
var retry = function(octokit, octokitOptions) {
  const state = Object.assign({
    enabled: true,
    retryAfterBaseValue: 1000,
    doNotRetry: [400, 401, 403, 404, 422],
    retries: 3
  }, octokitOptions.retry);
  if (state.enabled) {
    octokit.hook.error("request", errorRequest.bind(null, state, octokit));
    octokit.hook.wrap("request", wrapRequest.bind(null, state, octokit));
  }
  return {
    retry: {
      retryRequest: (error, retries, retryAfter) => {
        error.request.request = Object.assign({}, error.request.request, {
          retries,
          retryAfter
        });
        return error;
      }
    }
  };
};
var VERSION7 = "4.1.6";
retry.VERSION = VERSION7;

// node_modules/@octokit/plugin-throttling/dist-web/index.js
var light2 = __toESM(require_light(), 1);
var wrapRequest2 = function(state, request4, options) {
  return state.retryLimiter.schedule(doRequest, state, request4, options);
};
async function doRequest(state, request4, options) {
  const isWrite = options.method !== "GET" && options.method !== "HEAD";
  const { pathname } = new URL(options.url, "http://github.test");
  const isSearch = options.method === "GET" && pathname.startsWith("/search/");
  const isGraphQL = pathname.startsWith("/graphql");
  const retryCount = ~~request4.retryCount;
  const jobOptions = retryCount > 0 ? { priority: 0, weight: 0 } : {};
  if (state.clustering) {
    jobOptions.expiration = 1000 * 60;
  }
  if (isWrite || isGraphQL) {
    await state.write.key(state.id).schedule(jobOptions, noop);
  }
  if (isWrite && state.triggersNotification(pathname)) {
    await state.notifications.key(state.id).schedule(jobOptions, noop);
  }
  if (isSearch) {
    await state.search.key(state.id).schedule(jobOptions, noop);
  }
  const req = state.global.key(state.id).schedule(jobOptions, request4, options);
  if (isGraphQL) {
    const res = await req;
    if (res.data.errors != null && res.data.errors.some((error) => error.type === "RATE_LIMITED")) {
      const error = Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
        response: res,
        data: res.data
      });
      throw error;
    }
  }
  return req;
}
var routeMatcher = function(paths) {
  const regexes = paths.map((path) => path.split("/").map((c) => c.startsWith("{") ? "(?:.+?)" : c).join("/"));
  const regex = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})[^/]*\$`;
  return new RegExp(regex, "i");
};
var throttling = function(octokit, octokitOptions) {
  const {
    enabled = true,
    Bottleneck: Bottleneck2 = light2.default,
    id = "no-id",
    timeout = 1000 * 60 * 2,
    connection
  } = octokitOptions.throttle || {};
  if (!enabled) {
    return {};
  }
  const common = { connection, timeout };
  if (groups.global == null) {
    createGroups(Bottleneck2, common);
  }
  if (octokitOptions.throttle && octokitOptions.throttle.minimalSecondaryRateRetryAfter) {
    octokit.log.warn("[@octokit/plugin-throttling] `options.throttle.minimalSecondaryRateRetryAfter` is deprecated, please use `options.throttle.fallbackSecondaryRateRetryAfter` instead");
    octokitOptions.throttle.fallbackSecondaryRateRetryAfter = octokitOptions.throttle.minimalSecondaryRateRetryAfter;
    delete octokitOptions.throttle.minimalSecondaryRateRetryAfter;
  }
  if (octokitOptions.throttle && octokitOptions.throttle.onAbuseLimit) {
    octokit.log.warn("[@octokit/plugin-throttling] `onAbuseLimit()` is deprecated and will be removed in a future release of `@octokit/plugin-throttling`, please use the `onSecondaryRateLimit` handler instead");
    octokitOptions.throttle.onSecondaryRateLimit = octokitOptions.throttle.onAbuseLimit;
    delete octokitOptions.throttle.onAbuseLimit;
  }
  const state = Object.assign({
    clustering: connection != null,
    triggersNotification,
    fallbackSecondaryRateRetryAfter: 60,
    retryAfterBaseValue: 1000,
    retryLimiter: new Bottleneck2,
    id,
    ...groups
  }, octokitOptions.throttle);
  if (typeof state.onSecondaryRateLimit !== "function" || typeof state.onRateLimit !== "function") {
    throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://octokit.github.io/rest.js/#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
  }
  const events = {};
  const emitter = new Bottleneck2.Events(events);
  events.on("secondary-limit", state.onSecondaryRateLimit);
  events.on("rate-limit", state.onRateLimit);
  events.on("error", (e) => octokit.log.warn("Error in throttling-plugin limit handler", e));
  state.retryLimiter.on("failed", async function(error, info) {
    const [state2, request4, options] = info.args;
    const { pathname } = new URL(options.url, "http://github.test");
    const shouldRetryGraphQL = pathname.startsWith("/graphql") && error.status !== 401;
    if (!(shouldRetryGraphQL || error.status === 403)) {
      return;
    }
    const retryCount = ~~request4.retryCount;
    request4.retryCount = retryCount;
    options.request.retryCount = retryCount;
    const { wantRetry, retryAfter = 0 } = await async function() {
      if (/\bsecondary rate\b/i.test(error.message)) {
        const retryAfter2 = Number(error.response.headers["retry-after"]) || state2.fallbackSecondaryRateRetryAfter;
        const wantRetry2 = await emitter.trigger("secondary-limit", retryAfter2, options, octokit, retryCount);
        return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
      }
      if (error.response.headers != null && error.response.headers["x-ratelimit-remaining"] === "0") {
        const rateLimitReset = new Date(~~error.response.headers["x-ratelimit-reset"] * 1000).getTime();
        const retryAfter2 = Math.max(Math.ceil((rateLimitReset - Date.now()) / 1000), 0);
        const wantRetry2 = await emitter.trigger("rate-limit", retryAfter2, options, octokit, retryCount);
        return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
      }
      return {};
    }();
    if (wantRetry) {
      request4.retryCount++;
      return retryAfter * state2.retryAfterBaseValue;
    }
  });
  octokit.hook.wrap("request", wrapRequest2.bind(null, state));
  return {};
};
var VERSION8 = "5.2.3";
var noop = () => Promise.resolve();
var triggersNotificationPaths = [
  "/orgs/{org}/invitations",
  "/orgs/{org}/invitations/{invitation_id}",
  "/orgs/{org}/teams/{team_slug}/discussions",
  "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
  "/repos/{owner}/{repo}/collaborators/{username}",
  "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
  "/repos/{owner}/{repo}/issues",
  "/repos/{owner}/{repo}/issues/{issue_number}/comments",
  "/repos/{owner}/{repo}/pulls",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
  "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
  "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
  "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
  "/repos/{owner}/{repo}/releases",
  "/teams/{team_id}/discussions",
  "/teams/{team_id}/discussions/{discussion_number}/comments"
];
var regex = routeMatcher(triggersNotificationPaths);
var triggersNotification = regex.test.bind(regex);
var groups = {};
var createGroups = function(Bottleneck2, common) {
  groups.global = new Bottleneck2.Group({
    id: "octokit-global",
    maxConcurrent: 10,
    ...common
  });
  groups.search = new Bottleneck2.Group({
    id: "octokit-search",
    maxConcurrent: 1,
    minTime: 2000,
    ...common
  });
  groups.write = new Bottleneck2.Group({
    id: "octokit-write",
    maxConcurrent: 1,
    minTime: 1000,
    ...common
  });
  groups.notifications = new Bottleneck2.Group({
    id: "octokit-notifications",
    maxConcurrent: 1,
    minTime: 3000,
    ...common
  });
};
throttling.VERSION = VERSION8;
throttling.triggersNotification = triggersNotification;

// node_modules/octokit/dist-web/index.js
var onRateLimit = function(retryAfter, options, octokit) {
  octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
  if (options.request.retryCount === 0) {
    octokit.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  }
};
var onSecondaryRateLimit = function(retryAfter, options, octokit) {
  octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);
  if (options.request.retryCount === 0) {
    octokit.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  }
};

// node_modules/@octokit/auth-app/dist-web/index.js
init_dist_web();
init_dist_web5();
init_dist_web11();
init_dist_web3();

// node_modules/universal-github-app-jwt/dist-web/index.bundled.js
var t = function(t2, n, r, e, i, a, o) {
  try {
    var u = t2[a](o), c = u.value;
  } catch (t3) {
    return void r(t3);
  }
  u.done ? n(c) : Promise.resolve(c).then(e, i);
};
var n = function(n2) {
  return function() {
    var r = this, e = arguments;
    return new Promise(function(i, a) {
      var o = n2.apply(r, e);
      function u(n3) {
        t(o, i, a, u, c, "next", n3);
      }
      function c(n3) {
        t(o, i, a, u, c, "throw", n3);
      }
      u(undefined);
    });
  };
};
var r = function(t2) {
  for (var n2 = new ArrayBuffer(t2.length), r2 = new Uint8Array(n2), e = 0, i = t2.length;e < i; e++)
    r2[e] = t2.charCodeAt(e);
  return n2;
};
var e = function(t2) {
  return t2.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};
var i = function(t2) {
  return e(btoa(JSON.stringify(t2)));
};
var o = function(t2) {
  return u.apply(this, arguments);
};
var u = function() {
  return (u = n(function* (t2) {
    var { id: n2, privateKey: r2, now: e2 = Math.floor(Date.now() / 1000) } = t2, i2 = e2 - 30, o2 = i2 + 600, u2 = { iat: i2, exp: o2, iss: n2 };
    return { appId: n2, expiration: o2, token: yield a({ privateKey: r2, payload: u2 }) };
  })).apply(this, arguments);
};
var a = function() {
  var t2 = n(function* (t3) {
    var { privateKey: n2, payload: a2 } = t3;
    if (/BEGIN RSA PRIVATE KEY/.test(n2))
      throw new Error("[universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#readme");
    var o2, u2 = { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } }, c = (o2 = n2.trim().split("\n").slice(1, -1).join(""), r(atob(o2))), p = yield crypto.subtle.importKey("pkcs8", c, u2, false, ["sign"]), f = function(t4, n3) {
      return "".concat(i(t4), ".").concat(i(n3));
    }({ alg: "RS256", typ: "JWT" }, a2), l = r(f), s = function(t4) {
      for (var n3 = "", r2 = new Uint8Array(t4), i2 = r2.byteLength, a3 = 0;a3 < i2; a3++)
        n3 += String.fromCharCode(r2[a3]);
      return e(btoa(n3));
    }(yield crypto.subtle.sign(u2.name, p, l));
    return "".concat(f, ".").concat(s);
  });
  return function(n2) {
    return t2.apply(this, arguments);
  };
}();

// node_modules/@octokit/auth-app/dist-web/index.js
async function getAppAuthentication({
  appId,
  privateKey,
  timeDifference
}) {
  try {
    const appAuthentication = await o({
      id: +appId,
      privateKey,
      now: timeDifference && Math.floor(Date.now() / 1000) + timeDifference
    });
    return {
      type: "app",
      token: appAuthentication.token,
      appId: appAuthentication.appId,
      expiresAt: new Date(appAuthentication.expiration * 1000).toISOString()
    };
  } catch (error) {
    if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
      throw new Error("The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'");
    } else {
      throw error;
    }
  }
}

// node_modules/lru-cache/dist/mjs/index.js
var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
var warned = new Set;
var PROCESS = typeof process === "object" && !!process ? process : {};
var emitWarning = (msg, type, code, fn) => {
  typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
var AC = globalThis.AbortController;
var AS = globalThis.AbortSignal;
if (typeof AC === "undefined") {
  AS = class AbortSignal {
    onabort;
    _onabort = [];
    reason;
    aborted = false;
    addEventListener(_, fn) {
      this._onabort.push(fn);
    }
  };
  AC = class AbortController {
    constructor() {
      warnACPolyfill();
    }
    signal = new AS;
    abort(reason) {
      if (this.signal.aborted)
        return;
      this.signal.reason = reason;
      this.signal.aborted = true;
      for (const fn of this.signal._onabort) {
        fn(reason);
      }
      this.signal.onabort?.(reason);
    }
  };
  let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
  const warnACPolyfill = () => {
    if (!printACPolyfillWarning)
      return;
    printACPolyfillWarning = false;
    emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
  };
}
var shouldWarn = (code) => !warned.has(code);
var TYPE = Symbol("type");
var isPosInt = (n2) => n2 && n2 === Math.floor(n2) && n2 > 0 && isFinite(n2);
var getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;

class ZeroArray extends Array {
  constructor(size) {
    super(size);
    this.fill(0);
  }
}

class Stack {
  heap;
  length;
  static #constructing = false;
  static create(max) {
    const HeapCls = getUintArray(max);
    if (!HeapCls)
      return [];
    Stack.#constructing = true;
    const s = new Stack(max, HeapCls);
    Stack.#constructing = false;
    return s;
  }
  constructor(max, HeapCls) {
    if (!Stack.#constructing) {
      throw new TypeError("instantiate Stack using Stack.create(n)");
    }
    this.heap = new HeapCls(max);
    this.length = 0;
  }
  push(n2) {
    this.heap[this.length++] = n2;
  }
  pop() {
    return this.heap[--this.length];
  }
}

class LRUCache {
  #max;
  #maxSize;
  #dispose;
  #disposeAfter;
  #fetchMethod;
  ttl;
  ttlResolution;
  ttlAutopurge;
  updateAgeOnGet;
  updateAgeOnHas;
  allowStale;
  noDisposeOnSet;
  noUpdateTTL;
  maxEntrySize;
  sizeCalculation;
  noDeleteOnFetchRejection;
  noDeleteOnStaleGet;
  allowStaleOnFetchAbort;
  allowStaleOnFetchRejection;
  ignoreFetchAbort;
  #size;
  #calculatedSize;
  #keyMap;
  #keyList;
  #valList;
  #next;
  #prev;
  #head;
  #tail;
  #free;
  #disposed;
  #sizes;
  #starts;
  #ttls;
  #hasDispose;
  #hasFetchMethod;
  #hasDisposeAfter;
  static unsafeExposeInternals(c) {
    return {
      starts: c.#starts,
      ttls: c.#ttls,
      sizes: c.#sizes,
      keyMap: c.#keyMap,
      keyList: c.#keyList,
      valList: c.#valList,
      next: c.#next,
      prev: c.#prev,
      get head() {
        return c.#head;
      },
      get tail() {
        return c.#tail;
      },
      free: c.#free,
      isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
      backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
      moveToTail: (index) => c.#moveToTail(index),
      indexes: (options) => c.#indexes(options),
      rindexes: (options) => c.#rindexes(options),
      isStale: (index) => c.#isStale(index)
    };
  }
  get max() {
    return this.#max;
  }
  get maxSize() {
    return this.#maxSize;
  }
  get calculatedSize() {
    return this.#calculatedSize;
  }
  get size() {
    return this.#size;
  }
  get fetchMethod() {
    return this.#fetchMethod;
  }
  get dispose() {
    return this.#dispose;
  }
  get disposeAfter() {
    return this.#disposeAfter;
  }
  constructor(options) {
    const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
    if (max !== 0 && !isPosInt(max)) {
      throw new TypeError("max option must be a nonnegative integer");
    }
    const UintArray = max ? getUintArray(max) : Array;
    if (!UintArray) {
      throw new Error("invalid max value: " + max);
    }
    this.#max = max;
    this.#maxSize = maxSize;
    this.maxEntrySize = maxEntrySize || this.#maxSize;
    this.sizeCalculation = sizeCalculation;
    if (this.sizeCalculation) {
      if (!this.#maxSize && !this.maxEntrySize) {
        throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      }
      if (typeof this.sizeCalculation !== "function") {
        throw new TypeError("sizeCalculation set to non-function");
      }
    }
    if (fetchMethod !== undefined && typeof fetchMethod !== "function") {
      throw new TypeError("fetchMethod must be a function if specified");
    }
    this.#fetchMethod = fetchMethod;
    this.#hasFetchMethod = !!fetchMethod;
    this.#keyMap = new Map;
    this.#keyList = new Array(max).fill(undefined);
    this.#valList = new Array(max).fill(undefined);
    this.#next = new UintArray(max);
    this.#prev = new UintArray(max);
    this.#head = 0;
    this.#tail = 0;
    this.#free = Stack.create(max);
    this.#size = 0;
    this.#calculatedSize = 0;
    if (typeof dispose === "function") {
      this.#dispose = dispose;
    }
    if (typeof disposeAfter === "function") {
      this.#disposeAfter = disposeAfter;
      this.#disposed = [];
    } else {
      this.#disposeAfter = undefined;
      this.#disposed = undefined;
    }
    this.#hasDispose = !!this.#dispose;
    this.#hasDisposeAfter = !!this.#disposeAfter;
    this.noDisposeOnSet = !!noDisposeOnSet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
    this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
    this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
    this.ignoreFetchAbort = !!ignoreFetchAbort;
    if (this.maxEntrySize !== 0) {
      if (this.#maxSize !== 0) {
        if (!isPosInt(this.#maxSize)) {
          throw new TypeError("maxSize must be a positive integer if specified");
        }
      }
      if (!isPosInt(this.maxEntrySize)) {
        throw new TypeError("maxEntrySize must be a positive integer if specified");
      }
      this.#initializeSizeTracking();
    }
    this.allowStale = !!allowStale;
    this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.updateAgeOnHas = !!updateAgeOnHas;
    this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
    this.ttlAutopurge = !!ttlAutopurge;
    this.ttl = ttl || 0;
    if (this.ttl) {
      if (!isPosInt(this.ttl)) {
        throw new TypeError("ttl must be a positive integer if specified");
      }
      this.#initializeTTLTracking();
    }
    if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    }
    if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
      const code = "LRU_CACHE_UNBOUNDED";
      if (shouldWarn(code)) {
        warned.add(code);
        const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
        emitWarning(msg, "UnboundedCacheWarning", code, LRUCache);
      }
    }
  }
  getRemainingTTL(key) {
    return this.#keyMap.has(key) ? Infinity : 0;
  }
  #initializeTTLTracking() {
    const ttls = new ZeroArray(this.#max);
    const starts = new ZeroArray(this.#max);
    this.#ttls = ttls;
    this.#starts = starts;
    this.#setItemTTL = (index, ttl, start = perf.now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t2 = setTimeout(() => {
          if (this.#isStale(index)) {
            this.delete(this.#keyList[index]);
          }
        }, ttl + 1);
        if (t2.unref) {
          t2.unref();
        }
      }
    };
    this.#updateItemAge = (index) => {
      starts[index] = ttls[index] !== 0 ? perf.now() : 0;
    };
    this.#statusTTL = (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        const age = status.now - start;
        status.remainingTTL = ttl - age;
      }
    };
    let cachedNow = 0;
    const getNow = () => {
      const n2 = perf.now();
      if (this.ttlResolution > 0) {
        cachedNow = n2;
        const t2 = setTimeout(() => cachedNow = 0, this.ttlResolution);
        if (t2.unref) {
          t2.unref();
        }
      }
      return n2;
    };
    this.getRemainingTTL = (key) => {
      const index = this.#keyMap.get(key);
      if (index === undefined) {
        return 0;
      }
      const ttl = ttls[index];
      const start = starts[index];
      if (ttl === 0 || start === 0) {
        return Infinity;
      }
      const age = (cachedNow || getNow()) - start;
      return ttl - age;
    };
    this.#isStale = (index) => {
      return ttls[index] !== 0 && starts[index] !== 0 && (cachedNow || getNow()) - starts[index] > ttls[index];
    };
  }
  #updateItemAge = () => {
  };
  #statusTTL = () => {
  };
  #setItemTTL = () => {
  };
  #isStale = () => false;
  #initializeSizeTracking() {
    const sizes = new ZeroArray(this.#max);
    this.#calculatedSize = 0;
    this.#sizes = sizes;
    this.#removeItemSize = (index) => {
      this.#calculatedSize -= sizes[index];
      sizes[index] = 0;
    };
    this.#requireSize = (k, v, size, sizeCalculation) => {
      if (this.#isBackgroundFetch(v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation must be a function");
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError("sizeCalculation return invalid (expect positive integer)");
          }
        } else {
          throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        }
      }
      return size;
    };
    this.#addItemSize = (index, size, status) => {
      sizes[index] = size;
      if (this.#maxSize) {
        const maxSize = this.#maxSize - sizes[index];
        while (this.#calculatedSize > maxSize) {
          this.#evict(true);
        }
      }
      this.#calculatedSize += sizes[index];
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = this.#calculatedSize;
      }
    };
  }
  #removeItemSize = (_i) => {
  };
  #addItemSize = (_i, _s, _st) => {
  };
  #requireSize = (_k, _v, size, sizeCalculation) => {
    if (size || sizeCalculation) {
      throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
    }
    return 0;
  };
  *#indexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i2 = this.#tail;; ) {
        if (!this.#isValidIndex(i2)) {
          break;
        }
        if (allowStale || !this.#isStale(i2)) {
          yield i2;
        }
        if (i2 === this.#head) {
          break;
        } else {
          i2 = this.#prev[i2];
        }
      }
    }
  }
  *#rindexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i2 = this.#head;; ) {
        if (!this.#isValidIndex(i2)) {
          break;
        }
        if (allowStale || !this.#isStale(i2)) {
          yield i2;
        }
        if (i2 === this.#tail) {
          break;
        } else {
          i2 = this.#next[i2];
        }
      }
    }
  }
  #isValidIndex(index) {
    return index !== undefined && this.#keyMap.get(this.#keyList[index]) === index;
  }
  *entries() {
    for (const i2 of this.#indexes()) {
      if (this.#valList[i2] !== undefined && this.#keyList[i2] !== undefined && !this.#isBackgroundFetch(this.#valList[i2])) {
        yield [this.#keyList[i2], this.#valList[i2]];
      }
    }
  }
  *rentries() {
    for (const i2 of this.#rindexes()) {
      if (this.#valList[i2] !== undefined && this.#keyList[i2] !== undefined && !this.#isBackgroundFetch(this.#valList[i2])) {
        yield [this.#keyList[i2], this.#valList[i2]];
      }
    }
  }
  *keys() {
    for (const i2 of this.#indexes()) {
      const k = this.#keyList[i2];
      if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i2])) {
        yield k;
      }
    }
  }
  *rkeys() {
    for (const i2 of this.#rindexes()) {
      const k = this.#keyList[i2];
      if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i2])) {
        yield k;
      }
    }
  }
  *values() {
    for (const i2 of this.#indexes()) {
      const v = this.#valList[i2];
      if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i2])) {
        yield this.#valList[i2];
      }
    }
  }
  *rvalues() {
    for (const i2 of this.#rindexes()) {
      const v = this.#valList[i2];
      if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i2])) {
        yield this.#valList[i2];
      }
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  find(fn, getOptions = {}) {
    for (const i2 of this.#indexes()) {
      const v = this.#valList[i2];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === undefined)
        continue;
      if (fn(value, this.#keyList[i2], this)) {
        return this.get(this.#keyList[i2], getOptions);
      }
    }
  }
  forEach(fn, thisp = this) {
    for (const i2 of this.#indexes()) {
      const v = this.#valList[i2];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === undefined)
        continue;
      fn.call(thisp, value, this.#keyList[i2], this);
    }
  }
  rforEach(fn, thisp = this) {
    for (const i2 of this.#rindexes()) {
      const v = this.#valList[i2];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === undefined)
        continue;
      fn.call(thisp, value, this.#keyList[i2], this);
    }
  }
  purgeStale() {
    let deleted = false;
    for (const i2 of this.#rindexes({ allowStale: true })) {
      if (this.#isStale(i2)) {
        this.delete(this.#keyList[i2]);
        deleted = true;
      }
    }
    return deleted;
  }
  dump() {
    const arr = [];
    for (const i2 of this.#indexes({ allowStale: true })) {
      const key = this.#keyList[i2];
      const v = this.#valList[i2];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === undefined || key === undefined)
        continue;
      const entry = { value };
      if (this.#ttls && this.#starts) {
        entry.ttl = this.#ttls[i2];
        const age = perf.now() - this.#starts[i2];
        entry.start = Math.floor(Date.now() - age);
      }
      if (this.#sizes) {
        entry.size = this.#sizes[i2];
      }
      arr.unshift([key, entry]);
    }
    return arr;
  }
  load(arr) {
    this.clear();
    for (const [key, entry] of arr) {
      if (entry.start) {
        const age = Date.now() - entry.start;
        entry.start = perf.now() - age;
      }
      this.set(key, entry.value, entry);
    }
  }
  set(k, v, setOptions = {}) {
    if (v === undefined) {
      this.delete(k);
      return this;
    }
    const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
    let { noUpdateTTL = this.noUpdateTTL } = setOptions;
    const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
    if (this.maxEntrySize && size > this.maxEntrySize) {
      if (status) {
        status.set = "miss";
        status.maxEntrySizeExceeded = true;
      }
      this.delete(k);
      return this;
    }
    let index = this.#size === 0 ? undefined : this.#keyMap.get(k);
    if (index === undefined) {
      index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
      this.#keyList[index] = k;
      this.#valList[index] = v;
      this.#keyMap.set(k, index);
      this.#next[this.#tail] = index;
      this.#prev[index] = this.#tail;
      this.#tail = index;
      this.#size++;
      this.#addItemSize(index, size, status);
      if (status)
        status.set = "add";
      noUpdateTTL = false;
    } else {
      this.#moveToTail(index);
      const oldVal = this.#valList[index];
      if (v !== oldVal) {
        if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
          oldVal.__abortController.abort(new Error("replaced"));
        } else if (!noDisposeOnSet) {
          if (this.#hasDispose) {
            this.#dispose?.(oldVal, k, "set");
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([oldVal, k, "set"]);
          }
        }
        this.#removeItemSize(index);
        this.#addItemSize(index, size, status);
        this.#valList[index] = v;
        if (status) {
          status.set = "replace";
          const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
          if (oldValue !== undefined)
            status.oldValue = oldValue;
        }
      } else if (status) {
        status.set = "update";
      }
    }
    if (ttl !== 0 && !this.#ttls) {
      this.#initializeTTLTracking();
    }
    if (this.#ttls) {
      if (!noUpdateTTL) {
        this.#setItemTTL(index, ttl, start);
      }
      if (status)
        this.#statusTTL(status, index);
    }
    if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return this;
  }
  pop() {
    try {
      while (this.#size) {
        const val = this.#valList[this.#head];
        this.#evict(true);
        if (this.#isBackgroundFetch(val)) {
          if (val.__staleWhileFetching) {
            return val.__staleWhileFetching;
          }
        } else if (val !== undefined) {
          return val;
        }
      }
    } finally {
      if (this.#hasDisposeAfter && this.#disposed) {
        const dt = this.#disposed;
        let task;
        while (task = dt?.shift()) {
          this.#disposeAfter?.(...task);
        }
      }
    }
  }
  #evict(free) {
    const head = this.#head;
    const k = this.#keyList[head];
    const v = this.#valList[head];
    if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
      v.__abortController.abort(new Error("evicted"));
    } else if (this.#hasDispose || this.#hasDisposeAfter) {
      if (this.#hasDispose) {
        this.#dispose?.(v, k, "evict");
      }
      if (this.#hasDisposeAfter) {
        this.#disposed?.push([v, k, "evict"]);
      }
    }
    this.#removeItemSize(head);
    if (free) {
      this.#keyList[head] = undefined;
      this.#valList[head] = undefined;
      this.#free.push(head);
    }
    if (this.#size === 1) {
      this.#head = this.#tail = 0;
      this.#free.length = 0;
    } else {
      this.#head = this.#next[head];
    }
    this.#keyMap.delete(k);
    this.#size--;
    return head;
  }
  has(k, hasOptions = {}) {
    const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
    const index = this.#keyMap.get(k);
    if (index !== undefined) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === undefined) {
        return false;
      }
      if (!this.#isStale(index)) {
        if (updateAgeOnHas) {
          this.#updateItemAge(index);
        }
        if (status) {
          status.has = "hit";
          this.#statusTTL(status, index);
        }
        return true;
      } else if (status) {
        status.has = "stale";
        this.#statusTTL(status, index);
      }
    } else if (status) {
      status.has = "miss";
    }
    return false;
  }
  peek(k, peekOptions = {}) {
    const { allowStale = this.allowStale } = peekOptions;
    const index = this.#keyMap.get(k);
    if (index !== undefined && (allowStale || !this.#isStale(index))) {
      const v = this.#valList[index];
      return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    }
  }
  #backgroundFetch(k, index, options, context) {
    const v = index === undefined ? undefined : this.#valList[index];
    if (this.#isBackgroundFetch(v)) {
      return v;
    }
    const ac = new AC;
    const { signal } = options;
    signal?.addEventListener("abort", () => ac.abort(signal.reason), {
      signal: ac.signal
    });
    const fetchOpts = {
      signal: ac.signal,
      options,
      context
    };
    const cb = (v2, updateCache = false) => {
      const { aborted } = ac.signal;
      const ignoreAbort = options.ignoreFetchAbort && v2 !== undefined;
      if (options.status) {
        if (aborted && !updateCache) {
          options.status.fetchAborted = true;
          options.status.fetchError = ac.signal.reason;
          if (ignoreAbort)
            options.status.fetchAbortIgnored = true;
        } else {
          options.status.fetchResolved = true;
        }
      }
      if (aborted && !ignoreAbort && !updateCache) {
        return fetchFail(ac.signal.reason);
      }
      const bf2 = p;
      if (this.#valList[index] === p) {
        if (v2 === undefined) {
          if (bf2.__staleWhileFetching) {
            this.#valList[index] = bf2.__staleWhileFetching;
          } else {
            this.delete(k);
          }
        } else {
          if (options.status)
            options.status.fetchUpdated = true;
          this.set(k, v2, fetchOpts.options);
        }
      }
      return v2;
    };
    const eb = (er) => {
      if (options.status) {
        options.status.fetchRejected = true;
        options.status.fetchError = er;
      }
      return fetchFail(er);
    };
    const fetchFail = (er) => {
      const { aborted } = ac.signal;
      const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
      const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
      const noDelete = allowStale || options.noDeleteOnFetchRejection;
      const bf2 = p;
      if (this.#valList[index] === p) {
        const del = !noDelete || bf2.__staleWhileFetching === undefined;
        if (del) {
          this.delete(k);
        } else if (!allowStaleAborted) {
          this.#valList[index] = bf2.__staleWhileFetching;
        }
      }
      if (allowStale) {
        if (options.status && bf2.__staleWhileFetching !== undefined) {
          options.status.returnedStale = true;
        }
        return bf2.__staleWhileFetching;
      } else if (bf2.__returned === bf2) {
        throw er;
      }
    };
    const pcall = (res, rej) => {
      const fmp = this.#fetchMethod?.(k, v, fetchOpts);
      if (fmp && fmp instanceof Promise) {
        fmp.then((v2) => res(v2), rej);
      }
      ac.signal.addEventListener("abort", () => {
        if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
          res();
          if (options.allowStaleOnFetchAbort) {
            res = (v2) => cb(v2, true);
          }
        }
      });
    };
    if (options.status)
      options.status.fetchDispatched = true;
    const p = new Promise(pcall).then(cb, eb);
    const bf = Object.assign(p, {
      __abortController: ac,
      __staleWhileFetching: v,
      __returned: undefined
    });
    if (index === undefined) {
      this.set(k, bf, { ...fetchOpts.options, status: undefined });
      index = this.#keyMap.get(k);
    } else {
      this.#valList[index] = bf;
    }
    return bf;
  }
  #isBackgroundFetch(p) {
    if (!this.#hasFetchMethod)
      return false;
    const b = p;
    return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
  }
  async fetch(k, fetchOptions = {}) {
    const {
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      ttl = this.ttl,
      noDisposeOnSet = this.noDisposeOnSet,
      size = 0,
      sizeCalculation = this.sizeCalculation,
      noUpdateTTL = this.noUpdateTTL,
      noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
      allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
      ignoreFetchAbort = this.ignoreFetchAbort,
      allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
      context,
      forceRefresh = false,
      status,
      signal
    } = fetchOptions;
    if (!this.#hasFetchMethod) {
      if (status)
        status.fetch = "get";
      return this.get(k, {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        status
      });
    }
    const options = {
      allowStale,
      updateAgeOnGet,
      noDeleteOnStaleGet,
      ttl,
      noDisposeOnSet,
      size,
      sizeCalculation,
      noUpdateTTL,
      noDeleteOnFetchRejection,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort,
      status,
      signal
    };
    let index = this.#keyMap.get(k);
    if (index === undefined) {
      if (status)
        status.fetch = "miss";
      const p = this.#backgroundFetch(k, index, options, context);
      return p.__returned = p;
    } else {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        const stale = allowStale && v.__staleWhileFetching !== undefined;
        if (status) {
          status.fetch = "inflight";
          if (stale)
            status.returnedStale = true;
        }
        return stale ? v.__staleWhileFetching : v.__returned = v;
      }
      const isStale = this.#isStale(index);
      if (!forceRefresh && !isStale) {
        if (status)
          status.fetch = "hit";
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        if (status)
          this.#statusTTL(status, index);
        return v;
      }
      const p = this.#backgroundFetch(k, index, options, context);
      const hasStale = p.__staleWhileFetching !== undefined;
      const staleVal = hasStale && allowStale;
      if (status) {
        status.fetch = isStale ? "stale" : "refresh";
        if (staleVal && isStale)
          status.returnedStale = true;
      }
      return staleVal ? p.__staleWhileFetching : p.__returned = p;
    }
  }
  get(k, getOptions = {}) {
    const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
    const index = this.#keyMap.get(k);
    if (index !== undefined) {
      const value = this.#valList[index];
      const fetching = this.#isBackgroundFetch(value);
      if (status)
        this.#statusTTL(status, index);
      if (this.#isStale(index)) {
        if (status)
          status.get = "stale";
        if (!fetching) {
          if (!noDeleteOnStaleGet) {
            this.delete(k);
          }
          if (status && allowStale)
            status.returnedStale = true;
          return allowStale ? value : undefined;
        } else {
          if (status && allowStale && value.__staleWhileFetching !== undefined) {
            status.returnedStale = true;
          }
          return allowStale ? value.__staleWhileFetching : undefined;
        }
      } else {
        if (status)
          status.get = "hit";
        if (fetching) {
          return value.__staleWhileFetching;
        }
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        return value;
      }
    } else if (status) {
      status.get = "miss";
    }
  }
  #connect(p, n2) {
    this.#prev[n2] = p;
    this.#next[p] = n2;
  }
  #moveToTail(index) {
    if (index !== this.#tail) {
      if (index === this.#head) {
        this.#head = this.#next[index];
      } else {
        this.#connect(this.#prev[index], this.#next[index]);
      }
      this.#connect(this.#tail, index);
      this.#tail = index;
    }
  }
  delete(k) {
    let deleted = false;
    if (this.#size !== 0) {
      const index = this.#keyMap.get(k);
      if (index !== undefined) {
        deleted = true;
        if (this.#size === 1) {
          this.clear();
        } else {
          this.#removeItemSize(index);
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("deleted"));
          } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
              this.#dispose?.(v, k, "delete");
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v, k, "delete"]);
            }
          }
          this.#keyMap.delete(k);
          this.#keyList[index] = undefined;
          this.#valList[index] = undefined;
          if (index === this.#tail) {
            this.#tail = this.#prev[index];
          } else if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            this.#next[this.#prev[index]] = this.#next[index];
            this.#prev[this.#next[index]] = this.#prev[index];
          }
          this.#size--;
          this.#free.push(index);
        }
      }
    }
    if (this.#hasDisposeAfter && this.#disposed?.length) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return deleted;
  }
  clear() {
    for (const index of this.#rindexes({ allowStale: true })) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        v.__abortController.abort(new Error("deleted"));
      } else {
        const k = this.#keyList[index];
        if (this.#hasDispose) {
          this.#dispose?.(v, k, "delete");
        }
        if (this.#hasDisposeAfter) {
          this.#disposed?.push([v, k, "delete"]);
        }
      }
    }
    this.#keyMap.clear();
    this.#valList.fill(undefined);
    this.#keyList.fill(undefined);
    if (this.#ttls && this.#starts) {
      this.#ttls.fill(0);
      this.#starts.fill(0);
    }
    if (this.#sizes) {
      this.#sizes.fill(0);
    }
    this.#head = 0;
    this.#tail = 0;
    this.#free.length = 0;
    this.#calculatedSize = 0;
    this.#size = 0;
    if (this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
  }
}

// node_modules/@octokit/auth-app/dist-web/index.js
init_dist_web10();
var getCache = function() {
  return new LRUCache({
    max: 15000,
    ttl: 1000 * 60 * 59
  });
};
async function get(cache, options) {
  const cacheKey = optionsToCacheKey(options);
  const result = await cache.get(cacheKey);
  if (!result) {
    return;
  }
  const [
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissionsString,
    singleFileName
  ] = result.split("|");
  const permissions = options.permissions || permissionsString.split(/,/).reduce((permissions2, string) => {
    if (/!$/.test(string)) {
      permissions2[string.slice(0, -1)] = "write";
    } else {
      permissions2[string] = "read";
    }
    return permissions2;
  }, {});
  return {
    token,
    createdAt,
    expiresAt,
    permissions,
    repositoryIds: options.repositoryIds,
    repositoryNames: options.repositoryNames,
    singleFileName,
    repositorySelection
  };
}
async function set(cache, options, data) {
  const key = optionsToCacheKey(options);
  const permissionsString = options.permissions ? "" : Object.keys(data.permissions).map((name) => `${name}${data.permissions[name] === "write" ? "!" : ""}`).join(",");
  const value = [
    data.token,
    data.createdAt,
    data.expiresAt,
    data.repositorySelection,
    permissionsString,
    data.singleFileName
  ].join("|");
  await cache.set(key, value);
}
var optionsToCacheKey = function({
  installationId,
  permissions = {},
  repositoryIds = [],
  repositoryNames = []
}) {
  const permissionsString = Object.keys(permissions).sort().map((name) => permissions[name] === "read" ? name : `${name}!`).join(",");
  const repositoryIdsString = repositoryIds.sort().join(",");
  const repositoryNamesString = repositoryNames.join(",");
  return [
    installationId,
    repositoryIdsString,
    repositoryNamesString,
    permissionsString
  ].filter(Boolean).join("|");
};
var toTokenAuthentication = function({
  installationId,
  token,
  createdAt,
  expiresAt,
  repositorySelection,
  permissions,
  repositoryIds,
  repositoryNames,
  singleFileName
}) {
  return Object.assign({
    type: "token",
    tokenType: "installation",
    token,
    installationId,
    permissions,
    createdAt,
    expiresAt,
    repositorySelection
  }, repositoryIds ? { repositoryIds } : null, repositoryNames ? { repositoryNames } : null, singleFileName ? { singleFileName } : null);
};
async function getInstallationAuthentication(state, options, customRequest) {
  const installationId = Number(options.installationId || state.installationId);
  if (!installationId) {
    throw new Error("[@octokit/auth-app] installationId option is required for installation authentication.");
  }
  if (options.factory) {
    const { type, factory, oauthApp, ...factoryAuthOptions } = {
      ...state,
      ...options
    };
    return factory(factoryAuthOptions);
  }
  const optionsWithInstallationTokenFromState = Object.assign({ installationId }, options);
  if (!options.refresh) {
    const result = await get(state.cache, optionsWithInstallationTokenFromState);
    if (result) {
      const {
        token: token2,
        createdAt: createdAt2,
        expiresAt: expiresAt2,
        permissions: permissions2,
        repositoryIds: repositoryIds2,
        repositoryNames: repositoryNames2,
        singleFileName: singleFileName2,
        repositorySelection: repositorySelection2
      } = result;
      return toTokenAuthentication({
        installationId,
        token: token2,
        createdAt: createdAt2,
        expiresAt: expiresAt2,
        permissions: permissions2,
        repositorySelection: repositorySelection2,
        repositoryIds: repositoryIds2,
        repositoryNames: repositoryNames2,
        singleFileName: singleFileName2
      });
    }
  }
  const appAuthentication = await getAppAuthentication(state);
  const request18 = customRequest || state.request;
  const {
    data: {
      token,
      expires_at: expiresAt,
      repositories,
      permissions: permissionsOptional,
      repository_selection: repositorySelectionOptional,
      single_file: singleFileName
    }
  } = await request18("POST /app/installations/{installation_id}/access_tokens", {
    installation_id: installationId,
    repository_ids: options.repositoryIds,
    repositories: options.repositoryNames,
    permissions: options.permissions,
    mediaType: {
      previews: ["machine-man"]
    },
    headers: {
      authorization: `bearer ${appAuthentication.token}`
    }
  });
  const permissions = permissionsOptional || {};
  const repositorySelection = repositorySelectionOptional || "all";
  const repositoryIds = repositories ? repositories.map((r2) => r2.id) : undefined;
  const repositoryNames = repositories ? repositories.map((repo) => repo.name) : undefined;
  const createdAt = (new Date()).toISOString();
  await set(state.cache, optionsWithInstallationTokenFromState, {
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    repositoryNames,
    singleFileName
  });
  return toTokenAuthentication({
    installationId,
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    repositoryNames,
    singleFileName
  });
}
async function auth5(state, authOptions) {
  switch (authOptions.type) {
    case "app":
      return getAppAuthentication(state);
    case "oauth":
      state.log.warn(new Deprecation(`[@octokit/auth-app] {type: "oauth"} is deprecated. Use {type: "oauth-app"} instead`));
    case "oauth-app":
      return state.oauthApp({ type: "oauth-app" });
    case "installation":
      return getInstallationAuthentication(state, {
        ...authOptions,
        type: "installation"
      });
    case "oauth-user":
      return state.oauthApp(authOptions);
    default:
      throw new Error(`Invalid auth type: ${authOptions.type}`);
  }
}
var routeMatcher2 = function(paths) {
  const regexes = paths.map((p) => p.split("/").map((c) => c.startsWith("{") ? "(?:.+?)" : c).join("/"));
  const regex2 = `^(?:${regexes.map((r2) => `(?:${r2})`).join("|")})\$`;
  return new RegExp(regex2, "i");
};
var requiresAppAuth = function(url) {
  return !!url && REGEX.test(url.split("?")[0]);
};
var isNotTimeSkewError = function(error) {
  return !(error.message.match(/'Expiration time' claim \('exp'\) must be a numeric value representing the future time at which the assertion expires/) || error.message.match(/'Issued at' claim \('iat'\) must be an Integer representing the time that the assertion was issued/));
};
async function hook5(state, request18, route, parameters) {
  const endpoint3 = request18.endpoint.merge(route, parameters);
  const url = endpoint3.url;
  if (/\/login\/oauth\/access_token$/.test(url)) {
    return request18(endpoint3);
  }
  if (requiresAppAuth(url.replace(request18.endpoint.DEFAULTS.baseUrl, ""))) {
    const { token: token2 } = await getAppAuthentication(state);
    endpoint3.headers.authorization = `bearer ${token2}`;
    let response;
    try {
      response = await request18(endpoint3);
    } catch (error) {
      if (isNotTimeSkewError(error)) {
        throw error;
      }
      if (typeof error.response.headers.date === "undefined") {
        throw error;
      }
      const diff = Math.floor((Date.parse(error.response.headers.date) - Date.parse((new Date()).toString())) / 1000);
      state.log.warn(error.message);
      state.log.warn(`[@octokit/auth-app] GitHub API time and system time are different by ${diff} seconds. Retrying request with the difference accounted for.`);
      const { token: token3 } = await getAppAuthentication({
        ...state,
        timeDifference: diff
      });
      endpoint3.headers.authorization = `bearer ${token3}`;
      return request18(endpoint3);
    }
    return response;
  }
  if (requiresBasicAuth(url)) {
    const authentication = await state.oauthApp({ type: "oauth-app" });
    endpoint3.headers.authorization = authentication.headers.authorization;
    return request18(endpoint3);
  }
  const { token, createdAt } = await getInstallationAuthentication(state, {}, request18);
  endpoint3.headers.authorization = `token ${token}`;
  return sendRequestWithRetries(state, request18, endpoint3, createdAt);
}
async function sendRequestWithRetries(state, request18, options, createdAt, retries = 0) {
  const timeSinceTokenCreationInMs = +new Date - +new Date(createdAt);
  try {
    return await request18(options);
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }
    if (timeSinceTokenCreationInMs >= FIVE_SECONDS_IN_MS) {
      if (retries > 0) {
        error.message = `After ${retries} retries within ${timeSinceTokenCreationInMs / 1000}s of creating the installation access token, the response remains 401. At this point, the cause may be an authentication problem or a system outage. Please check https://www.githubstatus.com for status information`;
      }
      throw error;
    }
    ++retries;
    const awaitTime = retries * 1000;
    state.log.warn(`[@octokit/auth-app] Retrying after 401 response to account for token replication delay (retry: ${retries}, wait: ${awaitTime / 1000}s)`);
    await new Promise((resolve) => setTimeout(resolve, awaitTime));
    return sendRequestWithRetries(state, request18, options, createdAt, retries);
  }
}
var createAppAuth = function(options) {
  if (!options.appId) {
    throw new Error("[@octokit/auth-app] appId option is required");
  }
  if (!Number.isFinite(+options.appId)) {
    throw new Error("[@octokit/auth-app] appId option must be a number or numeric string");
  }
  if (!options.privateKey) {
    throw new Error("[@octokit/auth-app] privateKey option is required");
  }
  if ("installationId" in options && !options.installationId) {
    throw new Error("[@octokit/auth-app] installationId is set to a falsy value");
  }
  const log = Object.assign({
    warn: console.warn.bind(console)
  }, options.log);
  const request18 = options.request || request.defaults({
    headers: {
      "user-agent": `octokit-auth-app.js/${VERSION13} ${getUserAgent()}`
    }
  });
  const state = Object.assign({
    request: request18,
    cache: getCache()
  }, options, options.installationId ? { installationId: Number(options.installationId) } : {}, {
    log,
    oauthApp: createOAuthAppAuth({
      clientType: "github-app",
      clientId: options.clientId || "",
      clientSecret: options.clientSecret || "",
      request: request18
    })
  });
  return Object.assign(auth5.bind(null, state), {
    hook: hook5.bind(null, state)
  });
};
var PATHS = [
  "/app",
  "/app/hook/config",
  "/app/hook/deliveries",
  "/app/hook/deliveries/{delivery_id}",
  "/app/hook/deliveries/{delivery_id}/attempts",
  "/app/installations",
  "/app/installations/{installation_id}",
  "/app/installations/{installation_id}/access_tokens",
  "/app/installations/{installation_id}/suspended",
  "/marketplace_listing/accounts/{account_id}",
  "/marketplace_listing/plan",
  "/marketplace_listing/plans",
  "/marketplace_listing/plans/{plan_id}/accounts",
  "/marketplace_listing/stubbed/accounts/{account_id}",
  "/marketplace_listing/stubbed/plan",
  "/marketplace_listing/stubbed/plans",
  "/marketplace_listing/stubbed/plans/{plan_id}/accounts",
  "/orgs/{org}/installation",
  "/repos/{owner}/{repo}/installation",
  "/users/{username}/installation"
];
var REGEX = routeMatcher2(PATHS);
var FIVE_SECONDS_IN_MS = 5 * 1000;
var VERSION13 = "4.0.13";

// node_modules/@octokit/app/dist-web/index.js
var oauth_app = __toESM(require_dist_node5(), 1);

// node_modules/@octokit/webhooks/dist-web/index.js
var import_aggregate_error = __toESM(require_aggregate_error(), 1);
var handleEventHandlers = function(state, webhookName, handler2) {
  if (!state.hooks[webhookName]) {
    state.hooks[webhookName] = [];
  }
  state.hooks[webhookName].push(handler2);
};
var receiverOn = function(state, webhookNameOrNames, handler2) {
  if (Array.isArray(webhookNameOrNames)) {
    webhookNameOrNames.forEach((webhookName) => receiverOn(state, webhookName, handler2));
    return;
  }
  if (["*", "error"].includes(webhookNameOrNames)) {
    const webhookName = webhookNameOrNames === "*" ? "any" : webhookNameOrNames;
    const message = `Using the "${webhookNameOrNames}" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.on${webhookName.charAt(0).toUpperCase() + webhookName.slice(1)}() method instead`;
    throw new Error(message);
  }
  if (!emitterEventNames.includes(webhookNameOrNames)) {
    state.log.warn(`"${webhookNameOrNames}" is not a known webhook name (https://developer.github.com/v3/activity/events/types/)`);
  }
  handleEventHandlers(state, webhookNameOrNames, handler2);
};
var receiverOnAny = function(state, handler2) {
  handleEventHandlers(state, "*", handler2);
};
var receiverOnError = function(state, handler2) {
  handleEventHandlers(state, "error", handler2);
};
var wrapErrorHandler = function(handler2, error) {
  let returnValue;
  try {
    returnValue = handler2(error);
  } catch (error2) {
    console.log('FATAL: Error occurred in "error" event handler');
    console.log(error2);
  }
  if (returnValue && returnValue.catch) {
    returnValue.catch((error2) => {
      console.log('FATAL: Error occurred in "error" event handler');
      console.log(error2);
    });
  }
};
var getHooks = function(state, eventPayloadAction, eventName) {
  const hooks = [state.hooks[eventName], state.hooks["*"]];
  if (eventPayloadAction) {
    hooks.unshift(state.hooks[`${eventName}.${eventPayloadAction}`]);
  }
  return [].concat(...hooks.filter(Boolean));
};
var receiverHandle = function(state, event) {
  const errorHandlers = state.hooks.error || [];
  if (event instanceof Error) {
    const error = Object.assign(new import_aggregate_error.default([event]), {
      event,
      errors: [event]
    });
    errorHandlers.forEach((handler2) => wrapErrorHandler(handler2, error));
    return Promise.reject(error);
  }
  if (!event || !event.name) {
    throw new import_aggregate_error.default(["Event name not passed"]);
  }
  if (!event.payload) {
    throw new import_aggregate_error.default(["Event payload not passed"]);
  }
  const hooks = getHooks(state, "action" in event.payload ? event.payload.action : null, event.name);
  if (hooks.length === 0) {
    return Promise.resolve();
  }
  const errors = [];
  const promises = hooks.map((handler2) => {
    let promise = Promise.resolve(event);
    if (state.transform) {
      promise = promise.then(state.transform);
    }
    return promise.then((event2) => {
      return handler2(event2);
    }).catch((error) => errors.push(Object.assign(error, { event })));
  });
  return Promise.all(promises).then(() => {
    if (errors.length === 0) {
      return;
    }
    const error = new import_aggregate_error.default(errors);
    Object.assign(error, {
      event,
      errors
    });
    errorHandlers.forEach((handler2) => wrapErrorHandler(handler2, error));
    throw error;
  });
};
var removeListener = function(state, webhookNameOrNames, handler2) {
  if (Array.isArray(webhookNameOrNames)) {
    webhookNameOrNames.forEach((webhookName) => removeListener(state, webhookName, handler2));
    return;
  }
  if (!state.hooks[webhookNameOrNames]) {
    return;
  }
  for (let i2 = state.hooks[webhookNameOrNames].length - 1;i2 >= 0; i2--) {
    if (state.hooks[webhookNameOrNames][i2] === handler2) {
      state.hooks[webhookNameOrNames].splice(i2, 1);
      return;
    }
  }
};
var createEventHandler = function(options) {
  const state = {
    hooks: {},
    log: createLogger(options && options.log)
  };
  if (options && options.transform) {
    state.transform = options.transform;
  }
  return {
    on: receiverOn.bind(null, state),
    onAny: receiverOnAny.bind(null, state),
    onError: receiverOnError.bind(null, state),
    removeListener: removeListener.bind(null, state),
    receive: receiverHandle.bind(null, state)
  };
};

// node_modules/@octokit/webhooks-methods/dist-web/index.js
var hexToUInt8Array = function(string) {
  const pairs = string.match(/[\dA-F]{2}/gi);
  const integers = pairs.map(function(s2) {
    return parseInt(s2, 16);
  });
  return new Uint8Array(integers);
};
var UInt8ArrayToHex = function(signature) {
  return Array.prototype.map.call(new Uint8Array(signature), (x2) => x2.toString(16).padStart(2, "0")).join("");
};
var getHMACHashName = function(algorithm) {
  return {
    [Algorithm.SHA1]: "SHA-1",
    [Algorithm.SHA256]: "SHA-256"
  }[algorithm];
};
async function importKey(secret, algorithm) {
  return crypto.subtle.importKey("raw", enc.encode(secret), {
    name: "HMAC",
    hash: { name: getHMACHashName(algorithm) }
  }, false, ["sign", "verify"]);
}
async function sign(options, payload) {
  const { secret, algorithm } = typeof options === "object" ? {
    secret: options.secret,
    algorithm: options.algorithm || Algorithm.SHA256
  } : { secret: options, algorithm: Algorithm.SHA256 };
  if (!secret || !payload) {
    throw new TypeError("[@octokit/webhooks-methods] secret & payload required for sign()");
  }
  if (!Object.values(Algorithm).includes(algorithm)) {
    throw new TypeError(`[@octokit/webhooks] Algorithm ${algorithm} is not supported. Must be  'sha1' or 'sha256'`);
  }
  const signature = await crypto.subtle.sign("HMAC", await importKey(secret, algorithm), enc.encode(payload));
  return `${algorithm}=${UInt8ArrayToHex(signature)}`;
}
async function verify(secret, eventPayload, signature) {
  if (!secret || !eventPayload || !signature) {
    throw new TypeError("[@octokit/webhooks-methods] secret, eventPayload & signature required");
  }
  const algorithm = getAlgorithm(signature);
  return await crypto.subtle.verify("HMAC", await importKey(secret, algorithm), hexToUInt8Array(signature.replace(`${algorithm}=`, "")), enc.encode(eventPayload));
}
var Algorithm = ((Algorithm2) => {
  Algorithm2["SHA1"] = "sha1";
  Algorithm2["SHA256"] = "sha256";
  return Algorithm2;
})(Algorithm || {});
var getAlgorithm = (signature) => {
  return signature.startsWith("sha256=") ? "sha256" : "sha1";
};
var enc = new TextEncoder;

// node_modules/@octokit/webhooks/dist-web/index.js
var toNormalizedJsonString = function(payload) {
  const payloadString = JSON.stringify(payload);
  return payloadString.replace(/[^\\]\\u[\da-f]{4}/g, (s2) => {
    return s2.substr(0, 3) + s2.substr(3).toUpperCase();
  });
};
async function sign2(secret, payload) {
  return sign(secret, typeof payload === "string" ? payload : toNormalizedJsonString(payload));
}
async function verify2(secret, payload, signature) {
  return verify(secret, typeof payload === "string" ? payload : toNormalizedJsonString(payload), signature);
}
async function verifyAndReceive(state, event) {
  const matchesSignature = await verify(state.secret, typeof event.payload === "object" ? toNormalizedJsonString(event.payload) : event.payload, event.signature).catch(() => false);
  if (!matchesSignature) {
    const error = new Error("[@octokit/webhooks] signature does not match event payload and secret");
    return state.eventHandler.receive(Object.assign(error, { event, status: 400 }));
  }
  return state.eventHandler.receive({
    id: event.id,
    name: event.name,
    payload: typeof event.payload === "string" ? JSON.parse(event.payload) : event.payload
  });
}
var import_aggregate_error2 = __toESM(require_aggregate_error(), 1);
var createLogger = (logger) => ({
  debug: () => {
  },
  info: () => {
  },
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  ...logger
});
var emitterEventNames = [
  "branch_protection_rule",
  "branch_protection_rule.created",
  "branch_protection_rule.deleted",
  "branch_protection_rule.edited",
  "check_run",
  "check_run.completed",
  "check_run.created",
  "check_run.requested_action",
  "check_run.rerequested",
  "check_suite",
  "check_suite.completed",
  "check_suite.requested",
  "check_suite.rerequested",
  "code_scanning_alert",
  "code_scanning_alert.appeared_in_branch",
  "code_scanning_alert.closed_by_user",
  "code_scanning_alert.created",
  "code_scanning_alert.fixed",
  "code_scanning_alert.reopened",
  "code_scanning_alert.reopened_by_user",
  "commit_comment",
  "commit_comment.created",
  "create",
  "delete",
  "dependabot_alert",
  "dependabot_alert.created",
  "dependabot_alert.dismissed",
  "dependabot_alert.fixed",
  "dependabot_alert.reintroduced",
  "dependabot_alert.reopened",
  "deploy_key",
  "deploy_key.created",
  "deploy_key.deleted",
  "deployment",
  "deployment.created",
  "deployment_status",
  "deployment_status.created",
  "discussion",
  "discussion.answered",
  "discussion.category_changed",
  "discussion.created",
  "discussion.deleted",
  "discussion.edited",
  "discussion.labeled",
  "discussion.locked",
  "discussion.pinned",
  "discussion.transferred",
  "discussion.unanswered",
  "discussion.unlabeled",
  "discussion.unlocked",
  "discussion.unpinned",
  "discussion_comment",
  "discussion_comment.created",
  "discussion_comment.deleted",
  "discussion_comment.edited",
  "fork",
  "github_app_authorization",
  "github_app_authorization.revoked",
  "gollum",
  "installation",
  "installation.created",
  "installation.deleted",
  "installation.new_permissions_accepted",
  "installation.suspend",
  "installation.unsuspend",
  "installation_repositories",
  "installation_repositories.added",
  "installation_repositories.removed",
  "installation_target",
  "installation_target.renamed",
  "issue_comment",
  "issue_comment.created",
  "issue_comment.deleted",
  "issue_comment.edited",
  "issues",
  "issues.assigned",
  "issues.closed",
  "issues.deleted",
  "issues.demilestoned",
  "issues.edited",
  "issues.labeled",
  "issues.locked",
  "issues.milestoned",
  "issues.opened",
  "issues.pinned",
  "issues.reopened",
  "issues.transferred",
  "issues.unassigned",
  "issues.unlabeled",
  "issues.unlocked",
  "issues.unpinned",
  "label",
  "label.created",
  "label.deleted",
  "label.edited",
  "marketplace_purchase",
  "marketplace_purchase.cancelled",
  "marketplace_purchase.changed",
  "marketplace_purchase.pending_change",
  "marketplace_purchase.pending_change_cancelled",
  "marketplace_purchase.purchased",
  "member",
  "member.added",
  "member.edited",
  "member.removed",
  "membership",
  "membership.added",
  "membership.removed",
  "merge_group",
  "merge_group.checks_requested",
  "meta",
  "meta.deleted",
  "milestone",
  "milestone.closed",
  "milestone.created",
  "milestone.deleted",
  "milestone.edited",
  "milestone.opened",
  "org_block",
  "org_block.blocked",
  "org_block.unblocked",
  "organization",
  "organization.deleted",
  "organization.member_added",
  "organization.member_invited",
  "organization.member_removed",
  "organization.renamed",
  "package",
  "package.published",
  "package.updated",
  "page_build",
  "ping",
  "project",
  "project.closed",
  "project.created",
  "project.deleted",
  "project.edited",
  "project.reopened",
  "project_card",
  "project_card.converted",
  "project_card.created",
  "project_card.deleted",
  "project_card.edited",
  "project_card.moved",
  "project_column",
  "project_column.created",
  "project_column.deleted",
  "project_column.edited",
  "project_column.moved",
  "projects_v2_item",
  "projects_v2_item.archived",
  "projects_v2_item.converted",
  "projects_v2_item.created",
  "projects_v2_item.deleted",
  "projects_v2_item.edited",
  "projects_v2_item.reordered",
  "projects_v2_item.restored",
  "public",
  "pull_request",
  "pull_request.assigned",
  "pull_request.auto_merge_disabled",
  "pull_request.auto_merge_enabled",
  "pull_request.closed",
  "pull_request.converted_to_draft",
  "pull_request.demilestoned",
  "pull_request.dequeued",
  "pull_request.edited",
  "pull_request.labeled",
  "pull_request.locked",
  "pull_request.milestoned",
  "pull_request.opened",
  "pull_request.queued",
  "pull_request.ready_for_review",
  "pull_request.reopened",
  "pull_request.review_request_removed",
  "pull_request.review_requested",
  "pull_request.synchronize",
  "pull_request.unassigned",
  "pull_request.unlabeled",
  "pull_request.unlocked",
  "pull_request_review",
  "pull_request_review.dismissed",
  "pull_request_review.edited",
  "pull_request_review.submitted",
  "pull_request_review_comment",
  "pull_request_review_comment.created",
  "pull_request_review_comment.deleted",
  "pull_request_review_comment.edited",
  "pull_request_review_thread",
  "pull_request_review_thread.resolved",
  "pull_request_review_thread.unresolved",
  "push",
  "registry_package",
  "registry_package.published",
  "registry_package.updated",
  "release",
  "release.created",
  "release.deleted",
  "release.edited",
  "release.prereleased",
  "release.published",
  "release.released",
  "release.unpublished",
  "repository",
  "repository.archived",
  "repository.created",
  "repository.deleted",
  "repository.edited",
  "repository.privatized",
  "repository.publicized",
  "repository.renamed",
  "repository.transferred",
  "repository.unarchived",
  "repository_dispatch",
  "repository_import",
  "repository_vulnerability_alert",
  "repository_vulnerability_alert.create",
  "repository_vulnerability_alert.dismiss",
  "repository_vulnerability_alert.reopen",
  "repository_vulnerability_alert.resolve",
  "secret_scanning_alert",
  "secret_scanning_alert.created",
  "secret_scanning_alert.reopened",
  "secret_scanning_alert.resolved",
  "security_advisory",
  "security_advisory.performed",
  "security_advisory.published",
  "security_advisory.updated",
  "security_advisory.withdrawn",
  "sponsorship",
  "sponsorship.cancelled",
  "sponsorship.created",
  "sponsorship.edited",
  "sponsorship.pending_cancellation",
  "sponsorship.pending_tier_change",
  "sponsorship.tier_changed",
  "star",
  "star.created",
  "star.deleted",
  "status",
  "team",
  "team.added_to_repository",
  "team.created",
  "team.deleted",
  "team.edited",
  "team.removed_from_repository",
  "team_add",
  "watch",
  "watch.started",
  "workflow_dispatch",
  "workflow_job",
  "workflow_job.completed",
  "workflow_job.in_progress",
  "workflow_job.queued",
  "workflow_run",
  "workflow_run.completed",
  "workflow_run.in_progress",
  "workflow_run.requested"
];
var Webhooks = class {
  constructor(options) {
    if (!options || !options.secret) {
      throw new Error("[@octokit/webhooks] options.secret required");
    }
    const state = {
      eventHandler: createEventHandler(options),
      secret: options.secret,
      hooks: {},
      log: createLogger(options.log)
    };
    this.sign = sign2.bind(null, options.secret);
    this.verify = (eventPayload, signature) => {
      if (typeof eventPayload === "object") {
        console.warn("[@octokit/webhooks] Passing a JSON payload object to `verify()` is deprecated and the functionality will be removed in a future release of `@octokit/webhooks`");
      }
      return verify2(options.secret, eventPayload, signature);
    };
    this.on = state.eventHandler.on;
    this.onAny = state.eventHandler.onAny;
    this.onError = state.eventHandler.onError;
    this.removeListener = state.eventHandler.removeListener;
    this.receive = state.eventHandler.receive;
    this.verifyAndReceive = (options2) => {
      if (typeof options2.payload === "object") {
        console.warn("[@octokit/webhooks] Passing a JSON payload object to `verifyAndReceive()` is deprecated and the functionality will be removed in a future release of `@octokit/webhooks`");
      }
      return verifyAndReceive(state, options2);
    };
  }
};

// node_modules/@octokit/auth-unauthenticated/dist-web/index.js
async function auth6(reason) {
  return {
    type: "unauthenticated",
    reason
  };
}
var isRateLimitError = function(error) {
  if (error.status !== 403) {
    return false;
  }
  if (!error.response) {
    return false;
  }
  return error.response.headers["x-ratelimit-remaining"] === "0";
};
var isAbuseLimitError = function(error) {
  if (error.status !== 403) {
    return false;
  }
  return REGEX_ABUSE_LIMIT_MESSAGE.test(error.message);
};
async function hook6(reason, request18, route, parameters) {
  const endpoint3 = request18.endpoint.merge(route, parameters);
  return request18(endpoint3).catch((error) => {
    if (error.status === 404) {
      error.message = `Not found. May be due to lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (isRateLimitError(error)) {
      error.message = `API rate limit exceeded. This maybe caused by the lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (isAbuseLimitError(error)) {
      error.message = `You have triggered an abuse detection mechanism. This maybe caused by the lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (error.status === 401) {
      error.message = `Unauthorized. "${endpoint3.method} ${endpoint3.url}" failed most likely due to lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (error.status >= 400 && error.status < 500) {
      error.message = error.message.replace(/\.?$/, `. May be caused by lack of authentication (${reason}).`);
    }
    throw error;
  });
}
var REGEX_ABUSE_LIMIT_MESSAGE = /\babuse\b/i;
var createUnauthenticatedAuth = function createUnauthenticatedAuth2(options) {
  if (!options || !options.reason) {
    throw new Error("[@octokit/auth-unauthenticated] No reason passed to createUnauthenticatedAuth");
  }
  return Object.assign(auth6.bind(null, options.reason), {
    hook: hook6.bind(null, options.reason)
  });
};

// node_modules/@octokit/app/dist-web/index.js
var webhooks2 = function(appOctokit, options) {
  return new Webhooks({
    secret: options.secret,
    transform: async (event) => {
      if (!("installation" in event.payload) || typeof event.payload.installation !== "object") {
        const octokit2 = new appOctokit.constructor({
          authStrategy: createUnauthenticatedAuth,
          auth: {
            reason: `"installation" key missing in webhook event payload`
          }
        });
        return {
          ...event,
          octokit: octokit2
        };
      }
      const installationId = event.payload.installation.id;
      const octokit = await appOctokit.auth({
        type: "installation",
        installationId,
        factory(auth7) {
          return new auth7.octokit.constructor({
            ...auth7.octokitOptions,
            authStrategy: createAppAuth,
            ...{
              auth: {
                ...auth7,
                installationId
              }
            }
          });
        }
      });
      octokit.hook.before("request", (options2) => {
        options2.headers["x-github-delivery"] = event.id;
      });
      return {
        ...event,
        octokit
      };
    }
  });
};
async function getInstallationOctokit(app, installationId) {
  return app.octokit.auth({
    type: "installation",
    installationId,
    factory(auth7) {
      const options = {
        ...auth7.octokitOptions,
        authStrategy: createAppAuth,
        ...{ auth: { ...auth7, installationId } }
      };
      return new auth7.octokit.constructor(options);
    }
  });
}
var eachInstallationFactory = function(app) {
  return Object.assign(eachInstallation.bind(null, app), {
    iterator: eachInstallationIterator.bind(null, app)
  });
};
async function eachInstallation(app, callback) {
  const i2 = eachInstallationIterator(app)[Symbol.asyncIterator]();
  let result = await i2.next();
  while (!result.done) {
    await callback(result.value);
    result = await i2.next();
  }
}
var eachInstallationIterator = function(app) {
  return {
    async* [Symbol.asyncIterator]() {
      const iterator2 = composePaginateRest.iterator(app.octokit, "GET /app/installations");
      for await (const { data: installations } of iterator2) {
        for (const installation of installations) {
          const installationOctokit = await getInstallationOctokit(app, installation.id);
          yield { octokit: installationOctokit, installation };
        }
      }
    }
  };
};
var eachRepositoryFactory = function(app) {
  return Object.assign(eachRepository.bind(null, app), {
    iterator: eachRepositoryIterator.bind(null, app)
  });
};
async function eachRepository(app, queryOrCallback, callback) {
  const i2 = eachRepositoryIterator(app, callback ? queryOrCallback : undefined)[Symbol.asyncIterator]();
  let result = await i2.next();
  while (!result.done) {
    if (callback) {
      await callback(result.value);
    } else {
      await queryOrCallback(result.value);
    }
    result = await i2.next();
  }
}
var singleInstallationIterator = function(app, installationId) {
  return {
    async* [Symbol.asyncIterator]() {
      yield {
        octokit: await app.getInstallationOctokit(installationId)
      };
    }
  };
};
var eachRepositoryIterator = function(app, query) {
  return {
    async* [Symbol.asyncIterator]() {
      const iterator2 = query ? singleInstallationIterator(app, query.installationId) : app.eachInstallation.iterator();
      for await (const { octokit } of iterator2) {
        const repositoriesIterator = composePaginateRest.iterator(octokit, "GET /installation/repositories");
        for await (const { data: repositories } of repositoriesIterator) {
          for (const repository of repositories) {
            yield { octokit, repository };
          }
        }
      }
    }
  };
};
var VERSION14 = "13.1.8";
var App = class {
  static defaults(defaults) {
    const AppWithDefaults = class extends this {
      constructor(...args) {
        super({
          ...defaults,
          ...args[0]
        });
      }
    };
    return AppWithDefaults;
  }
  constructor(options) {
    const Octokit5 = options.Octokit || Octokit;
    const authOptions = Object.assign({
      appId: options.appId,
      privateKey: options.privateKey
    }, options.oauth ? {
      clientId: options.oauth.clientId,
      clientSecret: options.oauth.clientSecret
    } : {});
    this.octokit = new Octokit5({
      authStrategy: createAppAuth,
      auth: authOptions,
      log: options.log
    });
    this.log = Object.assign({
      debug: () => {
      },
      info: () => {
      },
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    if (options.webhooks) {
      this.webhooks = webhooks2(this.octokit, options.webhooks);
    } else {
      Object.defineProperty(this, "webhooks", {
        get() {
          throw new Error("[@octokit/app] webhooks option not set");
        }
      });
    }
    if (options.oauth) {
      this.oauth = new oauth_app.OAuthApp({
        ...options.oauth,
        clientType: "github-app",
        Octokit: Octokit5
      });
    } else {
      Object.defineProperty(this, "oauth", {
        get() {
          throw new Error("[@octokit/app] oauth.clientId / oauth.clientSecret options are not set");
        }
      });
    }
    this.getInstallationOctokit = getInstallationOctokit.bind(null, this);
    this.eachInstallation = eachInstallationFactory(this);
    this.eachRepository = eachRepositoryFactory(this);
  }
};
App.VERSION = VERSION14;

// node_modules/octokit/dist-web/index.js
var oauth_app2 = __toESM(require_dist_node5(), 1);
var VERSION15 = "2.1.0";
var Octokit2 = Octokit.plugin(restEndpointMethods, paginateRest, retry, throttling).defaults({
  userAgent: `octokit.js/${VERSION15}`,
  throttle: {
    onRateLimit,
    onSecondaryRateLimit
  }
});
var App2 = App.defaults({ Octokit: Octokit2 });
var OAuthApp2 = oauth_app2.OAuthApp.defaults({ Octokit: Octokit2 });

// src/text-content-checks.ts
function checkTextContent(text) {
  const lowerCaseText = text.toLowerCase();
  for (const word of allowlist) {
    if (lowerCaseText.includes(word)) {
      return true;
    }
  }
  for (const word of denylist) {
    if (lowerCaseText.includes(word)) {
      return false;
    }
  }
  return true;
}
var allowlist = ["nx cloud", "angular", "vue", "nx"];
var denylist = [
  "psn",
  "xbox",
  "nintendo",
  "steam",
  "gift card",
  "giftcard",
  "gift-card",
  "playstation",
  "play station",
  "free!",
  "robux",
  "roblox"
];

// src/account-checks.ts
async function checkAccountAge(octokit, userId) {
  const account = await octokit.rest.users.getByUsername({
    username: userId.toString()
  });
  const accountAge = Date.now() - new Date(account.data.created_at).getTime();
  return accountAge > threshold;
}
var threshold = 2592000000;

// index.ts
var octokit = new Octokit2({ auth: process.env.GITHUB_TOKEN });
var event = JSON.parse("event.json");
(async () => {
  const owner = event.repository.owner.login;
  const repo = event.repository.name;
  const issue_number = "issue" in event ? event.issue.number : event.discussion.number;
  const textContent = "discussion" in event ? event.discussion.title + event.discussion.body : event.issue.title + event.issue.body;
  const allowed = await checkAccountAge(octokit, event.sender.id) || checkTextContent(textContent);
  if (!allowed) {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body: `This ${"discussion" in event ? "discussion" : "issue"} was flagged as spam and has been closed.`
    });
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number,
      state: "closed"
    });
    await octokit.rest.issues.lock({
      owner,
      repo,
      issue_number
    });
  }
})().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
