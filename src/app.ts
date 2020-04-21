import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import config from './config/config'
import routes from './routes'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import {jwtMiddleware} from '../src/lib/token'

const mongoURI:any = config.mongoURI;


class App {
  public application : express.Application;
  constructor(){
    this.application = express();
  }
}

const app = new App().application;
const router = express.Router();

// create application/json parser
const jsonParser = bodyParser.json()


mongoose.Promise = global.Promise; // Node의 Promise를 사용하도록 설정
mongoose.connect(mongoURI, { 
  useNewUrlParser: true ,
  useFindAndModify: false,
  useUnifiedTopology: true  // 뭘 의미?
})
.then(() => {
  console.log('connected to mongodb');
}).catch((e: any) => {
  console.error(e);
});


// 라우터 설정
router.use('/api', routes); // api라우트 적용


// 라우터 적용 전에 bodyParser 적용
app.use(jsonParser);
app.use(jwtMiddleware);

// 쿠키파서
app.use(cookieParser());

const sessionConfig = {
  secret: 'keyboard cat', // 세션 암호화를 하는 키.
  resave: false,    // 세션을 언제나 저장할것인지?
  saveUninitialized: true,
  cookie:{maxAge:8640000}// 유효기간, 하루
}

// 상세 : https://github.com/koajs/sessoin
app.use(session(sessionConfig));

// app 인스턴스에 라우터 적용
app.use(router);

//.use(router.allowedMethods());

app.use((err: any, req: any, res: any, next: any) =>{

  res.json({message: err.message})
})

export default  app;