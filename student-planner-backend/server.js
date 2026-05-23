require('dotenv').config();
const app             = require('./src/app');
const { sequelize }   = require('./src/models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  MySQL connected');

    // Sync tables (creates them if they don\'t exist; never drops data)
    await sequelize.sync({ alter: true });
    console.log('✅  Tables synced');

    app.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌  Failed to start:', err.message);
    process.exit(1);
  }
})();
