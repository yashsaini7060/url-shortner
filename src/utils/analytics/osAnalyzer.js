export const getOSStats = (clicks) => {
  const osStats = {};
  const osUsers = new Map();

  clicks.forEach(click => {
    const { osType, ipAddress } = click;
    if (!osStats[osType]) {
      osStats[osType] = { osName: osType, uniqueClicks: 0, uniqueUsers: 0 };
      osUsers.set(osType, new Set());
    }

    osStats[osType].uniqueClicks++;
    osUsers.get(osType).add(ipAddress);
  });

  // Calculate unique users for each OS
  for (const [osType, users] of osUsers.entries()) {
    osStats[osType].uniqueUsers = users.size;
  }

  return Object.values(osStats);
};
