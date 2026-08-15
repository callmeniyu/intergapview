import { PDFParse } from "pdf-parse";
import { generateInterviewReport } from "../services/ai.services.js";
import Reports from "../models/report.model.js";

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
    res.status(500).json({ message: error });
  }
};
