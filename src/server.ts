import config from './config/config'

const app = require("./app")

app.listen(config.port, () => {
  console.log('listening to port', config.port);
});
