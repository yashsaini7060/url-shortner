import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export default redis;



// Create a singleton instance
// let redisClient = null;

// const connectRedisClient = async () => {
//   if (!redisClient) {
//     redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

//     redisClient.on('error', (err) => console.error('Redis Client Error', err));
//     redisClient.on('connect', () => console.log(`Redis Client Connected: ${process.env.REDIS_URL || 'redis://localhost:6379'}`));
//   }
//   return redisClient;
// }

// connectRedisClient();
// export default redisClient;