import * as authCtrl from './auth.ctrl'
import express from 'express'

const router = express.Router();

router.post('/login', authCtrl.login);
router.post('/check', authCtrl.check);
router.post('/logout', authCtrl.logout);

// 비밀번호 인증 API
export default router;