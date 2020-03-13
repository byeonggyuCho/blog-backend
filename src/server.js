const {port} = require('./config/config.js')
const app = require("./app")

app.listen(port, () => {
  console.log('listening to port', port);
});
