// import express from 'express'
import express from 'express'
import posts from './posts'
import auth from './auth'

const routers = express.Router();

// 라우터 설정
routers.use('/posts', posts);
routers.use('/auth',  auth);

// 라우터를 내보낸다.
export default routers;