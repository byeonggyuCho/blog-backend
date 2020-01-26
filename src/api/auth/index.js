const Router = require('koa-router');

const auth = new Router();
const authCtrl = require('./auth.ctrl');

auth.post('./login', authCtrl.login);
auth.post('./check', authCtrl.check);
auth.post('./logout', authCtrl.logout);

// 비밀번호 인증 API
module.exports = auth;