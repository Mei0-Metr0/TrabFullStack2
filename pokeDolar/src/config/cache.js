// src/config/cache.js
import NodeCache from 'node-cache';

// Create a cache instance with a default TTL of 1 hour
const cache = new NodeCache({
  stdTTL: 3600, // Time to live in seconds
  checkperiod: 120, // Check for expired keys every 120 seconds
  useClones: false, // Store/retrieve references to objects instead of copies
});

// Helper functions for the cache
const cacheService = {
  get: (key) => {
    return cache.get(key);
  },

  set: (key, data) => {
    return cache.set(key, data);
  },

  del: (key) => {
    return cache.del(key);
  },

  flush: () => {
    return cache.flushAll();
  },

  // Custom function to get or set cache with callback
  getOrSet: async (key, callback, ttl = 3600) => {
    const value = cache.get(key);
    if (value) {
      return value;
    }

    const result = await callback();
    cache.set(key, result, ttl);
    return result;
  },

  // Get multiple keys
  getMultiple: (keys) => {
    return cache.mget(keys);
  }
};

export default cacheService;