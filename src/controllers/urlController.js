import { nanoid } from "nanoid";
import Url from '../models/Url.js';
import { detectDevice } from '../utils/deviceDetector.js';
import { getGeoLocation } from '../utils/geoLocation.js';
import redis from '../config/redis.js';

const CACHE_TTL = 600;

export const createShortUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user._id;

    let shortUrl = customAlias || nanoid(8);

    if (customAlias) {
      const existingUrl = await Url.findOne({ alias: customAlias });
      if (existingUrl) {
        return res.status(400).json({ error: 'Custom alias already in use' });
      }
    }

    const url = await Url.create({
      userId,
      longUrl,
      shortUrl,
      alias: customAlias,
      topic,
    });

    await redis.setex(`url:${shortUrl}`, CACHE_TTL, longUrl);

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${shortUrl}`,
      createdAt: url.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//TODO: Create a queue system to save Tracking analytics data to mongo db

export const redirectUrl = async (req, res) => {
  try {
    const { alias } = req.params;

    let longUrl = await redis.get(`url:${alias}`);
    let url;

    // Find or fetch the URL document regardless of Redis cache
    url = await Url.findOne({ shortUrl: alias });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // If URL wasn't in Redis, cache it
    if (!longUrl) {
      longUrl = url.longUrl;
      await redis.setex(`url:${alias}`, CACHE_TTL, longUrl);
    }

    // Track analytics for all clicks
    const deviceInfo = detectDevice(req.headers['user-agent']);
    console.log(deviceInfo)
    const geoInfo = getGeoLocation(req.ip);

    url.clicks.push({
      timestamp: new Date(),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      geoLocation: geoInfo,
      deviceType: deviceInfo.deviceType,
      osType: deviceInfo.osType,
    });

    await url.save();
    res.redirect(longUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};