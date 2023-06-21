const redis = require('redis')
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const client = redis.createClient({
  url: redisUrl
})
const db = require('../models')
const findOne = db.Sequelize.Model.findOne
const findAll = db.Sequelize.Model.findAll

db.Sequelize.Model.cache = function (key) {
  this.useCache = true
  this.key = key
  return this
}
db.Sequelize.Model.clearCache = async function (key) {
  const cacheKey = `${this.name}_${key}`
  await client.del(cacheKey)
}
db.Sequelize.Model.findOne = async function () {
  if (!this.useCache) {
    return findOne.apply(this, arguments)
  }

  let result = ''
  if (this.key) {
    const cacheKey = `${this.name}_${this.key}`
    this.key = null
    const cacheValue = await client.get(cacheKey)
    if (cacheValue) {
      return JSON.parse(cacheValue)
    }
    result = await findOne.apply(this, arguments)
    await client.set(cacheKey, JSON.stringify(result), 'EX', 60 * 60 * 24)
  } else {
    result = await findOne.apply(this, arguments)
  }

  return result
}
db.Sequelize.Model.findAll = async function () {
  if (!this.useCache) {
    return findAll.apply(this, arguments)
  }
  let result = ''

  // avoid cache when using findOne
  if (this.key) {
    const cacheKey = `${this.name}_${this.key}`
    this.key = null
    const cacheValue = await client.get(cacheKey)
    if (cacheValue) {
      return JSON.parse(cacheValue)
    }
    result = await findAll.apply(this, arguments)
    await client.set(cacheKey, JSON.stringify(result), 'EX', 60 * 60 * 24)
  } else {
    result = await findAll.apply(this, arguments)
  }

  return result
}

client.on('error', function (error) {
  console.error(error)
}
)
client.on('connect', function () {
  console.log('Connected to Redis')
})

client.connect()

module.exports = client
