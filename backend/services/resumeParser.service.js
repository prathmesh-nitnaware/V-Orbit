import { SKILLS } from "../ml/skillDictionary.js";
import { cleanText } from "../ml/textPreprocess.util.js";

export const parseResume = async (resumeText) => {
  const text = cleanText(resumeText);

  const extract = (keywords) =>
    keywords.filter((k) => text.includes(k));

  return {
    skills: {
      frontend: extract(SKILLS.frontend),
      backend: extract(SKILLS.backend),
      database: extract(SKILLS.database),
      dsa: extract(SKILLS.dsa),
      cs_core: extract(SKILLS.cs_core),
    }
  };
};
