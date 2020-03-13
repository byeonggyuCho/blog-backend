// const Router = require('koa-router');
// const api = new Router();
const router = require('express').Router();
const posts = require('./posts');
const auth = require('./auth');


// 라우터 설정
router.use('/posts', posts);
router.use('/auth',  auth);

// 라우터를 내보낸다.
module.exports = router;