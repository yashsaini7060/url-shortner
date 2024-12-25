import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    unique: true,
    sparse: true,
  },
  topic: String,
  clicks: [{
    timestamp: Date,
    userAgent: String,
    ipAddress: String,
    geoLocation: {
      country: String,
      city: String,
    },
    deviceType: String,
    osType: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Url', urlSchema);
