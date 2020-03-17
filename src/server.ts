import config from './config/config'
import app from "./app"

app.listen(config.port, () => {
  console.log('listening to port', config.port);
});
