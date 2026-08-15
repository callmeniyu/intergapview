import mongoose from "mongoose";

const technicalQuestionsSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, "Question is needed for technical questions"] },
    intention: { type: String, required: [true, "Intention is needed for technical questions"] },
    answer: { type: String, required: [true, "Answer is needed for technical questions"] },
  },
  { _id: false },
);

const behavioralQuestionsSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, "Question is needed for behavioral questions"] },
    intention: { type: String, required: [true, "Intention is needed for behavioral questions"] },
    answer: { type: String, required: [true, "Answer is needed for behavioral questions"] },
  },
  { _id: false },
);

const skillGapsSchema = new mongoose.Schema(
  {
    skill: { type: String, required: [true, "Skill gap is required"] },
    severity: { type: String, enum: ["low", "medium", "high"], required: [true, "Skill gap severity is required"] },
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: { type: Number, required: [true, "Number of day is required for preparation plan"] },
    focus: { type: String, required: [true, "Number of day is required for preparation plan"] },
    tasks: [{ type: String }],
  },
  { _id: false },
);

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    jobTitle: { type: String, required: [true, "Title of the job is required"] },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    jobDescription: { type: String, required: [true, "Job Description is required"] },
    resumeText: { type: String },
    selfDescription: { type: String },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps: [skillGapsSchema],
    preparationPlans: [preparationPlanSchema],
  },
  { timestamps: true },
);

const Reports = mongoose.model("reports", reportSchema);

export default Reports;
