import axios from "axios";

export const analyzeResume = async (data) => {
  const res = await axios.post(
    "http://localhost:3000/api/career/analyze",
    data
  );
  return res.data;
};
