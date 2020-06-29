const dbConfig = {
  user: process.env.DB_USER || 'core',
  password: process.env.DB_PASSWORD || 'core',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432',
  db: process.env.DB_DATABASE || 'ibanking',
}
module.exports = {
  dbConfig,
  myBankName: "37Bank",
  jwtSecret: "37Bank2231",
  jwtExpiresIn: "1y",
  saltRounds: 10,
  validBankName: ["37Bank", "24Bank", "25Bank"]
}
