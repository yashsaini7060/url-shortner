import { UAParser } from 'ua-parser-js';

export const detectDevice = (userAgent) => {
  try {
    if (!userAgent) {
      throw new Error('User agent string is required');
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      deviceType: result.device.type || 'desktop',
      osType: result.os.name || 'unknown',
      browser: result.browser.name || 'unknown',
    };
  } catch (error) {
    console.error('Error detecting device:', error);
    return {
      deviceType: 'unknown',
      osType: 'unknown',
      browser: 'unknown',
    };
  }
};