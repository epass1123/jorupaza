import express from "express";
const router = express.Router();
import * as controller from "./main.controller.js"
import * as store from '../database/store.js'


// router.get('/login',controller.manageGet);
// router.post('/login/:adminid',controller.manageGet);

router.get('/store',store.store);
router.get('/store/jwlinks',store.jwlinks);
router.get('/store/platlinks',store.platlinks);

router.get('/userinfo/:userid',controller.userInfoGet);
router.post('/userinfo/:userid',controller.userInfoPost);
router.put('/userinfo/:userid',controller.userInfoPost);
router.get('/userinfo/logout/:userid',controller.logoutGet);

router.get('/userinfo/userbehavior/:userid/:start/:end',controller.userBehaviorGet);
router.post('/userinfo/userbehavior/:userid',controller.userBehaviorPost);


router.get('/mark/:userid',controller.markGet);
router.post('/mark/:userid',controller.markPost);

router.get('/search',controller.searchGet);
router.post('/search',controller.searchPost);

router.get('/mark/ott/:userid',controller.ottGet);
router.post('/mark/ott/:userid',controller.ottPost);

router.get('/mark/youvid/:userid',controller.youvidGet);
router.post('/mark/youvid/:userid',controller.youvidPost);

router.get('/mark/streamer/:userid',controller.streamerGet);
router.post('/mark/streamer/:userid',controller.streamerPost);

router.get('/mark/channel/:userid',controller.channelGet);
router.post('/mark/channel/:userid',controller.channelPost);

export default router;