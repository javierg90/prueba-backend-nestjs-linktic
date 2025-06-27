module.exports = {
  development: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'password*',
    database: process.env.DB_NAME || 'db_linktic',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
  },
};
