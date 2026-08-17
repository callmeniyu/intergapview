import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { createInterviewReport, getAllInterviewReports, getInterviewReport } from "../controllers/interviewReport.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = Router();

/**
 * @route /api/interview/report/
 * @description Generate interview report from resume pdf, self description and job Description
 * @access private
 */

interviewRouter.post("/report", authUser, upload.single("resume"), createInterviewReport);

/**
 * @route /api/interview/report/[:id]/
 * @description Fetch specific report using report _id
 * @access private
 */
interviewRouter.get("/report/:id", authUser, getInterviewReport);

/**
 * @route /api/interview/reports/
 * @description Fetch all reports created by an user
 * @access private
 */
interviewRouter.get("/reports", authUser, getAllInterviewReports);

export default interviewRouter;
