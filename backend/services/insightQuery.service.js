export const findRelevantContext = (documents, category, question) => {
  const q = question.toLowerCase();

  const filteredDocs = documents.filter(
    (d) => d.category === category
  );

  for (const doc of filteredDocs) {
    if (doc.text.toLowerCase().includes(q.split(" ")[0])) {
      return {
        context: doc.text.slice(0, 6000),
        source: doc.name
      };
    }
  }

  return null;
};
