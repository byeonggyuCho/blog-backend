import * as authCtrl from './auth.ctrl'
import express from 'express'
import authMiddleware from '../../middlewares/auth'


const router = express.Router();

router.use('/check', authMiddleware)
router.get('/check', authCtrl.check);
router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);
router.post('/register', authCtrl.register)
router.get('/exists/:key(email|username)/:value', authCtrl.exists)

// 비밀번호 인증 API
export default router;