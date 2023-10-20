import express from "express";
import * as controller from "./manage.controller.js"
const router = express.Router();

router.get('/',controller.manageGet);
router.post('/login/:adminid',controller.adminLogin);
router.get('/logout',controller.adminLogout);


export default router;
