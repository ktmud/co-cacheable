# co-cacheable

Enable you to wrap generator function with [cacheable](https://github.com/ktmud/cacheable)


## Usage

```
var cached = require('co-cacheable')({
    client: new RedisClient()
    prefix: 'cacheable'
})

function User() {
}

User.prototype.getDetails = function* getDetails() {
  // fetch from a remote API
}

User.prototype.thunkedMethod = function() {
  return function(callback) {
  }
}
// manually mark this function as thunked method
User.prototype.thunkedMethod.isThunk = true

cached.register(User)
User.enableCache('.getDetails')
User.enableCache('.thunkedMethod')
```
