const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'study_garden',
      multipleStatements: true
    });
    
    console.log('✅ Connected!');
    
    // Check if database is empty
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('📦 Database is empty. Importing schema...');
      
      // Read schema file
      const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Execute schema
      await connection.query(schema);
      
      console.log('✅ Schema imported successfully!');
      console.log('🎉 Database initialized!');
    } else {
      console.log('✅ Database already initialized. Tables found:', tables.length);
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✅ Done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}

module.exports = initDatabase;
