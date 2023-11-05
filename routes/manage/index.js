import express from "express";
import * as controller from "./manage.controller.js"
const router = express.Router();

router.get('/admin',controller.manageGet);

router.post('/admin/login',controller.adminLogin);
router.delete('/admin/logout',controller.adminLogout);
router.get('/admin/dashboard',controller.dashboard);

router.post('/admin/content',controller.contentsSearch);
router.put('/admin/content',controller.updateRow);

router.get('/admin/user/:userid',controller.userSearch);
router.delete('/admin/user/:userid',controller.userDelete);

router.post('/admin/ott',controller.ottManagePost);

router.post("/admin/jwcontent",controller.crawl);
router.get("/admin/mldata",controller.download);

router.get("/admin/ai",controller.train);
router.delete("/admin/ai",controller.stopTrain);

router.get("/admin/reccontent",controller.dispatch);
router.delete("/admin/reccontent",controller.stopDispatch);

router.get('/admin/errlog/:options',controller.errLogGet);

export default router;
