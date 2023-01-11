// import expressRedisCache from 'express-redis-cache';
import { createClient } from 'redis';
import * as config from './config';


export const cache = createClient({url: config.REDIS_URL});
cache.connect();
cache.on('error', (err: any) => {
    console.log('Redis client error:', err);
})
cache.on('connect', () => {
    console.log('Redis client connected');
})