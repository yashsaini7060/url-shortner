import analyticsService from '../services/analyticsService.js';

export const getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;
    const analytics = await analyticsService.getUrlAnalytics(alias, req.user._id);
    res.json(analytics);
  } catch (error) {
    res.status(error.message === 'URL not found' ? 404 : 500)
      .json({ error: error.message });
  }
};

export const getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;
    const analytics = await analyticsService.getTopicAnalytics(topic, req.user._id);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOverallAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getOverallAnalytics(req.user._id);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};