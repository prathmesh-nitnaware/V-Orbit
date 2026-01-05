export const matchResumeWithJD = (resumeSkills, jdText) => {
  const text = jdText.toLowerCase();

  const requiredSkills = {
    frontend: ["html", "css", "javascript", "react", "bootstrap"],
    backend: ["node", "express", "python", "java"],
    database: ["sql", "mysql", "postgresql", "mongodb"],
    dsa: ["algorithm", "data structure"],
    cs_core: ["os", "dbms", "computer networks"]
  };

  let matched = 0;
  let total = 0;
  const missingSkills = [];

  Object.keys(requiredSkills).forEach((category) => {
    const resumeCategory = resumeSkills[category] || [];

    requiredSkills[category].forEach((skill) => {
      if (text.includes(skill)) {
        total++;
        if (resumeCategory.includes(skill)) {
          matched++;
        } else {
          missingSkills.push(skill);
        }
      }
    });
  });

  const matchPercentage =
    total === 0 ? 0 : Math.round((matched / total) * 100);

  return {
    matchPercentage,
    missingSkills
  };
};
