const postsCtrl = require('./posts.ctrl');

// const Router = require('koa-router');
// const posts = new Router();
const router = require('express').Router();

const {list, read, checkObjectId, write, remove, update, checkLogin } = postsCtrl;

router.get('/',      list);
router.get('/:id',   checkObjectId,  read);
// 로그인 여부 체크
router.post('/',     checkLogin,     write);
router.delete('/',   checkLogin,     checkObjectId, remove);
router.patch('/',    checkLogin,     checkObjectId, update);

module.exports = router;
