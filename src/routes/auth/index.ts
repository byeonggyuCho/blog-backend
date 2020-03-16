const authCtrl = require('./auth.ctrl');
// const Router = require('koa-router');
// const auth = new Router();
const router = require('express').Router();

router.post('/login', authCtrl.login);
router.post('/check', authCtrl.check);
router.post('/logout', authCtrl.logout);

// 비밀번호 인증 API
export default router;