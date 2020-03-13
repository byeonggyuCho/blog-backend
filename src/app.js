const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const config = require('./config/config.js')
const routes = require('./routes');
const { mongoURI, signKey} = config;
const app = express();
const router = express.Router();

global.__base = __dirname + '/';

mongoose.Promise = global.Promise; // Node의 Promise를 사용하도록 설정
mongoose.connect(mongoURI, { 
  useNewUrlParser: true ,
  useUnifiedTopology: true  // 뭘 의미?
})
.then(() => {
  console.log('connected to mongodb');
}).catch((e) => {
  console.error(e);
});


// 라우터 설정
router.use('/api', routes); // api라우트 적용

// 라우터 적용 전에 bodyParser 적용
// app.use(bodyParser());

const sessionConfig = {
  secret: 'keyboard cat', // 세션 암호화를 하는 키.
  resave: false,    // 세션을 언제나 저장할것인지?
  saveUninitialized: true,
  cookie:{maxAge:8640000}// 유효기간, 하루
}

// 상세 : https://github.com/koajs/sessoin
app.use(session(sessionConfig));
app.keys = [signKey];

// app 인스턴스에 라우터 적용
app.use(router);
//.use(router.allowedMethods());

app.use((err, req, res, next) =>{

  res.json({message: err.message})
})

module.exports = app;