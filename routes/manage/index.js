import express from "express";
import * as controller from "./manage.controller.js"
const router = express.Router();

router.get('/manage',controller.manageGet);

router.post('/manage/login/',controller.adminLogin);
router.get('/manage/logout',controller.adminLogout);

router.post('/manage/search',controller.contentsSearch);
router.put('/manage/search',controller.updateRow);

router.get('/manage/user/:userid',controller.userSearch);
router.post('/manage/user/delete/:userid',controller.userDelete);

router.post('/manage/ott/add',controller.ottManagePost);

router.get('/manage/errlog/:options',controller.errLogGet);

export default router;
