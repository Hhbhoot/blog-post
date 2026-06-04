import mogoose from 'mongoose';

const tokenSchema = new mogoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

export default mogoose.model('blacklistTokens', tokenSchema);
