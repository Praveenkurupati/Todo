const serverless = require('serverless-http')


const app = require('./src/app')





const PORT = 2023;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports.handler = serverless(app)