import { getClicksByDate, getUniqueClicks } from '../utils/analytics/clicksAnalyzer.js';
import { getOSStats } from '../utils/analytics/osAnalyzer.js';
import { getDeviceStats } from '../utils/analytics/deviceAnalyzer.js';
import Url from '../models/Url.js';
import redis from '../config/redis.js';

class AnalyticsService {
  async getUrlAnalytics(alias, userId) {
    const url = await Url.findOne({ shortUrl: alias, userId });

    if (!url) {
      throw new Error('URL not found');
    }

    return {
      totalClicks: url.clicks.length,
      uniqueClicks: getUniqueClicks(url.clicks),
      clicksByDate: getClicksByDate(url.clicks),
      osType: getOSStats(url.clicks),
      deviceType: getDeviceStats(url.clicks)
    };
  }

  async getTopicAnalytics(topic, userId) {
    const urls = await Url.find({ userId, topic });
    const allClicks = urls.reduce((acc, url) => [...acc, ...url.clicks], []);

    return {
      totalClicks: allClicks.length,
      uniqueClicks: getUniqueClicks(allClicks),
      clicksByDate: getClicksByDate(allClicks),
      urls: urls.map(url => ({
        shortUrl: url.shortUrl,
        totalClicks: url.clicks.length,
        uniqueClicks: getUniqueClicks(url.clicks)
      }))
    };
  }

  async getOverallAnalytics(userId) {
    // Try to get from cache first
    const cacheKey = `overall-analytics:${userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const urls = await Url.find({ userId });
    const allClicks = urls.reduce((acc, url) => [...acc, ...url.clicks], []);

    const analytics = {
      totalUrls: urls.length,
      totalClicks: allClicks.length,
      uniqueClicks: getUniqueClicks(allClicks),
      clicksByDate: getClicksByDate(allClicks),
      osType: getOSStats(allClicks),
      deviceType: getDeviceStats(allClicks)
    };

    // Cache the results
    await redis.setex(cacheKey, 300, JSON.stringify(analytics)); // 5 minutes cache

    return analytics;
  }
}

export default new AnalyticsService()