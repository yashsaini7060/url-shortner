export const getClicksByDate = (clicks, days = 7) => {
  const now = new Date();
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const dayClicks = clicks.filter(click =>
      click.timestamp >= date && click.timestamp < nextDate
    ).length;

    result.push({
      date: date.toISOString().split('T')[0],
      clicks: dayClicks
    });
  }

  return result;
};

export const getUniqueClicks = (clicks) => {
  return new Set(clicks.map(click => click.ipAddress)).size;
};