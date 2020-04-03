import * as postsCtrl  from './posts.ctrl';
import express from 'express';
const router = express.Router();

const {list, read, checkObjectId, write, remove, update, checkLogin } = postsCtrl;

router.get('/',      list);
router.get('/:id',   checkObjectId,  read);
// 로그인 여부 체크
router.post('/',     checkLogin,     write);
router.patch('/:id',    checkLogin,     checkObjectId, update);
router.delete('/:id',   checkLogin,     checkObjectId, remove);

export default router;
