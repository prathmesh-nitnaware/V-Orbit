// NO AI. Deterministic. Stable.

export const parseResume = async (resumeText) => {
  const text = resumeText.toLowerCase();

  const extract = (keywords) =>
    keywords.filter((k) => text.includes(k));

  return {
    frontend: extract(["html", "css", "javascript", "react", "bootstrap"]),
    backend: extract(["node", "express", "java", "python"]),
    database: extract(["sql", "mysql", "postgresql", "mongodb"]),
    dsa: extract(["dsa", "algorithm", "data structure"]),
    cs_core: extract(["os", "operating system", "dbms", "computer networks"])
  };
};
