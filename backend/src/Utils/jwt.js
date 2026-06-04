import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT, {
    expiresIn: '1d',
  });
  return token;
};

export default generateToken;
