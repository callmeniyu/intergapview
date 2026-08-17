import { PDFParse } from "pdf-parse";
import { generateInterviewReport } from "../services/ai.services.js";
import Reports from "../models/report.model.js";

/**
 * @name createInterviewReport
 * @description Generate interview report from resume pdf, self description and job Description
 * @access private
 */

export const createInterviewReport = async (req, res) => {
  try {
    const resumeContent = await new PDFParse(Uint8Array.from(req.file.buffer)).getText();
    const { selfDescription, jobDescription } = req.body;

    const generateReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    const report = await Reports.create({
      user: req.user.id,
      resumeText: resumeContent.text,
      jobDescription,
      selfDescription,
      ...generateReportByAi,
    });
    if (report) {
      res.status(201).json({ message: "Report Succesfully saved to DB", report });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

/**
 * @name getInterviewReport
 * @description Fetch specific report using report _id
 * @access private
 */

export const getInterviewReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Reports.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report fetched successfully", report });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

//create a JSDoc comment for getAllInterviewReports mentioning description, names, expecting parameters and access
/**
 * @name getAllInterviewReports
 * @description Fetch all reports created by an user
 * @access private
 */
export const getAllInterviewReports = async (req, res) => {
  try {
    const user = req.user;
    const reports = await Reports.find({ user: user.id });
    res.status(200).json({ message: "Reports fetched successfully", reports });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
