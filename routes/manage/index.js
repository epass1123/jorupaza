import express from "express";
import * as controller from "./manage.controller.js"
const router = express.Router();

router.get('/login',controller.manageGet);
router.post('/login/:adminid',controller.adminLogin);

export default router;
