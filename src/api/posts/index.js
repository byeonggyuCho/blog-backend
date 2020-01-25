const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.get('/:id', postsCtrl.read);
posts.post('/', postsCtrl.write);
posts.delete('/', postsCtrl.remove);
posts.put('/', postsCtrl.replace);
posts.patch('/', postsCtrl.update);

module.exports = posts;
