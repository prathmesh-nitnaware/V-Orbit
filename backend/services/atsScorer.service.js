export const calculateATSScore = (resumeText, skills) => {
  let score = 0;
  const feedback = [];

  const totalSkills = Object.values(skills).flat().length;

  score += Math.min(totalSkills * 5, 50);

  if (resumeText.length > 1500) score += 20;
  else feedback.push("Resume content is too short");

  if (resumeText.includes("project")) score += 10;
  else feedback.push("Add more project details");

  if (resumeText.includes("intern")) score += 10;
  else feedback.push("Internship experience missing");

  return {
    atsScore: Math.min(score, 100),
    atsFeedback: feedback
  };
};
