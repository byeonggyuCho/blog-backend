const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.get('/:id', postsCtrl.read);
posts.post('/', postsCtrl.checkObjectId,postsCtrl.write);
posts.delete('/', postsCtrl.checkObjectId, postsCtrl.remove);
posts.patch('/', postsCtrl.checkObjectId, postsCtrl.update);
// posts.put('/', postsCtrl.replace);

module.exports = posts;
