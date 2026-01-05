import { useState } from "react";
import UploadResume from "../components/UploadResume";
import Chart from "../components/RadarChart";

export default function Career() {
  const [chartData, setChartData] = useState(null);

  return (
    <>
      <h3>Career Readiness</h3>
      <UploadResume onResult={(res) => setChartData(res.chartData)} />
      {chartData && <Chart data={chartData} />}
    </>
  );
}
