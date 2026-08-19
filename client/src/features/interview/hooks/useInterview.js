import { useCallback, useContext } from "react";
import { InterviewContext } from "../contexts/interview.context";
import { createInterviewReport, getAllInterviewReports, getInterviewReport } from "../services/interview.api";

const useInterview = () => {
  const context = useContext(InterviewContext);

  const { loading, setLoading, report, setReport, reports, setReports } = context ?? {};

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

  const handleGetAllInterviewReports = useCallback(async () => {
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
  }, [setLoading, setReports]);

  if (!context) {
    console.log("InterviewCOntext must be used inside a InterviewProvider");
    return null;
  }

  return { handleCreateInterviewReport, handleGetInterviewReport, handleGetAllInterviewReports, loading, report, reports };
};

export default useInterview;
