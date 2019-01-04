var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CENTER_URL: '"https://mp.dqist.com:9000"',
  BASE_API: '"https://mp.dqist.com:9001"',
  SCREAT: '"f45djdgs1nh1vhj2jsz3va6uzqx4lbnn"',
})
