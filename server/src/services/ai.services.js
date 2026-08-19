import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const reportSchema = z.object({
  jobTitle: z.string(),
  matchScore: z.number().min(0).max(100),
  technicalQuestions: z.array(z.object({ question: z.string(), intention: z.string(), answer: z.string() })),
  behavioralQuestions: z.array(z.object({ question: z.string(), intention: z.string(), answer: z.string() })),
  skillGaps: z.array(z.object({ skill: z.string(), severity: z.enum(["low", "medium", "high"]) })),
  preparationPlans: z.array(z.object({ day: z.number(), focus: z.string(), tasks: z.array(z.string()) })),
});

const reportJsonSchema = {
  type: "object",
  properties: {
    jobTitle: { type: "string" },
    matchScore: { type: "number", minimum: 0, maximum: 100 },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlans: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          focus: { type: "string" },
          tasks: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: ["jobTitle", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlans"],
};

export const generateInterviewReport = async ({ resumeText, selfDescription, jobDescription }) => {
  if (!resumeText || !selfDescription || !jobDescription) {
    throw new Error("Missing required parameters");
  }

  const prompt = `
You are an expert technical recruiter and interview preparation coach.

Analyze the candidate's resume, self-description, and target job description.

Generate an interview preparation report.

IMPORTANT:
The response MUST conform exactly to the provided JSON schema.

Do not return plain strings where the schema requires objects.

For technicalQuestions:
Each item must contain:
- question
- intention
- answer

For behavioralQuestions:
Each item must contain:
- question
- intention
- answer

For skillGaps:
Each item must contain:
- skill
- severity

For preparationPlans:
Each item must contain:
- day
- focus
- tasks

Do not add fields such as:
- summary
- strengths
- gaps

Do not invent candidate experience.

CANDIDATE RESUME:
${resumeText}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}
`;

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: reportJsonSchema,
      },
    });

    const raw = JSON.parse(interaction.output_text);
    console.log("Ai ouput", raw);

    const report = reportSchema.parse(raw);
    return report;
  } catch (error) {
    if (error?.status === 429) {
      throw new Error("Gemini API quota exceeded. Please check your Gemini API billing and quota.");
    }

    if (error instanceof z.ZodError) {
      console.error("Gemini returned invalid structured data:");
      console.error(error.issues);
    }

    console.error("Gemini API error:", error);
    throw error;
  }
};
