var Cacheable = require('cacheable')
var co = require('co')
var util = require('util')
var __slice = [].slice


function CoCacheable() {
  Cacheable.apply(this, arguments)
}
util.inherits(CoCacheable, Cacheable)


CoCacheable.prototype.wrap = function(fn) {
  var args = __slice.call(arguments)

  if (isGeneratorFunction(fn)) {
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
  }
  Cacheable.prototype.wrap.apply(this, args)
}


function isGeneratorFunction(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}


module.exports = CoCacheable
