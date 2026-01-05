import axios from "axios";

export const askInsight = async (question) => {
  const res = await axios.post(
    "http://localhost:3000/api/insight/ask",
    { question }
  );
  return res.data;
};
