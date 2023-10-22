import express from "express";
import * as controller from "./manage.controller.js"
const router = express.Router();

router.get('/',controller.manageGet);

router.post('/login/:adminid',controller.adminLogin);
router.get('/logout',controller.adminLogout);

router.post('/manage/search',controller.manageSearch);
router.put('/manage/search',controller.updateRow);

router.post('/manage/ott/add',controller.ottManagePost);

router.get('/manage/errlog/:options',controller.errLogGet);

export default router;
