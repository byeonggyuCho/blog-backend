const Router = require('koa-router');
const posts = require('./posts');
const auth = require('./auth');

const api = new Router();


// 라우터 설정
api.use('/posts', posts.routes());
api.use('/auth',  auth.routes());


// 라우터를 내보낸다.
module.exports = api;