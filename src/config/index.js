module.exports = {
  services: {
    auth: {
      host: process.env.AUTH_API_HOST,
      tokenPath: '/api/v1/token',
      basicAuth: process.env.AUTH_API_BASIC_AUTH
    },
    adminApi: {
      host: process.env.ADMIN_API_HOST,
      path: '/admin/v1/proctoru/webhook'
    },
    proctorU: {
      secret: process.env.PROCTORU_SHARED_SECRET
    }
  },
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};
