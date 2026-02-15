module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './database/dev.sqlite3'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: './database/prod.sqlite3'
    },
    useNullAsDefault: true
  }
};
