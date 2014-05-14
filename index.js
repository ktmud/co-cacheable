var Cacheable = require('cacheable')
var co = require('co')
var util = require('util')
var __slice = [].slice
var _REALNAME = Cacheable._REALNAME


function CoCacheable() {
  Cacheable.apply(this, arguments)
}
util.inherits(CoCacheable, Cacheable)


CoCacheable.prototype.wrap = function(fn) {
  var args = __slice.call(arguments)
  var isGen = isGeneratorOrThunk(fn)
  var wrapped

  if (isGen) {
    // convert generator function to async mode
    args[0] = function() {
      var params = __slice.call(arguments)
      var next = params.pop()
      co(function* () {
        var result, err
        try {
          result = yield fn.apply(this, params)
        } catch (e) {
          err = e
        }
        next(err, result)
      }).call(this)
    }
    // method must provide a name
    args[0][_REALNAME] = fn[_REALNAME]
  }

  wrapped = Cacheable.prototype.wrap.apply(this, args)

  if (isGen) {
    var _wrapped = wrapped
    // convert the wrapped async function to a thunk,
    // so the return function may have the same signature as the `fn`
    wrapped = function() {
      var params = __slice.call(arguments)
      var self = this
      return function(next) {
        params.push(next)
        _wrapped.apply(self, params)
      }
    }
  }
  return wrapped
}


function isGeneratorOrThunk(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name ||
         obj && obj.isThunk === true;
}


module.exports = CoCacheable
