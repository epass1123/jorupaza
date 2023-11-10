import express from "express";
import * as controller from "./manage.controller.js"
const router = express.Router();

router.get('/admin',controller.manageGet);

router.post('/admin/login',controller.adminLogin);
router.delete('/admin/logout',controller.adminLogout);

router.get('/admin/dashboard',controller.dashboard);

router.get('/admin/monitor/date/:date',controller.monitorDate);
router.get('/admin/monitor/time/:datetime',controller.monitorTime);

router.post('/admin/content',controller.contentsSearch);
router.put('/admin/content',controller.updateRow);

router.get('/admin/user/:userid',controller.userSearch);
router.delete('/admin/user/:userid',controller.userDelete);

router.post('/admin/ott',controller.ottManagePost);

router.post("/admin/jwcontent",controller.crawl);
router.get("/admin/mldata",controller.download);

router.post("/admin/ai",controller.train);
router.delete("/admin/ai",controller.stopTrain);
router.get("/admin/aiprocess",controller.trainProcess);

router.get("/admin/reccontent/:options",controller.dispatch);
router.delete("/admin/reccontent",controller.stopDispatch);

router.get('/admin/errlog/:options',controller.errLogGet);
router.delete('/admin/errlog/:options',controller.errlogDelete);

router.get('/admin/moviecsv/:options',controller.moviecsvGet);
router.post('/admin/moviecsv',controller.moviecsvGet);

export default router;
