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

User.prototype.getDetails = function* () {
  // fetch from a remote API
}


```
