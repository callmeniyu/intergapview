import { useCallback, useContext } from "react";
import { InterviewContext } from "../contexts/interview.context";
import { createInterviewReport, createResumePdf, getAllInterviewReports, getInterviewReport } from "../services/interview.api";

const useInterview = () => {
  const context = useContext(InterviewContext);

  const { loading, setLoading, report, setReport, reports, setReports, pdfBlob, setPdfBlob } = context ?? {};

  const handleCreateInterviewReport = async (resume, selfDescription, jobDescription) => {
    setLoading(true);
    try {
      const data = await createInterviewReport(resume, selfDescription, jobDescription);
      if (data) setReport(data?.report);
      return { ok: true, report: data?.report, message: data.message };
    } catch (error) {
      console.log(error);
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleGetInterviewReport = async (id) => {
    try {
      const data = await getInterviewReport(id);
      if (data) setReport(data?.report);
      return { ok: true, report: data?.report, message: data?.message };
    } catch (error) {
      console.log(error);
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllInterviewReports = async () => {
    try {
      const data = await getAllInterviewReports();
      if (data) setReports(data?.reports);
      return { ok: true, reports: data?.reports, message: data.message };
    } catch (error) {
      console.log(error);
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResumePdf = async (resume, selfDescription, jobDescription) => {
    if (pdfBlob) {
      const link = document.createElement("a");
      link.href = pdfBlob;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    setLoading(true);
    try {
      const data = await createResumePdf(resume, selfDescription, jobDescription);
      const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      setPdfBlob(url);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      return { ok: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  if (!context) {
    console.log("InterviewCOntext must be used inside a InterviewProvider");
    return null;
  }

  return { handleCreateInterviewReport, handleGetInterviewReport, handleGetAllInterviewReports, handleCreateResumePdf, loading, report, reports };
};

export default useInterview;
