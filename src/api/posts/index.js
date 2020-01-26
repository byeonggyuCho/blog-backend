const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');

const posts = new Router();

const {list, read, checkObjectId, write, remove, update, checkLogin } = postsCtrl;

posts.get('/',      list);
posts.get('/:id',   checkObjectId,  read);
// 로그인 여부 체크
posts.post('/',     checkLogin,     write);
posts.delete('/',   checkLogin,     checkObjectId, remove);
posts.patch('/',    checkLogin,     checkObjectId, update);

module.exports = posts;
