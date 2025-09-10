
// JWT configuration settings
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpire: '30d' // Token expiration time
};
