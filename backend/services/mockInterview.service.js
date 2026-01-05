import { callMistral } from "../config/mistral.config.js";

export const startInterview = async ({ skills, company }) => {
  const prompt = `
Generate 5 technical interview questions for a ${company} role.
Candidate skills: ${JSON.stringify(skills)}

Ask a mix of:
- Conceptual questions
- Practical coding/design questions
Return as a numbered list only.
`;

  const response = await callMistral(prompt);

  return {
    company,
    questions: response.split("\n").filter(Boolean)
  };
};
