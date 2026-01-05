import axios from "axios";

export const startMock = async (data) => {
  const res = await axios.post(
    "http://localhost:3000/api/mock/start",
    data
  );
  return res.data;
};
