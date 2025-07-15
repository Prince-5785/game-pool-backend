const { sequelize } = require('./models');

async function updateConstraints() {
  try {
    console.log('Synchronizing models with database to update constraints...');
    
    // Force alter option will modify existing tables to match current model definitions
    await sequelize.sync({ alter: true });
    
    console.log('Database schema updated successfully with CASCADE constraints!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating database schema:', error);
    process.exit(1);
  }
}

updateConstraints();
