import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import connectRedisClient from '../config/redis.js'

const client = await connectRedisClient()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    client: client // Pass the client directly instead of using sendCommand
  }),
})

export default limiter;