export const getDeviceStats = (clicks) => {
  const deviceStats = {};
  const deviceUsers = new Map();

  clicks.forEach(click => {
    const { deviceType, ipAddress } = click;
    if (!deviceStats[deviceType]) {
      deviceStats[deviceType] = {
        deviceName: deviceType,
        uniqueClicks: 0,
        uniqueUsers: 0
      };
      deviceUsers.set(deviceType, new Set());
    }

    deviceStats[deviceType].uniqueClicks++;
    deviceUsers.get(deviceType).add(ipAddress);
  });

  for (const [deviceType, users] of deviceUsers.entries()) {
    deviceStats[deviceType].uniqueUsers = users.size;
  }

  return Object.values(deviceStats);
};