require('dotenv').config();

const mongoose = require('mongoose');
const session = require('koa-session');

const {
  PORT: port = 4000,
  MONGO_URI: mongoURI,
  COOKIE_SIGN_KEY: signKey
} = process.env;

mongoose.Promise = global.Promise; // Node의 Promise를 사용하도록 설정
mongoose.connect(mongoURI, { useNewUrlParser: true })
.then(() => {
  console.log('connected to mongodb');
}).catch((e) => {
  console.error(e);
});


const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const api = require('./api');

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

const sessionConfig = {
  maxAge: 8640000, // 유효기간, 하루
  signed: true // default: true
}

// 상세 : https://github.com/koajs/sessoin
app.use(session(sessionConfig, app));
app.keys = [signKey];

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log('listening to port', port);
});