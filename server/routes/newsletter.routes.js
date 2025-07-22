import express from "express";
import { sendMessage } from "../controllers/newsletter.controller.js";
const router = express.Router();

router.post("/send", sendMessage);

export default sendMessage;
