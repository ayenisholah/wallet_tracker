const cfg = {
  app: {
    port: parseInt(process.env.PORT as string) || 5002,
    env: process.env.NODE_ENV || 'development',
  },
  clients: [
    process.env.TUFEXT_FRONTEND_DEPLOYMENT_URL,
    'http://localhost:3000',
    'http://localhost:3003/*',
    'http://localhost:3004',
  ],
};

export default cfg;
