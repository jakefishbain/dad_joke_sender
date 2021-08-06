module.exports = {
  HOST: process.env.HOST || 'localhost',
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || '',
  DB: process.env.DB || 'dad_joke_sender'
};

// module.exports = {
//   HOST: 'localhost',
//   USER: 'root',
//   PASSWORD: '',
//   DB: 'dad_joke_sender'
// };