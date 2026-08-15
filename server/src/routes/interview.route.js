import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { createInterviewReport } from "../controllers/interviewReport.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = Router();

/**
 * @route /api/interview/
 * @description Generate interview report from resume pdf, self description and job Description
 * @access private
 */

interviewRouter.post("/report", authUser, upload.single("resume"), createInterviewReport);
export default interviewRouter;
