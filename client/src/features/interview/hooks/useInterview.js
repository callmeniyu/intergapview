import { useContext } from "react";
import { InterviewContext } from "../contexts/interview.context";
import { createInterviewReport, getInterviewReport } from "../services/interview.api";

const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    return console.log("InterviewCOntext must be used inside a InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context;

  const handleCreateInterviewReport = async (resumeFile, selfDescription, jobDescription) => {
    setLoading(true);
    try {
      const data = await createInterviewReport(resumeFile, selfDescription, jobDescription);
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

  return { handleCreateInterviewReport, handleGetInterviewReport, handleGetAllInterviewReports, loading, report, reports };
};

export default useInterview;
