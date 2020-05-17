const dbConfig = {
  user: process.env.DB_USER || 'core',
  password: process.env.DB_PASSWORD || 'core',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432',
  db: process.env.DB_DATABASE || 'ibanking',
}
module.exports = dbConfig
