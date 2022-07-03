module.exports = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migration/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migration',
  },
  logging: false,
  synchronize: false,
};
