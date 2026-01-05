import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

export default function SkillRadar({ data }) {
  return (
    <RadarChart width={400} height={300} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis angle={30} domain={[0, 100]} />
      <Radar name="Score" dataKey="A" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.6} />
    </RadarChart>
  );
}
