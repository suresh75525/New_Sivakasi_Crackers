const sequelize = require('./db');
const User = require('../models/User');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    process.exit(1);
  }
})();
