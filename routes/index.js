import express from "express";
const router = express.Router();
import * as controller from "./main.controller.js"

// router.get('/login',controller.manageGet);
// router.post('/login/:adminid',controller.manageGet);

router.get('/userinfo/:userid',controller.userInfoGet);
router.post('/userinfo/:userid',controller.userInfoGet);

router.get('/userinfo/userbehavior/:start/:end',controller.userBehaviorGet);
router.post('/userinfo/userbehavior/:userid',controller.userBehaviorPost);

router.get('/logout',controller.logoutGet);

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